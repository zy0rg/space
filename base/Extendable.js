define(function () {

	function Extendable() {
	}

	function add(props) {
		if (props)
			for (var i in props)
				if (props.hasOwnProperty(i))
					this[i] = props[i];
	}

	function extend(protoProps, moreProps) {
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}

		child.extend = extend;

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function () {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		child.prototype.extend = add;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		add.call(child.prototype, protoProps);
		add.call(child.prototype, moreProps);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	}

	Extendable.extend = extend;
	Extendable.add = add;

	return Extendable;
});