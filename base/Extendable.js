define([
	'core/tools'
], function (tools) {

	function Extendable() {
	}

	function addMethods() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.prototype);
		tools.extend.apply(tools, args);
		return this;
	}

	function extend(protoProps) {
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

		child.add = addMethods;
		child.extend = parent.extend;

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function () {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		child.prototype.extend = tools.extend;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (arguments.length)
			tools.extend.apply(child.prototype, arguments);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	}

	Extendable.extend = extend;
	Extendable.add = tools.extend;

	return Extendable;
});