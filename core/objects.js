define([
	'core/events',

	'base/Beam',
	'base/Ship'
], function (events, Beam, Ship) {

	var counter = 0,
		objects = {},
		types = {
			beam: Beam,
			ship: Ship
		};

	Object.defineProperties(objects, {
		create: {
			value: function (type, data) {
				if (typeof type == 'object') {
					data = type;
					type = data.type;
				}
				data || (data = {});
				var id = data.id || (data.id = counter++);
				if (type && (type = types[type]))
					return objects[id] = new type(data);
			}
		},
		set: {
			value: function (data) {
				if (objects.hasOwnProperty(data.id))
					objects[data.id].extend(data);
				else if (data.type)
					objects.create(data);
			}
		},
		update: {
			value: function (data) {
				var i, props;
				for (i in data) {
					props = data[i];
					if (objects.hasOwnProperty(props.id))
						objects[props.id].extend(props);
					else if (props.type)
						objects.create(props);
				}
				for (i in objects)
					if (!data[i])
						delete objects[i];
			}
		},
		delete: {
			value: function (id) {
				delete objects[id];
			}
		},
		toJSON: {
			value: function (full) {
				var i, object,
					data = {};
				for (i in objects) {
					object = objects[i];
					object.update();
					data[i] = object.toJSON(full);
				}
				return data;
			}
		},
		on: {
			value: events.on
		},
		off: {
			value: events.off
		},
		trigger: {
			value: events.trigger
		},
		eventHandlers: {
			value: {}
		}
	});

	return objects;
});
