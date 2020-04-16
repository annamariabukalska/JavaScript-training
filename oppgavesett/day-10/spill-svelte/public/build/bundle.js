
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
    	let svelt_window;
    	let t0;
    	let section;
    	let header;
    	let t1_1;
    	let t2_1;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let main;
    	let div;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let div_class_value;
    	let t14;
    	let footer;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			svelt_window = element("svelt:window");
    			t0 = space();
    			section = element("section");
    			header = element("header");
    			t1_1 = text("Fasit: ");
    			t2_1 = text(/*fasit*/ ctx[3]);
    			t3 = text(" \n\tSvar:  ");
    			t4 = text(/*svar*/ ctx[1]);
    			t5 = text("\n\tHar du svar riktig: ");
    			t6 = text(/*riktigsvar*/ ctx[2]);
    			t7 = space();
    			main = element("main");
    			div = element("div");
    			t8 = text(/*regnestykke*/ ctx[4]);
    			t9 = space();
    			t10 = text(/*t1*/ ctx[5]);
    			t11 = text(" * ");
    			t12 = text(/*t2*/ ctx[6]);
    			t13 = text(" = ?");
    			t14 = space();
    			footer = element("footer");
    			input = element("input");
    			add_location(svelt_window, file, 36, 0, 577);
    			add_location(header, file, 38, 0, 626);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*klasse*/ ctx[0]) + " svelte-1lzcjhj"));
    			add_location(div, file, 44, 1, 719);
    			attr_dev(main, "class", "svelte-1lzcjhj");
    			add_location(main, file, 43, 0, 711);
    			attr_dev(input, "type", "numer");
    			add_location(input, file, 50, 1, 826);
    			add_location(footer, file, 49, 0, 816);
    			attr_dev(section, "class", "svelte-1lzcjhj");
    			add_location(section, file, 37, 0, 616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, svelt_window, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, header);
    			append_dev(header, t1_1);
    			append_dev(header, t2_1);
    			append_dev(header, t3);
    			append_dev(header, t4);
    			append_dev(header, t5);
    			append_dev(header, t6);
    			append_dev(section, t7);
    			append_dev(section, main);
    			append_dev(main, div);
    			append_dev(div, t8);
    			append_dev(div, t9);
    			append_dev(div, t10);
    			append_dev(div, t11);
    			append_dev(div, t12);
    			append_dev(div, t13);
    			append_dev(section, t14);
    			append_dev(section, footer);
    			append_dev(footer, input);
    			set_input_value(input, /*svar*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(svelt_window, "click", /*lahNyeTall*/ ctx[9], false, false, false),
    				listen_dev(div, "animationed", /*gameOver*/ ctx[8], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[12]),
    				listen_dev(input, "input", /*sjekkSvar*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fasit*/ 8) set_data_dev(t2_1, /*fasit*/ ctx[3]);
    			if (dirty & /*svar*/ 2) set_data_dev(t4, /*svar*/ ctx[1]);
    			if (dirty & /*riktigsvar*/ 4) set_data_dev(t6, /*riktigsvar*/ ctx[2]);
    			if (dirty & /*regnestykke*/ 16) set_data_dev(t8, /*regnestykke*/ ctx[4]);
    			if (dirty & /*t1*/ 32) set_data_dev(t10, /*t1*/ ctx[5]);
    			if (dirty & /*t2*/ 64) set_data_dev(t12, /*t2*/ ctx[6]);

    			if (dirty & /*klasse*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*klasse*/ ctx[0]) + " svelte-1lzcjhj"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*svar*/ 2) {
    				set_input_value(input, /*svar*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelt_window);
    			if (detaching) detach_dev(t0);
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
    	let svar = "";

    	const sjekkSvar = () => {
    		if (riktigsvar) {
    			$$invalidate(0, klasse = ""); /*tar bort tall fra rammen*/

    			setTimeout(
    				() => {
    					$$invalidate(0, klasse = "faller");
    				},
    				1000
    			);
    		}
    	};

    	const gameOver = () => {
    		console.log("GAME OVER");
    	};

    	let tall1 = Math.random();
    	let tall2 = Math.random();

    	const lahNyeTall = () => {
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		svar = this.value;
    		$$invalidate(1, svar);
    	}

    	$$self.$capture_state = () => ({
    		klasse,
    		svar,
    		sjekkSvar,
    		gameOver,
    		tall1,
    		tall2,
    		lahNyeTall,
    		riktigsvar,
    		fasit,
    		regnestykke,
    		t1,
    		t2
    	});

    	$$self.$inject_state = $$props => {
    		if ("klasse" in $$props) $$invalidate(0, klasse = $$props.klasse);
    		if ("svar" in $$props) $$invalidate(1, svar = $$props.svar);
    		if ("tall1" in $$props) $$invalidate(10, tall1 = $$props.tall1);
    		if ("tall2" in $$props) $$invalidate(11, tall2 = $$props.tall2);
    		if ("riktigsvar" in $$props) $$invalidate(2, riktigsvar = $$props.riktigsvar);
    		if ("fasit" in $$props) $$invalidate(3, fasit = $$props.fasit);
    		if ("regnestykke" in $$props) $$invalidate(4, regnestykke = $$props.regnestykke);
    		if ("t1" in $$props) $$invalidate(5, t1 = $$props.t1);
    		if ("t2" in $$props) $$invalidate(6, t2 = $$props.t2);
    	};

    	let riktigsvar;
    	let regnestykke;
    	let t1;
    	let t2;
    	let fasit;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*t1, t2*/ 96) {
    			 $$invalidate(3, fasit = t1 * t2);
    		}

    		if ($$self.$$.dirty & /*fasit, svar*/ 10) {
    			 $$invalidate(2, riktigsvar = fasit === svar);
    		}

    		if ($$self.$$.dirty & /*fasit*/ 8) {
    			 $$invalidate(4, regnestykke = `${tall1} * ${tall2} = ${fasit}`);
    		}
    	};

    	 $$invalidate(5, t1 = Math.ceil(tall1));
    	 $$invalidate(6, t2 = Math.ceil(tall2));

    	return [
    		klasse,
    		svar,
    		riktigsvar,
    		fasit,
    		regnestykke,
    		t1,
    		t2,
    		sjekkSvar,
    		gameOver,
    		lahNyeTall,
    		tall1,
    		tall2,
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
