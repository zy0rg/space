define([
	'./Shape'
], function (Shape) {

	var rotation = 0.01 / Math.PI,
		acceleration = 0.0025,
		deceleration = 0.998,
		dcc = deceleration / (deceleration - 1),
		acdc = acceleration * dcc,
		pi2 = Math.PI * 2;

	return Shape.extend({

		type: 'ship',
		image: 'ship',
		size: 46,

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,
		rotate: 0,
		accelerate: false,

		tick: function (ms) {
			var i, j;
			if (!this.accelerate) {
				i = (Math.pow(deceleration, ms + 1) - 1) / (deceleration - 1) - 1;
				this.x += this.xSpeed * i;
				this.y += this.ySpeed * i;
				i = Math.pow(deceleration, ms);
				this.xSpeed *= i;
				this.ySpeed *= i;
				if (this.rotate)
					this.angle = (this.angle + rotation * this.rotate * ms) % pi2;
			} else if (!this.rotate) {
				i = Math.pow(deceleration, ms);
				j = Math.cos(this.angle) * acdc;
				this.x += this.xSpeed * dcc * (i - 1) + j * ((i - 1) * dcc - ms);
				this.xSpeed = this.xSpeed * i + j * (i - 1);
				j = Math.sin(this.angle) * acdc;
				this.y += this.ySpeed * dcc * (i - 1) - j * ((i - 1) * dcc - ms);
				this.ySpeed = this.ySpeed * i - j * (i - 1);
			} else {
				for (i = 0; i < ms; i++) {
					if (this.rotate)
						this.angle += rotation * this.rotate;
					this.xSpeed += Math.cos(this.angle) * acceleration;
					this.ySpeed -= Math.sin(this.angle) * acceleration;
					this.x += (this.xSpeed *= deceleration);
					this.y += (this.ySpeed *= deceleration);
				}
				this.angle = this.angle % pi2;
			}
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