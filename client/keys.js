define([
	'jquery',

	'core/tools',
	'core/events'
], function ($, tools, events) {

	var i,
		keys = {},
		ids = {
			16: 'shift',
			17: 'ctrl',
			32: 'space',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};

	for (i in ids)
		keys[ids[i]] = false;

	tools.extend(keys, events);

	$(window).on({
		keydown: function (event) {
			var id = ids[event.which];
			if (id && !keys[id]) {
				keys.trigger(id, keys[id] = true);
				event.preventDefault();
			}
		},
		keyup: function (event) {
			var id = ids[event.which];
			if (id && keys[id]) {
				keys.trigger(id, keys[id] = false);
				event.preventDefault();
			}
		}
	});

	return keys;
});