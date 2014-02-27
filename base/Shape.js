define([
	'./Extendable'
], function (Extendable) {

	return Extendable.extend({

		x: 0,
		y: 0,
		angle: 0,

		constructor: function (options) {
			if (options)
				this.extend(options);
			if (this.points)
				this.processPoints();
			this.lastCoords = {};
			this.init();
		},

		init: function () {
		},

		processPoints: function () {
			this.angularPoints = [];
			var i, x, y, point,
				arr = [], range;
			for (i = 0; i < this.points.length; i++) {
				point = this.points[i];
				x = point[0];
				y = point[1];
				range = Math.sqrt(x * x + y * y);
				this.angularPoints.push({
					angle: Math.atan2(y, x),
					range: range
				});
				arr.push(range);
			}

			this.size = Math.max.apply(Math, arr);
		},

		draw: function (ctx) {
			this.lastCoords.x = this.x;
			this.lastCoords.y = this.y;

			if (this.path) {
				ctx.save();
				ctx.fillStyle = "white";
				ctx.strokeStyle = "black";
				for (var i = 0; i < this.path.length; i++){
					ctx.beginPath();
					ctx.arc(this.path[i][0], this.path[i][1], 2, 0, 2 * Math.PI, true);
					ctx.fill();
					ctx.stroke();
				}
				ctx.restore();
			}

			if (this.image && ctx.resources[this.image]) {
				ctx.save();
				ctx.translate(this.x, this.y);
				ctx.rotate(-this.angle);
				var img = ctx.resources[this.image];
				if (this.composition) {
					ctx.globalAlpha = 0.5;
					ctx.drawImage(img, img.width / -2, img.height / -2);
					ctx.globalCompositeOperation = this.composition;
				}
				ctx.drawImage(img, img.width / -2, img.height / -2);
				ctx.restore();
				return;
			}

			if (this.angularPoints && this.angularPoints.length) {
				var coords;

				ctx.fillStyle = this.color;
				ctx.beginPath();

				coords = this.getAbsoluteCoords(this.angularPoints[i]);
				ctx.moveTo(coords.x, coords.y);

				while (++i < this.angularPoints.length) {
					coords = this.getAbsoluteCoords(this.angularPoints[i]);
					ctx.lineTo(coords.x, coords.y);
				}
				ctx.fill();
			}
		},

		buildPath: function (count) {
			var dummy = this.toJSON(),
				i = count || 200,
				path = [];
			while (--i) {
				this.tick.call(dummy, 20);
				path.push([dummy.x, dummy.y]);
			}
			this.path = path;
		},

		clear: function (ctx) {
			var size = this.size;
			ctx.clearRect(this.lastCoords.x - size, this.lastCoords.y - size, size * 2, size * 2);
		},

		getAbsoluteCoords: function (point) {
			var angle = point.angle + this.angle;
			return {
				x: this.x + point.range * Math.cos(angle),
				y: this.y + -point.range * Math.sin(angle)
			}
		},

		tick: function () {
		}
	});
});