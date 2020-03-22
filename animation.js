var VectorUtils = {
    /**
     * @typedef Vector2
     * @property {Number} x The x component
     * @property {Number} y The y component
     */

    /**
     * Creates a Vector2
     * @param {Number} x The x component
     * @param {Number} y The y component
     * @returns {Vector2} Result
     */
    make: function (x, y) {
        var obj = Object.create(VectorUtils);
        obj.x = x;
        obj.y = y;
        return obj;
    },
    /**
     * Adds two vectors together
     * @param {Vector2} v1 Left operand
     * @param {Vector2} v2 Right operand
     * @returns  {Vector2}
     * @static
     */
    sadd: function (v1, v2) {
        return this.make(v1.x + v2.x, v1.y + v2.y);
    },
    /**
     * Adds specified vector to self
     * @param {Vector2} v Right operand
     * @returns {Vector2}
     */
    add: function (v) {
        return this.make(this.x + v.x, this.y + v.y);
    },
    /**
     * Substracts v2 to v1
     * @param {Vector2} v1 Left operand
     * @param {Vector2} v2 Right operand
     * @returns {Vector2}
     * @static
     */
    ssub: function (v1, v2) {
        return this.make(v1.x - v2.x, v1.y - v2.y);
    },
    /**
     * Substract v to self
     * @param {Vector2} v Right operand
     * @returns {Vector2}
     */
    sub: function (v) {
        return this.make(this.x - v.x, this.y - v.y);
    },
    /**
     * Multiplies v by n
     * @param {Vector2} v Vector to multiply
     * @param {Number} n Factor
     * @returns {Vector2}
     */
    smult: function (v, n) {
        return this.make(v.x * n, v.y * n);
    },
    /**
     * Multiply self by n
     * @param {Number} n Factor
     * @returns {Vector2}
     */
    mult: function (n) {
        return this.make(this.x * n, this.y * n);
    },
    /**
     * Divides v by n
     * @param {Vector2} v Dividend
     * @param {Number} n Divisor
     * @returns {Vector2}
     * @static
     */
    sdiv: function (v, n) {
        return this.make(v.x / n, v.y / n);
    },
    /**
     * Divides self by n
     * @param {Number} n 
     * @returns {Vector2}
     */
    div: function (n) {
        return this.make(this.x / n, this.y / n);
    },
    /**
     * Computes the length of v
     * @param {Vector2} v Vector2 to get the length of
     * @returns {Number}
     */
    slength: function (v) {
        return Math.sqrt(v.x ** 2, v.y ** 2);
    },
    /**
     * Computes the length of self
     * @returns {Number}
     */
    length: function () {
        return Math.sqrt(this.x ** 2, this.y ** 2);
    },
    toString: function () {
        return `x: ${this.x}, y: ${this.y}`;
    }
};
var Vector2 = VectorUtils.make;
var TimelineUtils = {
    /**
     * @typedef Timeline
     * @property {Number} duration Duration of the animation
     * @property {Array.<Number>} points Control points
     * @property {Number} startedAt Start point in time
     * @property {Number} stoppedAt End point in time
     * @property {Boolean} running Whether the animation is running or not
     * @property {Number} id setAnimationFrame id
     */
    /**
     * Creates a timeline
     * @param {Array.<Number>} points Control points
     * @param {Number} duration Duration of the animation
     * @returns {Timeline}
     */
    make: function (points, duration) {
        var obj = Object.create(TimelineUtils);
        obj.duration = duration;
        obj.points = points;
        obj.startedAt = 0;
        obj.running = false;
        obj.stoppedAt = 0;
        obj.id = null;

        return withMixin(obj, Observed());
    },
    /**
     * Starts the animation
     */
    start: function () {
        this.running = true;
        this.startedAt = Date.now();
        this.id = requestAnimationFrame(this.tick.bind(this));
    },
    /**
     * Computes the elapsed time
     * @returns {Number} Elapsed time as milliseconds
     */
    elapsedTime: function () {
        return Date.now() - this.startedAt;
    },
    /**
     * Computes animation progress
     * @returns {Number} Progress [0;1]
     */
    progress: function () {
        return this.elapsedTime() / this.duration;
    },
    /**
     * Function executed each frame
     * 
     * Dispatches the current value
     * 
     * Stops animation when time runs out
     */
    tick: function () {
        if (this.dispatch) {
            this.dispatch(this.value());
        }
        if (this.elapsedTime() > this.duration) {
            this.stop();
        } else {
            this.id = requestAnimationFrame(this.tick.bind(this));
        }
    },
    /**
     * Computes the bezier curve using time and control points
     * @param {Number} t 
     * @param  {...Number} points 
     * @returns {Number}
     */
    bezier: function (t, ...points) {
        if (points.length != 4) {
            return;
        }
        if (!points.every(el => el >= 0 && el <= 1)) {
            return;
        }
        var x =
            3 * (1 - t) ** 2 * t * points[0] +
            3 * (1 - t) * t ** 2 * points[2] +
            t ** 3;
        var y =
            3 * (1 - t) ** 2 * t * points[1] +
            3 * (1 - t) * t ** 2 * points[3] +
            t ** 3;
        return y;
    },
    /**
     * Computes the clamped bezier using the animation progress
     * @returns {Number} [0;1]
     */
    value: function () {
        if (!this.running) {
            return;
        }
        return this.clamp(this.bezier(this.progress(), ...this.points), 0, 1);
    },
    /**
     * Stops the animation
     */
    stop: function () {
        if (!this.running) {
            return;
        }
        cancelAnimationFrame(this.id);
        this.running = false;
        this.stoppedAt = Date.now();
    },
    /**
     * Clamp utility function
     * @param {Number} number Input
     * @param {Number} min Left limit
     * @param {Number} max Right limit
     * @returns {Number} The clamped value
     */
    clamp: function (number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
};
var Timeline = TimelineUtils.make;
/**
 * @function Observed
 * @returns {Observed}
 */
var Observed = () => ({
    /**
     * @typedef Observed
     * @property {Map} observers Observers references
     * @property {Function} register
     * @property {Function} remove
     * @property {Function} dispatch
     */
    observers: new Map(),
    /**
     * Registers an observer
     * @param {Function} fn Called on dispatch
     * @param {Object} reference Target object
     * @returns {Symbol} The observer identifier
     */
    register: function (fn, reference) {
        var callback = fn.bind(reference);
        if (this.observers.has(callback)) {
            return;
        }
        var key = Symbol();
        this.observers.set(key, callback);
        return key;
    },
    /**
     * Removes an observer
     * @param {Symbol} key Identifier corresponding to the observer to remove
     */
    remove: function (key) {
        this.observers.delete(key);
    },
    /**
     * Calls each observer with specified arguments
     * @param  {...any} args Arguments to be passed to the observers
     */
    dispatch: function (...args) {
        this.observers.forEach(observer => {
            observer(...args);
        });
    }
});
/**
 * @function Observer
 * @returns {Observer}
 */
var Observer = () => ({
    /**
     * @typedef Observer
     * @property {Map} observed
     * @property {Function} subscribe
     * @property {Function} unsubscribe
     */
    observed: new Map(),
    /**
     * Subscribes to o with fn callback
     * @param {Object} o Observed
     * @param {Function} fn Function to execute (own method)
     */
    subscribe: function (o, fn) {
        this.observed.set(o, o.register(fn, this));
    },
    /**
     * Unsubscribes from o
     * @param {Object} o Observed
     */
    unsubscribe: function (o) {
        o.remove(this.observed.get(o));
    }
});
/**
 * Augments target with mixin
 * @param {Object} target Target object
 * @param {Object} mixin Mixin
 */
function withMixin(target, mixin) {
    return Object.assign(target, mixin);
}
var AnimationUtils = {
    /**
     * @typedef Animation
     * @property {Function} animate
     * @property {Function} start
     * @property {Function} stop
     * @property {AnimationSettings} settings
     * @property {Timeline} timeline
     * @property {Object} from
     * @property {Object} to
     */
    /**
     * @typedef AnimationSettings
     * @property {Object} settings Animation settings
     * @property {Object} settings.target Target element
     * @property {Array.<Number>} settings.curve Control points (x,y,x2,y2)
     * @property {Number} settings.duration Animation duration in ms
     * @property {Object} settings.params Functions to get the "from" values
     * @property {Function} settings.params.name Name of the param
     * @property {Object} settings.end End values
     * @property {Number|Array.<Number>} settings.end.name Value
     * @property {Object} settings.setters Setters
     * @property {Function} settings.setters.name Setter functions
     * @property {Object} settings.formats Format functions
     * @property {Function} settings.formats.name Generate formatted string
     * @property {Array.<String>} settings.relative
     */
    /**
     * Creates an animation
     * @param {AnimationSettings} settings 
     * @returns {Animation}
     */
    make: function (settings) {
        var obj = withMixin(Object.create(AnimationUtils), Observer());
        Object.assign(obj, settings);
        obj.settings = settings;
        obj.timeline = Timeline(settings.curve, settings.duration);
        obj.from = {};
        obj.to = {};
        obj.subscribe(obj.timeline, obj.animate);
        return obj;
    },
    /**
     * Animates
     * @param {Number} progress Current progress
     */
    animate: function (progress) {
        for (const key of Object.keys(this.from)) {
            var data = this.from[key];
            var isArray = Array.isArray(data);
            var data_copy = Array.isArray(data) ? [...data] : [data];
            var newValue = data_copy.map(function (value, idx) {
                var to = isArray ? this.to[key][idx] : this.to[key];
                return value + progress * (to - value);
            }, this);
            if (this.formats.hasOwnProperty(key)) {
                this.setters[key](this.target, this.formats[key](...newValue));
            } else {
                this.setters[key](this.target, ...newValue);
            }
        };
    },
    /**
     * Starts the animation
     */
    start: function () {
        for (const [key, param] of Object.entries(this.params)) {
            var data = param(this.target);
            this.from[key] = data;
            var relative = this.relative.indexOf(key) != -1;
            var isArray = Array.isArray(data);
            var from_copy = Array.isArray(data) ? [...data] : [data];
            var to = from_copy.map(function (value, idx, arr) {
                var end = isArray ? this.end[key][idx] : this.end[key];
                if (relative) {
                    return value + end;
                } else {
                    return end;
                }
            }, this);
            this.to[key] = isArray ? to : to[0]
        }
        this.timeline.start();
    },
    /**
     * Stops the animation
     */
    stop: function () {
        this.timeline.stop();
    }
};
var Animation = AnimationUtils.make;
export { Animation };