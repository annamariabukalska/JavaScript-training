
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
    function children(element) {
        return Array.from(element.childNodes);
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

    // (31:1) {:else}
    function create_else_block(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Laster personer....";
    			add_location(h2, file, 31, 2, 619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(31:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#if person}
    function create_if_block(ctx) {
    	let article;
    	let h1;
    	let t0_value = /*person*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let p0;
    	let strong0;
    	let t3;
    	let t4_value = /*person*/ ctx[0].height + "";
    	let t4;
    	let t5;
    	let p1;
    	let strong1;
    	let t7;
    	let t8_value = /*person*/ ctx[0].mass + "";
    	let t8;
    	let t9;
    	let p2;
    	let strong2;
    	let t11;
    	let t12_value = /*person*/ ctx[0].eye_color + "";
    	let t12;
    	let t13;
    	let p3;
    	let strong3;
    	let t15;
    	let t16_value = /*person*/ ctx[0].birth_year + "";
    	let t16;
    	let t17;
    	let p4;
    	let strong4;
    	let t19;
    	let t20_value = /*person*/ ctx[0].gender + "";
    	let t20;

    	const block = {
    		c: function create() {
    			article = element("article");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Height:";
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Mass:";
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Eye color:";
    			t11 = space();
    			t12 = text(t12_value);
    			t13 = space();
    			p3 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "Birth Year:";
    			t15 = space();
    			t16 = text(t16_value);
    			t17 = space();
    			p4 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Gender:";
    			t19 = space();
    			t20 = text(t20_value);
    			add_location(h1, file, 23, 3, 302);
    			add_location(strong0, file, 24, 6, 331);
    			add_location(p0, file, 24, 3, 328);
    			add_location(strong1, file, 25, 6, 383);
    			add_location(p1, file, 25, 3, 380);
    			add_location(strong2, file, 26, 6, 431);
    			add_location(p2, file, 26, 3, 428);
    			add_location(strong3, file, 27, 6, 489);
    			add_location(p3, file, 27, 3, 486);
    			add_location(strong4, file, 28, 6, 549);
    			add_location(p4, file, 28, 3, 546);
    			add_location(article, file, 22, 2, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h1);
    			append_dev(h1, t0);
    			append_dev(article, t1);
    			append_dev(article, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(article, t5);
    			append_dev(article, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(article, t9);
    			append_dev(article, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, t11);
    			append_dev(p2, t12);
    			append_dev(article, t13);
    			append_dev(article, p3);
    			append_dev(p3, strong3);
    			append_dev(p3, t15);
    			append_dev(p3, t16);
    			append_dev(article, t17);
    			append_dev(article, p4);
    			append_dev(p4, strong4);
    			append_dev(p4, t19);
    			append_dev(p4, t20);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*person*/ 1 && t0_value !== (t0_value = /*person*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*person*/ 1 && t4_value !== (t4_value = /*person*/ ctx[0].height + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*person*/ 1 && t8_value !== (t8_value = /*person*/ ctx[0].mass + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*person*/ 1 && t12_value !== (t12_value = /*person*/ ctx[0].eye_color + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*person*/ 1 && t16_value !== (t16_value = /*person*/ ctx[0].birth_year + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*person*/ 1 && t20_value !== (t20_value = /*person*/ ctx[0].gender + "")) set_data_dev(t20, t20_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:1) {#if person}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*person*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			add_location(main, file, 19, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
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
    	let personId = 1;
    	let person;

    	const getPerson = async () => {
    		const response = await fetch(`https://swapi.co/api/people/${personId} /`);
    		const json = await response.json();
    		$$invalidate(0, person = json);
    		console.log(person);
    	};

    	getPerson();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ personId, person, getPerson });

    	$$self.$inject_state = $$props => {
    		if ("personId" in $$props) personId = $$props.personId;
    		if ("person" in $$props) $$invalidate(0, person = $$props.person);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [person];
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
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
