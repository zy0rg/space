define([
	'base/Beam',
	'base/Ship'
], function (Beam, Ship) {

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
				var id = data && data.id || counter++;
				if (type && (type = types[type]))
					return objects[id] = new type(data);
			}
		},
		set: {
			value: function (data) {
				if (objects.hasOwnProperty(data.id))
					objects[data.id].extend(data);
				else
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
					else
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
		}
	});

	return objects;
});
