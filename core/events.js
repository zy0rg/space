define({
	on: function (name, callback, context) {
		var i, val;
		if (typeof name != 'string') {
			for (i in name)
				this.on(i, name[i], callback);
		} else if (~name.indexOf(' ')) {
			val = name.split(' ');
			for (i = 0; i < val.length; i++)
				this.on(val[i], callback, context);
		} else {
			val = this.eventHandlers || (this.eventHandlers = {});
			val = val[name] || (val[name] = []);
			val.push(callback, context || this);
		}
	},
	off: function (name, callback, context) {
		var i,
			handlers = this.eventHandlers || (this.eventHandlers = {});
		if (typeof name == 'string') {
			if (handlers = handlers[name])
				if (callback) {
					while (~(i = handlers.indexOf(callback, i)))
						if (i % 2)
							handlers.splice(i - 1, 2);
						else if (!context || handlers[i + 1] == context)
							handlers.splice(i, 2);
						else
							i++;
				} else
					handlers.length = 0;
		} else
			for (i in handlers)
				this.off(i, name, callback);
	},
	trigger: function (name, data) {
		var i,
			handlers = this.eventHandlers && this.eventHandlers[name];
		if (handlers)
			for (i = 0; i < handlers.length; i += 2)
				handlers[i].call(i + 1, data);
	}
});