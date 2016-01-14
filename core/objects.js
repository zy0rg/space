define([
	'core/events',

	'base/Beam',
	'base/Ship'
], function (events, Beam, Ship) {

	var idCounter = 0,
		objects = [],
		byId = {},
		types = {
			beam: Beam,
			ship: Ship
		};

	Object.defineProperties(objects, {
		byId: byId,
		create: {
			value: function (type, data) {
				if (typeof type == 'object') {
					data = type;
					type = data.type;
				}
				data || (data = {});
				var id = data.id || (data.id = idCounter++),
					obj = new (types[type])(data);
				objects.push(obj);
				byId[id] = obj;
				return obj;
			}
		},
		set: {
			value: function (data) {
				if (data.id && byId.hasOwnProperty(data.id))
					byId[data.id].extend(data);
				else if (data.type)
					objects.create(data);
			}
		},
		update: {
			value: function (data) {
				var i, props;
				for (i in data) {
					if (data.hasOwnProperty(i)) {
						props = data[i];
						if (byId.hasOwnProperty(props.id))
							byId[props.id].extend(props);
						else if (props.type)
							objects.create(props);
					}
				}
				for (i = 0; i < objects.length; i++)
					if (!data.hasOwnProperty(objects[i].id))
						objects.delete(i);
			}
		},
		delete: {
			value: function (id) {
				if (byId.hasOwnProperty(id)) {
					var obj = byId[id],
						i = objects.indexOf(obj);
					if (~i)
						objects.splice(i, 1);
				}
			}
		},
		toJSON: {
			value: function (full) {
				var i, object,
					data = {};
				for (i = 0; i < objects.length; i++) {
					object = objects[i];
					object.update();
					data[object.id] = object.toJSON(full);
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
