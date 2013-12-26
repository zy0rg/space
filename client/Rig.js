define([
	'core/tools'
], function (tools) {

	var self = {

		extend: tools.extend,

		save: function () {
			localStorage.setItem('space', JSON.stringify(this.toJSON()));
		},

		fetch: function () {
			var item = localStorage.getItem('space');
			if (item)
				this.extend(JSON.parse(item));
		},

		setShip: function (ship) {
			this.ship = ship;
			if (ship)
				ship.extend = function (data) {
					if (data.accelerate != this.accelerate ||
						(this.accelerate && (data.rotate != this.rotate)))
						tools.extend(this, data).buildPath();
					else
						tools.extend(this, data);
				}
		},

		toJSON: function () {
			return {
				name: this.name
			};
		}
	};

	self.fetch();

	return self;
});
