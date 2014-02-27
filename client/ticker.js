define([
	'core/objects'
], function (objects) {

	var interval,
		callbacks = [],
		self,
		last,
		timeout = 40;

	return self = {
		callbacks: callbacks,

		tick: function () {
			var i,
				current = (new Date()).getTime(),
				ms = (current - last) || 0;
			last = current;
			for (i = 0; i < objects.length; i++)
				objects[i].tick(ms);
			for (i = 0; i < callbacks.length; i++)
				callbacks[i](ms);
			window.requestAnimationFrame(self.tick);
		},

		start: function () {
			window.requestAnimationFrame(self.tick);
//			if (!interval) {
//				last = (new Date()).getTime();
//				this.interval = setInterval(self.tick, timeout);
//			}
		},

		stop: function () {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
		}
	};
});