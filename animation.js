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
/**
 * Computes the bezier curve using time and control points
 * @param {Number} t 
 * @param  {...Number} points 
 * @returns {Object} 
 */
function bezier(t, ...points) {
    if (points.length != 8) {
        return;
    }
    // if (!points.every(el => el >= 0 && el <= 1)) {
    //     return;
    // }
    var x =
        (1 - t) ** 3 * points[0] + 3 * (1 - t) ** 2 * t * points[2] +
        3 * (1 - t) * t ** 2 * points[4] +
        t ** 3 * points[6];
    var y =
        (1 - t) ** 3 * points[1] + 3 * (1 - t) ** 2 * t * points[3] +
        3 * (1 - t) * t ** 2 * points[5] +
        t ** 3 * points[7];
    return { x, y };
}

/**
 * Clamp utility function
 * @param {Number} number Input
 * @param {Number} min Left limit
 * @param {Number} max Right limit
 * @returns {Number} The clamped value
 */
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

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
            this.dispatch(1);
            this.stop();
        } else {
            this.id = requestAnimationFrame(this.tick.bind(this));
        }
    },
    /**
     * Computes the clamped bezier using the animation progress
     * @returns {Number} [0;1]
     */
    value: function () {
        if (!this.running) {
            return;
        }
        return bezier(this.progress(), ...[0, 0, ...this.points, 1, 1]).y;
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
            var data_copy = Array.isArray(data) ? [...data] : [data];
            var end = [this.end[key].args].flat();
            var newValue = [this[this.end[key].fn](progress, ...data_copy, ...end)].flat();
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
        }
        this.timeline.start();
    },
    /**
     * Stops the animation
     */
    stop: function () {
        this.timeline.stop();
    },
    curveProgress: function (t, offset, chunk_size, points) {
        var size = points.length;
        if (size % chunk_size != offset && chunk_size != offset) {
            return;
        }
        var segments = ~~(size / chunk_size);
        var currentCurveIndex = clamp(Math.ceil(t * segments) - 1, 0, segments - 1);
        var currentCurve = points.slice(currentCurveIndex * chunk_size, currentCurveIndex * chunk_size + chunk_size + offset);
        if (currentCurve.length < chunk_size + offset) {
            currentCurve = [...currentCurve, ...currentCurve]
        }
        var currentCurveProgress = (t - currentCurveIndex * (1 / segments)) / (1 / segments);
        return {
            curve: currentCurve,
            progress: currentCurveProgress
        };
    },
    /**
     * Selects the current curve from a list of points and computes the bezier curve points associated
     * @param {Number} t Progress [0;1]
     * @param  {...<Number>} points Bezier curve points
     * @returns {Object} x,y
     */
    path: function (t, ...points) {
        var { curve, progress } = this.curveProgress(t, 2, 6, points);
        return bezier(progress, ...curve);
    },
    polyline: function (t, ...points) {
        var lengths = [];
        var totalLength = 0;
        for (let i = 2; i < points.length - 1; i += 2) {
            const v1 = Vector2(points[i - 2], points[i - 1]);
            const v2 = Vector2(points[i], points[i + 1]);
            lengths.push(v2.sub(v1).length());
            totalLength += lengths[lengths.length - 1];
        }
        var weights = lengths.map((el) => el / totalLength);
        var { curve, progress } = this.curveProgress(t, 2, 2, points);
        return {
            x: curve[0] + progress * (curve[2] - curve[0]),
            y: curve[1] + progress * (curve[3] - curve[1]),
        };
    },
    /**
     * Computes
     * @param {Number} t Progress [0;1]
     * @param  {...<Number>} values Numbers to interpolate, first half is the from values, to second half is the target values
     */
    linear: function (t, ...values) {
        if (values.length % 2 != 0) {
            return;
        }
        return values.slice(0, values.length / 2).map(function (value, idx, arr) {
            return value + t * (values[idx + arr.length] - value);
        })
    },
    steps: function (t, ...values) {
        var segments = values.length;
        if (segments % 2 != 0) {
            return;
        }
        var currentCurveIndex = clamp(Math.ceil(t * segments) - 1, 0, segments - 1);
        var currentCurveProgress = (t - currentCurveIndex * (1 / segments)) / (1 / segments);

    }
};
var Animation = AnimationUtils.make;
export { Animation };