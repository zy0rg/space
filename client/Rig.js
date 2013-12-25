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

		toJSON: function () {
			return {
				name: this.name
			};
		}
	};

	self.fetch();

	return self;
});
