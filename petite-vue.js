/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
 function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item)
                ? parseStringStyle(item)
                : normalizeStyle(item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    }
    else if (isString(value)) {
        return value;
    }
    else if (isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    }
    else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
                res += normalized + ' ';
            }
        }
    }
    else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}

function looseCompareArrays(a, b) {
    if (a.length !== b.length)
        return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
    }
    return equal;
}
function looseEqual(a, b) {
    if (a === b)
        return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
        /* istanbul ignore if: this if will probably never be called */
        if (!aValidType || !bValidType) {
            return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
            return false;
        }
        for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if ((aHasKey && !bHasKey) ||
                (!aHasKey && bHasKey) ||
                !looseEqual(a[key], b[key])) {
                return false;
            }
        }
    }
    return String(a) === String(b);
}
function looseIndexOf(arr, val) {
    return arr.findIndex(item => looseEqual(item, val));
}
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === '[object Map]';
const isDate = (val) => val instanceof Date;
const isString = (val) => typeof val === 'string';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString(value).slice(8, -1);
};
const isIntegerKey = (key) => isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key;
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
const camelizeRE = /-(\w)/g;
/**
 * @private
 */
const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
};

let activeEffectScope;
function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
        scope.effects.push(effect);
    }
}

const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].w |= trackOpBit; // set was tracked
        }
    }
};
const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
        let ptr = 0;
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            if (wasTracked(dep) && !newTracked(dep)) {
                dep.delete(effect);
            }
            else {
                deps[ptr++] = dep;
            }
            // clear bits
            dep.w &= ~trackOpBit;
            dep.n &= ~trackOpBit;
        }
        deps.length = ptr;
    }
};

const targetMap = new WeakMap();
// The number of effects currently being tracked recursively.
let effectTrackDepth = 0;
let trackOpBit = 1;
/**
 * The bitwise track markers support at most 30 levels of recursion.
 * This value is chosen to enable modern JS engines to use a SMI on all platforms.
 * When recursion depth is greater, fall back to using a full cleanup.
 */
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol('');
const MAP_KEY_ITERATE_KEY = Symbol('');
class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        this.parent = undefined;
        recordEffectScope(this, scope);
    }
    run() {
        if (!this.active) {
            return this.fn();
        }
        let parent = activeEffect;
        let lastShouldTrack = shouldTrack;
        while (parent) {
            if (parent === this) {
                return;
            }
            parent = parent.parent;
        }
        try {
            this.parent = activeEffect;
            activeEffect = this;
            shouldTrack = true;
            trackOpBit = 1 << ++effectTrackDepth;
            if (effectTrackDepth <= maxMarkerBits) {
                initDepMarkers(this);
            }
            else {
                cleanupEffect(this);
            }
            return this.fn();
        }
        finally {
            if (effectTrackDepth <= maxMarkerBits) {
                finalizeDepMarkers(this);
            }
            trackOpBit = 1 << --effectTrackDepth;
            activeEffect = this.parent;
            shouldTrack = lastShouldTrack;
            this.parent = undefined;
        }
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
function effect$1(fn, options) {
    if (fn.effect) {
        fn = fn.effect.fn;
    }
    const _effect = new ReactiveEffect(fn);
    if (options) {
        extend(_effect, options);
        if (options.scope)
            recordEffectScope(_effect, options.scope);
    }
    if (!options || !options.lazy) {
        _effect.run();
    }
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        trackEffects(dep);
    }
}
function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack = false;
    if (effectTrackDepth <= maxMarkerBits) {
        if (!newTracked(dep)) {
            dep.n |= trackOpBit; // set newly tracked
            shouldTrack = !wasTracked(dep);
        }
    }
    else {
        // Full cleanup mode.
        shouldTrack = !dep.has(activeEffect);
    }
    if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    let deps = [];
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        deps = [...depsMap.values()];
    }
    else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                deps.push(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            deps.push(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        switch (type) {
            case "add" /* ADD */:
                if (!isArray(target)) {
                    deps.push(depsMap.get(ITERATE_KEY));
                    if (isMap(target)) {
                        deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                    }
                }
                else if (isIntegerKey(key)) {
                    // new index added to array -> length changes
                    deps.push(depsMap.get('length'));
                }
                break;
            case "delete" /* DELETE */:
                if (!isArray(target)) {
                    deps.push(depsMap.get(ITERATE_KEY));
                    if (isMap(target)) {
                        deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                    }
                }
                break;
            case "set" /* SET */:
                if (isMap(target)) {
                    deps.push(depsMap.get(ITERATE_KEY));
                }
                break;
        }
    }
    if (deps.length === 1) {
        if (deps[0]) {
            {
                triggerEffects(deps[0]);
            }
        }
    }
    else {
        const effects = [];
        for (const dep of deps) {
            if (dep) {
                effects.push(...dep);
            }
        }
        {
            triggerEffects(createDep(effects));
        }
    }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
    // spread into array for stabilization
    for (const effect of isArray(dep) ? dep : [...dep]) {
        if (effect !== activeEffect || effect.allowRecurse) {
            if (effect.scheduler) {
                effect.scheduler();
            }
            else {
                effect.run();
            }
        }
    }
}

const isNonTrackableKeys = /*#__PURE__*/ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(isSymbol));
const get = /*#__PURE__*/ createGetter();
const readonlyGet = /*#__PURE__*/ createGetter(true);
const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations();
function createArrayInstrumentations() {
    const instrumentations = {};
    ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
        instrumentations[key] = function (...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
                track(arr, "get" /* GET */, i + '');
            }
            // we run the method using the original args first (which may be reactive)
            const res = arr[key](...args);
            if (res === -1 || res === false) {
                // if that didn't work, run it again using raw values.
                return arr[key](...args.map(toRaw));
            }
            else {
                return res;
            }
        };
    });
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
        instrumentations[key] = function (...args) {
            pauseTracking();
            const res = toRaw(this)[key].apply(this, args);
            resetTracking();
            return res;
        };
    });
    return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_isShallow" /* IS_SHALLOW */) {
            return shallow;
        }
        else if (key === "__v_raw" /* RAW */ &&
            receiver ===
                (isReadonly
                    ? shallow
                        ? shallowReadonlyMap
                        : readonlyMap
                    : shallow
                        ? shallowReactiveMap
                        : reactiveMap).get(target)) {
            return target;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
        }
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            // ref unwrapping - does not apply for Array + integer key.
            const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
            return shouldUnwrap ? res.value : res;
        }
        if (isObject(res)) {
            // Convert returned value into a proxy as well. we do the isObject check
            // here to avoid invalid value warning. Also need to lazy access readonly
            // and reactive here to avoid circular dependency.
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = /*#__PURE__*/ createSetter();
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        let oldValue = target[key];
        if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
            return false;
        }
        if (!shallow && !isReadonly(value)) {
            if (!isShallow(value)) {
                value = toRaw(value);
                oldValue = toRaw(oldValue);
            }
            if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = isArray(target) && isIntegerKey(key)
            ? Number(key) < target.length
            : hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if (hasChanged(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has" /* HAS */, key);
    }
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, isArray(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        return true;
    },
    deleteProperty(target, key) {
        return true;
    }
};

const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return 1 /* COMMON */;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return 2 /* COLLECTION */;
        default:
            return 0 /* INVALID */;
    }
}
function getTargetType(value) {
    return value["__v_skip" /* SKIP */] || !Object.isExtensible(value)
        ? 0 /* INVALID */
        : targetTypeMap(toRawType(value));
}
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (isReadonly(target)) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, null, reactiveMap);
}
/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, null, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* RAW */] &&
        !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
        return target;
    }
    // target already has corresponding Proxy
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // only a whitelist of value types can be observed.
    const targetType = getTargetType(target);
    if (targetType === 0 /* INVALID */) {
        return target;
    }
    const proxy = new Proxy(target, targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
}
function isShallow(value) {
    return !!(value && value["__v_isShallow" /* IS_SHALLOW */]);
}
function toRaw(observed) {
    const raw = observed && observed["__v_raw" /* RAW */];
    return raw ? toRaw(raw) : observed;
}
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
Promise.resolve();

let t$2=!1;const o=[],n=Promise.resolve();const nextTick=e=>n.then(e),queueJob=e=>{o.includes(e)||o.push(e),t$2||(t$2=!0,nextTick(s));};const s=()=>{for(const e of o)e();o.length=0,t$2=!1;};

const b=/^(spellcheck|draggable|form|list|type)$/;const bind=({el:s,get:i,effect:t,arg:e,modifiers:c})=>{let n;e==="class"&&(s._class=s.className),t(()=>{let r=i();if(e)c?.camel&&(e=camelize(e)),f$1(s,e,r,n);else {for(const o in r)f$1(s,o,r[o],n&&n[o]);for(const o in n)(!r||!(o in r))&&f$1(s,o,null);}n=r;});};const f$1=(s,i,t,e)=>{if(i==="class")s.setAttribute("class",normalizeClass(s._class?[s._class,t]:t)||"");else if(i==="style"){t=normalizeStyle(t);const{style:c}=s;if(!t)s.removeAttribute("style");else if(isString(t))t!==e&&(c.cssText=t);else {for(const n in t)l$1(c,n,t[n]);if(e&&!isString(e))for(const n in e)t[n]==null&&l$1(c,n,"");}}else !(s instanceof SVGElement)&&i in s&&!b.test(i)?(s[i]=t,i==="value"&&(s._value=t)):i==="true-value"?s._trueValue=t:i==="false-value"?s._falseValue=t:t!=null?s.setAttribute(i,t):s.removeAttribute(i);},m$1=/\s*!important$/,l$1=(s,i,t)=>{isArray(t)?t.forEach(e=>l$1(s,i,e)):i.startsWith("--")?s.setProperty(i,t):m$1.test(t)?s.setProperty(hyphenate(i),t.replace(m$1,""),"important"):s[i]=t;};

const checkAttr=(t,e)=>{const n=t.getAttribute(e);return n!=null&&t.removeAttribute(e),n},listen=(t,e,n,r)=>{t.addEventListener(e,n,r);};

const l=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,f=["ctrl","shift","alt","meta"],y$1={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,i)=>f.some(o=>e[`${o}Key`]&&!i[o])};const on=({el:e,get:i,exp:o,arg:t,modifiers:n})=>{if(!t){return}let r=l.test(o)?i(`(e => ${o}(e))`):i(`($event => { ${o} })`);if(t==="vue:mounted"){nextTick(r);return}else if(t==="vue:unmounted")return ()=>r();if(n){t==="click"&&(n.right&&(t="contextmenu"),n.middle&&(t="mouseup"));const a=r;r=s=>{if(!("key"in s&&!(hyphenate(s.key)in n))){for(const v in n){const u=y$1[v];if(u&&u(s,n))return}return a(s)}};}listen(e,t,r,n);};

const show=({el:i,get:t,effect:e})=>{const s=i.style.display;e(()=>{i.style.display=t()?s:"none";});};

const text=({el:t,get:i,effect:n})=>{n(()=>{t.textContent=toDisplayString(i());});},toDisplayString=t=>t==null?"":isObject(t)?JSON.stringify(t,null,2):String(t);

const html=({el:e,get:i,effect:r})=>{r(()=>{e.innerHTML=i();});};

const model=({el:e,exp:a,get:s,effect:p,modifiers:T})=>{const f=e.type,u=s(`(val) => { ${a} = val }`),{trim:y,number:L=f==="number"}=T||{};if(e.tagName==="SELECT"){const n=e;listen(e,"change",()=>{const t=Array.prototype.filter.call(n.options,o=>o.selected).map(o=>L?toNumber(c$1(o)):c$1(o));u(n.multiple?t:t[0]);}),p(()=>{const t=s(),o=n.multiple;for(let i=0,d=n.options.length;i<d;i++){const l=n.options[i],m=c$1(l);if(o)isArray(t)?l.selected=looseIndexOf(t,m)>-1:l.selected=t.has(m);else if(looseEqual(c$1(l),t)){n.selectedIndex!==i&&(n.selectedIndex=i);return}}!o&&n.selectedIndex!==-1&&(n.selectedIndex=-1);});}else if(f==="checkbox"){listen(e,"change",()=>{const t=s(),o=e.checked;if(isArray(t)){const i=c$1(e),d=looseIndexOf(t,i),l=d!==-1;if(o&&!l)u(t.concat(i));else if(!o&&l){const m=[...t];m.splice(d,1),u(m);}}else u(H(e,o));});let n;p(()=>{const t=s();isArray(t)?e.checked=looseIndexOf(t,c$1(e))>-1:t!==n&&(e.checked=looseEqual(t,H(e,!0))),n=t;});}else if(f==="radio"){listen(e,"change",()=>{u(c$1(e));});let n;p(()=>{const t=s();t!==n&&(e.checked=looseEqual(t,c$1(e)));});}else {const n=t=>y?t.trim():L?toNumber(t):t;listen(e,"compositionstart",V),listen(e,"compositionend",h),listen(e,T?.lazy?"change":"input",()=>{e.composing||u(n(e.value));}),y&&listen(e,"change",()=>{e.value=e.value.trim();}),p(()=>{if(e.composing)return;const t=e.value,o=s();document.activeElement===e&&n(t)===o||t!==o&&(e.value=o);});}};const c$1=e=>"_value"in e?e._value:e.value,H=(e,a)=>{const s=a?"_trueValue":"_falseValue";return s in e?e[s]:a},V=e=>{e.target.composing=!0;},h=e=>{const a=e.target;a.composing&&(a.composing=!1,I(a,"input"));},I=(e,a)=>{const s=document.createEvent("HTMLEvents");s.initEvent(a,!0,!0),e.dispatchEvent(s);};

const t$1=Object.create(null);const evaluate=(e,n,r)=>execute(e,`return(${n})`,r),execute=(e,n,r)=>{const o=t$1[n]||(t$1[n]=a$1(n));try{return o(e,r)}catch(c){console.error(c);}};const a$1=e=>{try{return new Function("$data","$el",`with($data){${e}}`)}catch(n){return console.error(`${n.message} in expression: ${e}`),()=>{}}};

const effect=({el:e,ctx:t,exp:o,effect:r})=>{nextTick(()=>r(()=>execute(t.scope,o,e)));};

const builtInDirectives={bind:bind,on:on,show:show,text:text,html:html,model:model,effect:effect};

const _if=(e,f,l)=>{const n=e.parentElement,i=new Comment("v-if");n.insertBefore(i,e);const m=[{exp:f,el:e}];let r,s;for(;(r=e.nextElementSibling)&&(s=null,checkAttr(r,"v-else")===""||(s=checkAttr(r,"v-else-if")));)n.removeChild(r),m.push({exp:s,el:r});const h=e.nextSibling;n.removeChild(e);let t,c=-1;const a=()=>{t&&(n.insertBefore(i,t.el),t.remove(),t=void 0);};return l.effect(()=>{for(let o=0;o<m.length;o++){const{exp:p,el:u}=m[o];if(!p||evaluate(l.scope,p)){o!==c&&(a(),t=new Block(u,l),t.insert(n,i),n.removeChild(i),c=o);return}}c=-1,a();}),h};

const _=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,S=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,J=/^\(|\)$/g,P=/^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/;const _for=(s,M,g)=>{const C=M.match(_);if(!C){return}const $=s.nextSibling,k=s.parentElement,y=new Text("");k.insertBefore(y,s),k.removeChild(s);const K=C[2].trim();let f=C[1].trim().replace(J,"").trim(),b,I=!1,d,E,u="key",x=s.getAttribute(u)||s.getAttribute(u=":key")||s.getAttribute(u="v-bind:key");x&&(s.removeAttribute(u),u==="key"&&(x=JSON.stringify(x)));let p;(p=f.match(S))&&(f=f.replace(S,"").trim(),d=p[1].trim(),p[2]&&(E=p[2].trim())),(p=f.match(P))&&(b=p[1].split(",").map(n=>n.trim()),I=f[0]==="[");let A=!1,l,h,v;const R=n=>{const r=new Map,e=[];if(isArray(n))for(let t=0;t<n.length;t++)e.push(B(r,n[t],t));else if(typeof n=="number")for(let t=0;t<n;t++)e.push(B(r,t+1,t));else if(isObject(n)){let t=0;for(const o in n)e.push(B(r,n[o],t++,o));}return [e,r]},B=(n,r,e,t)=>{const o={};b?b.forEach((a,c)=>o[a]=r[I?c:a]):o[f]=r,t?(d&&(o[d]=t),E&&(o[E]=e)):d&&(o[d]=e);const m=createScopedContext(g,o),i=x?evaluate(m.scope,x):e;return n.set(i,e),m.key=i,m},w=(n,r)=>{const e=new Block(s,n);return e.key=n.key,e.insert(k,r),e};return g.effect(()=>{const n=evaluate(g.scope,K),r=v;if([h,v]=R(n),!A)l=h.map(e=>w(e,y)),A=!0;else {for(let i=0;i<l.length;i++)v.has(l[i].key)||l[i].remove();const e=[];let t=h.length,o,m;for(;t--;){const i=h[t],a=r.get(i.key);let c;a==null?c=w(i,o?o.el:y):(c=l[a],Object.assign(c.ctx.scope,i.scope),a!==t&&(l[a+1]!==o||m===o)&&(m=c,c.insert(k,o?o.el:y))),e.unshift(o=c);}l=e;}}),$};

const ref=({el:c,ctx:{scope:{$refs:t}},get:i,effect:o})=>{let e;return o(()=>{const r=i();t[r]=c,e&&r!==e&&delete t[e],e=r;}),()=>{e&&delete t[e];}};

const y=/^(?:v-|:|@)/,N=/\.([\w-]+)/g;let inOnce=!1;const walk=(o,e)=>{const r=o.nodeType;if(r===1){const t=o;if(t.hasAttribute("v-pre"))return;checkAttr(t,"v-cloak");let n;if(n=checkAttr(t,"v-if"))return _if(t,n,e);if(n=checkAttr(t,"v-for"))return _for(t,n,e);if((n=checkAttr(t,"v-scope"))||n===""){const i=n?evaluate(e.scope,n):{};e=createScopedContext(e,i),i.$template&&$(t,i.$template);}const s=checkAttr(t,"v-once")!=null;s&&(inOnce=!0),(n=checkAttr(t,"ref"))&&m(t,ref,`"${n}"`,e),a(t,e);const l=[];for(const{name:i,value:f}of [...t.attributes])y.test(i)&&i!=="v-cloak"&&(i==="v-model"?l.unshift([i,f]):i[0]==="@"||/^v-on\b/.test(i)?l.push([i,f]):g(t,i,f,e));for(const[i,f]of l)g(t,i,f,e);s&&(inOnce=!1);}else if(r===3){const t=o.data;if(t.includes(e.delimiters[0])){let n=[],s=0,l;for(;l=e.delimitersRE.exec(t);){const i=t.slice(s,l.index);i&&n.push(JSON.stringify(i)),n.push(`$s(${l[1]})`),s=l.index+l[0].length;}s<t.length&&n.push(JSON.stringify(t.slice(s))),m(o,text,n.join("+"),e);}}else r===11&&a(o,e);};const a=(o,e)=>{let r=o.firstChild;for(;r;)r=walk(r,e)||r.nextSibling;},g=(o,e,r,t)=>{let n,s,l;if(e=e.replace(N,(i,f)=>((l||(l={}))[f]=!0,"")),e[0]===":")n=bind,s=e.slice(1);else if(e[0]==="@")n=on,s=e.slice(1);else {const i=e.indexOf(":"),f=i>0?e.slice(2,i):e.slice(2);n=builtInDirectives[f]||t.dirs[f],s=i>0?e.slice(i+1):void 0;}n?(n===bind&&s==="ref"&&(n=ref),m(o,n,r,t,s,l),o.removeAttribute(e)):false;},m=(o,e,r,t,n,s)=>{const i=e({el:o,get:(f=r)=>evaluate(t.scope,f,o),effect:t.effect,ctx:t,exp:r,arg:n,modifiers:s});i&&t.cleanups.push(i);},$=(o,e)=>{if(e[0]==="#"){const r=document.querySelector(e);o.appendChild(r.content.cloneNode(!0));return}o.innerHTML=e;};

const createContext=e=>{const t={delimiters:["{{","}}"],delimitersRE:/\{\{([^]+?)\}\}/g,...e,scope:e?e.scope:reactive({}),dirs:e?e.dirs:{},effects:[],blocks:[],cleanups:[],effect:r=>{if(inOnce)return queueJob(r),r;const o=effect$1(r,{scheduler:()=>queueJob(o)});return t.effects.push(o),o}};return t},createScopedContext=(e,t={})=>{const r=e.scope,o=Object.create(r);Object.defineProperties(o,Object.getOwnPropertyDescriptors(t)),o.$refs=Object.create(r.$refs);const c=reactive(new Proxy(o,{set(s,n,i,f){return f===c&&!s.hasOwnProperty(n)?Reflect.set(r,n,i):Reflect.set(s,n,i,f)}}));return bindContextMethods(c),{...e,scope:c}},bindContextMethods=e=>{for(const t of Object.keys(e))typeof e[t]=="function"&&(e[t]=e[t].bind(e));};

class Block{template;ctx;key;parentCtx;isFragment;start;end;get el(){return this.start||this.template}constructor(t,e,s=!1){this.isFragment=t instanceof HTMLTemplateElement,s?this.template=t:this.isFragment?this.template=t.content.cloneNode(!0):this.template=t.cloneNode(!0),s?this.ctx=e:(this.parentCtx=e,e.blocks.push(this),this.ctx=createContext(e)),walk(this.template,this.ctx);}insert(t,e=null){if(this.isFragment)if(this.start){let s=this.start,i;for(;s&&(i=s.nextSibling,t.insertBefore(s,e),s!==this.end);)s=i;}else this.start=new Text(""),this.end=new Text(""),t.insertBefore(this.end,e),t.insertBefore(this.start,this.end),t.insertBefore(this.template,this.end);else t.insertBefore(this.template,e);}remove(){if(this.parentCtx&&remove(this.parentCtx.blocks,this),this.start){const t=this.start.parentNode;let e=this.start,s;for(;e&&(s=e.nextSibling,t.removeChild(e),e!==this.end);)e=s;}else this.template.parentNode.removeChild(this.template);this.teardown();}teardown(){this.ctx.blocks.forEach(t=>{t.teardown();}),this.ctx.effects.forEach(stop),this.ctx.cleanups.forEach(t=>t());}}

const c=r=>r.replace(/[-.*+?^${}()|[\]\/\\]/g,"\\$&");const createApp=r=>{const o=createContext();if(r&&(o.scope=reactive(r),bindContextMethods(o.scope),r.$delimiters)){const[e,t]=o.delimiters=r.$delimiters;o.delimitersRE=new RegExp(c(e)+"([^]+?)"+c(t),"g");}o.scope.$s=toDisplayString,o.scope.$nextTick=nextTick,o.scope.$refs=Object.create(null);let i;return {directive(e,t){return t?(o.dirs[e]=t,this):o.dirs[e]},mount(e){if(typeof e=="string"&&(e=document.querySelector(e),!e)){return}e=e||document.documentElement;let t;return e.hasAttribute("v-scope")?t=[e]:t=[...e.querySelectorAll("[v-scope]")].filter(n=>!n.matches("[v-scope] [v-scope]")),t.length||(t=[e]),i=t.map(n=>new Block(n,o,!0)),this},unmount(){i.forEach(e=>e.teardown());}}};

const t=document.currentScript;t&&t.hasAttribute("init")&&createApp().mount();

export { createApp, nextTick, reactive };
