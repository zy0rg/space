define([
	'core/objects'
], function (objects) {

	var interval,
		callbacks = [],
		self,
		last,
		timeout = 10;

	return self = {
		callbacks: callbacks,

		tick: function () {
			var i,
				current = (new Date()).getTime(),
				ms = (current - last) || 0;
			last = current;
			for (i in objects)
				objects[i].tick(ms);
			for (i = 0; i < callbacks.length; i++)
				callbacks[i](ms);
		},

		start: function () {
			if (!interval) {
				last = (new Date()).getTime();
				this.interval = setInterval(self.tick, timeout);
			}
		},

		stop: function () {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
		}
	};
});