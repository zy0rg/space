define([
	'core/objects'
], function (objects) {

	var interval,
		callbacks = [],
		self,
		last;

	return self = {
		callbacks: callbacks,

		tick: function () {
			var i,
				current = (new Date()).getTime(),
				ms = (current - last) || 0,
				object;
			last = current;
			for (i in objects) {
				object = objects[i];
				if (Math.abs(object.x) > 1000 || Math.abs(object.y) > 1000)
					delete objects[i];
				else
					object.tick(ms);
			}
			for (i = 0; i < callbacks.length; i++)
				callbacks[i](ms);
		},

		start: function () {
			if (!interval) {
				last = (new Date()).getTime();
				this.interval = setInterval(self.tick, 40);
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