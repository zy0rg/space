define(function () {
	var self = {
		extend: function (first) {
			var i, j, source, target;
			if (this == self) {
				target = first;
				i = 1;
			} else {
				target = this;
				i = 0;
			}
			if (target)
				for (; i < arguments.length; i++)
					if (source = arguments[i])
						for (j in source)
							if (source.hasOwnProperty(j))
								target[j] = source[j];
			return target;
		}
	};

	return self;
});