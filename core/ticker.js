define(function () {

	var interval,
		objects = [],
		callbacks = [],
		self,
		last;

	return self = {

		objects: objects,
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