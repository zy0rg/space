define([
	'jquery',

	'core/tools',
	'core/events'
], function ($, tools, events) {

	var i,
		keys = {},
		ids = {
			8: 'backspace',
			13: 'enter',
			16: 'shift',
			17: 'ctrl',
			32: 'space',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		},
		buttons = {
			1: 'mouseLeft',
			2: 'mouseMiddle',
			3: 'mouseRight',
			4: 'mouse4',
			5: 'mouse5'
		},
		offsetX = window.innerWidth / 2,
		offsetY = window.innerHeight / 2;

	for (i in ids)
		keys[ids[i]] = false;

	tools.extend(keys, events);

	$(window).on({
		keydown: function (event) {
			var id = ids[event.which];
			if (id && !keys[id])
				keys.trigger(id, keys[id] = true);
		},
		keyup: function (event) {
			var id = ids[event.which];
			if (id && keys[id])
				keys.trigger(id, keys[id] = false);
		},
		mousedown: function (event) {
			var id = buttons[event.which];
			if (id && !keys[id])
				keys.trigger(id, keys[id] = true);
		},
		mouseup: function (event) {
			var id = buttons[event.which];
			if (id && keys[id])
				keys.trigger(id, keys[id] = false);
		},
		mousemove: function (event) {
			keys.trigger('mousePosition', keys.mousePosition = {
				x: event.clientX - offsetX,
				y: event.clientY - offsetY
			});
		},
		contextmenu: function (event) {
			event.preventDefault();
		},
		resize: function () {
			offsetX = window.innerWidth / 2;
			offsetY = window.innerHeight / 2;
		}
	});

	return keys;
});