define({
	on: function (name, callback, context) {
		var i, val;
		if (typeof name != 'string') {
			for (i in name) {
				if (name.hasOwnProperty(i)) {
					this.on(i, name[i], callback);
				}
			}
		} else if (~name.indexOf(' ')) {
			val = name.split(' ');
			for (i = 0; i < val.length; i++) {
				this.on(val[i], callback, context);
			}
		} else {
			val = this.eventHandlers || (this.eventHandlers = {});
			val = val[name] || (val[name] = []);
			val.push(callback, context || this);
		}
	},

	off: function (name, callback, context) {
		var i,
			handlers = this.eventHandlers;
		if (handlers) {
			if (typeof name != 'string') {
				for (i in handlers) {
					if (handlers.hasOwnProperty(i)) {
						this.off(i, name, callback);
					}
				}
			} else {
				if (handlers = handlers[name]) {
					if (callback) {
						if (context) {
							for (i = 0; i < handlers.length; i += 2) {
								if (handlers[i] == callback && handlers[i + 1] == context) {
									handlers.splice(i, 2);
								}
							}
						} else {
							for (i = 0; i < handlers.length; i += 2) {
								if (handlers[i] == callback) {
									handlers.splice(i, 2);
								}
							}
						}
					} else {
						if (context) {
							for (i = 1; i < handlers.length; i += 2) {
								if (handlers[i] == context) {
									handlers.splice(i - 1, 2);
								}
							}
						} else {
							handlers.length = 0;
						}
					}
				}
			}
		}
	},

	trigger: function (name) {
		var i,
			handlers = this.eventHandlers && this.eventHandlers[name];
		if (handlers) {
			for (i = 0; i < handlers.length; i += 2) {
				handlers[i].apply(handlers[i + 1], Array.prototype.slice.call(arguments, 1));
			}
		}
	}
});