define([
	'./Shape'
], function (Shape) {

	var rotation = 0.01 / Math.PI,
		acceleration = 0.0025,
		deceleration = 0.998,
		pi2 = Math.PI * 2;

	return Shape.extend({

		type: 'ship',
		image: 'ship',

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,
		rotate: 0,
		accelerate: false,

		tick: function (ms) {
			for (var i = 0; i < ms; i++) {
				if (this.rotate)
					this.angle = (this.angle + rotation * this.rotate) % pi2;
				if (this.accelerate) {
					this.xSpeed += Math.cos(this.angle) * acceleration;
					this.ySpeed -= Math.sin(this.angle) * acceleration;
				}
				this.x += (this.xSpeed *= deceleration);
				this.y += (this.ySpeed *= deceleration);
			}

//			this.x += this.xSpeed * ((Math.pow(deceleration, ms + 1) - 1) / (deceleration - 1) - 1);
//			this.xSpeed *= Math.pow(deceleration, ms);
//			this.y += this.ySpeed * ((Math.pow(deceleration, ms + 1) - 1) / (deceleration - 1) - 1);
//			this.ySpeed *= Math.pow(deceleration, ms);
		},

		toJSON: function (full) {
			var json = {
				id: this.id,
				x: this.x,
				y: this.y,
				xSpeed: this.xSpeed,
				ySpeed: this.ySpeed,
				angle: this.angle,
				rotate: this.rotate,
				accelerate: this.accelerate
			};
			if (full)
				json.type = this.type;
			return json;
		}
	});
});