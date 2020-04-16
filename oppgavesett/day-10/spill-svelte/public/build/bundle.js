
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.20.1 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let section;
    	let header;
    	let div0;
    	let label0;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let div1;
    	let label1;
    	let t5;
    	let p1;
    	let t7;
    	let main;
    	let div2;
    	let t8;
    	let div2_class_value;
    	let t9;
    	let footer;
    	let input;
    	let input_updating = false;
    	let dispose;

    	function input_input_handler() {
    		input_updating = true;
    		/*input_input_handler*/ ctx[12].call(input);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			header = element("header");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Poeng";
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*poeng*/ ctx[2]);
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Highscore";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "0";
    			t7 = space();
    			main = element("main");
    			div2 = element("div");
    			t8 = text(/*regnestykke*/ ctx[3]);
    			t9 = space();
    			footer = element("footer");
    			input = element("input");
    			attr_dev(label0, "class", "svelte-y4a1r8");
    			add_location(label0, file, 40, 3, 652);
    			attr_dev(p0, "class", "svelte-y4a1r8");
    			add_location(p0, file, 41, 3, 676);
    			attr_dev(div0, "class", "poeng svelte-y4a1r8");
    			add_location(div0, file, 39, 2, 629);
    			attr_dev(label1, "class", "svelte-y4a1r8");
    			add_location(label1, file, 44, 3, 725);
    			attr_dev(p1, "class", "svelte-y4a1r8");
    			add_location(p1, file, 45, 3, 753);
    			attr_dev(div1, "class", "poeng svelte-y4a1r8");
    			add_location(div1, file, 43, 2, 702);
    			attr_dev(header, "class", "svelte-y4a1r8");
    			add_location(header, file, 38, 1, 618);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*klasse*/ ctx[0]) + " svelte-y4a1r8"));
    			add_location(div2, file, 50, 2, 795);
    			attr_dev(main, "class", "svelte-y4a1r8");
    			add_location(main, file, 49, 1, 786);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-y4a1r8");
    			add_location(input, file, 54, 2, 888);
    			attr_dev(footer, "class", "svelte-y4a1r8");
    			add_location(footer, file, 53, 1, 877);
    			attr_dev(section, "class", "svelte-y4a1r8");
    			add_location(section, file, 37, 0, 607);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, section, anchor);
    			append_dev(section, header);
    			append_dev(header, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(header, t3);
    			append_dev(header, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(section, t7);
    			append_dev(section, main);
    			append_dev(main, div2);
    			append_dev(div2, t8);
    			append_dev(section, t9);
    			append_dev(section, footer);
    			append_dev(footer, input);
    			set_input_value(input, /*svar*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(div2, "animationend", /*gameOver*/ ctx[5], false, false, false),
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(input, "input", /*sjekkSvar*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*poeng*/ 4) set_data_dev(t2, /*poeng*/ ctx[2]);
    			if (dirty & /*regnestykke*/ 8) set_data_dev(t8, /*regnestykke*/ ctx[3]);

    			if (dirty & /*klasse*/ 1 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*klasse*/ ctx[0]) + " svelte-y4a1r8"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!input_updating && dirty & /*svar*/ 2) {
    				set_input_value(input, /*svar*/ ctx[1]);
    			}

    			input_updating = false;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let klasse = "faller";
    	let tall1 = 9;
    	let tall2 = 5;
    	let svar = "";
    	let theGameIsOn = true;
    	let poeng = 0;

    	const lagNyeTall = () => {
    		$$invalidate(6, tall1 = Math.ceil(Math.random() * 10));
    		$$invalidate(7, tall2 = Math.ceil(Math.random() * 10));
    	};

    	const sjekkSvar = () => {
    		if (riktigsvar && theGameIsOn) {
    			lagNyeTall();
    			$$invalidate(1, svar = "");
    			$$invalidate(0, klasse = "");
    			$$invalidate(2, poeng++, poeng);

    			setTimeout(
    				() => {
    					$$invalidate(0, klasse = "faller");
    				},
    				50
    			);
    		}
    	};

    	const gameOver = () => {
    		theGameIsOn = false;
    		console.log("GAME OVER");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		svar = to_number(this.value);
    		$$invalidate(1, svar);
    	}

    	$$self.$capture_state = () => ({
    		klasse,
    		tall1,
    		tall2,
    		svar,
    		theGameIsOn,
    		poeng,
    		lagNyeTall,
    		sjekkSvar,
    		gameOver,
    		fasit,
    		riktigsvar,
    		regnestykke
    	});

    	$$self.$inject_state = $$props => {
    		if ("klasse" in $$props) $$invalidate(0, klasse = $$props.klasse);
    		if ("tall1" in $$props) $$invalidate(6, tall1 = $$props.tall1);
    		if ("tall2" in $$props) $$invalidate(7, tall2 = $$props.tall2);
    		if ("svar" in $$props) $$invalidate(1, svar = $$props.svar);
    		if ("theGameIsOn" in $$props) theGameIsOn = $$props.theGameIsOn;
    		if ("poeng" in $$props) $$invalidate(2, poeng = $$props.poeng);
    		if ("fasit" in $$props) $$invalidate(9, fasit = $$props.fasit);
    		if ("riktigsvar" in $$props) riktigsvar = $$props.riktigsvar;
    		if ("regnestykke" in $$props) $$invalidate(3, regnestykke = $$props.regnestykke);
    	};

    	let fasit;
    	let riktigsvar;
    	let regnestykke;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tall1, tall2*/ 192) {
    			 $$invalidate(9, fasit = tall1 * tall2);
    		}

    		if ($$self.$$.dirty & /*fasit, svar*/ 514) {
    			 riktigsvar = fasit === svar;
    		}

    		if ($$self.$$.dirty & /*tall1, tall2*/ 192) {
    			 $$invalidate(3, regnestykke = `${tall1} x ${tall2}`);
    		}
    	};

    	return [
    		klasse,
    		svar,
    		poeng,
    		regnestykke,
    		sjekkSvar,
    		gameOver,
    		tall1,
    		tall2,
    		theGameIsOn,
    		fasit,
    		riktigsvar,
    		lagNyeTall,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    window.app = app;

    return app;

}());
//# sourceMappingURL=bundle.js.map
