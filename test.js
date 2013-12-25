define(function () {

	var j, start,
		deceleration = 0.998,
		rotation = 0.01 / Math.PI,
		acceleration = 0.0025,
		ms = 1500, tests = 100;

	var x, y, xSpeed, ySpeed, angle;

	start = new Date().getTime();
	for (j = 0; j < tests; j++) {
		x = 0;
		y = 0;
		xSpeed = 2;
		ySpeed = 2;
		angle = 0;
		for (var i = 0; i < ms; i++) {
			angle += rotation * -1;
			xSpeed += Math.cos(angle) * acceleration;
			ySpeed -= Math.sin(angle) * acceleration;
			x += (xSpeed *= deceleration);
			y += (ySpeed *= deceleration);
		}
	}
	console.log(new Date().getTime() - start);

//	start = new Date().getTime();
//	for (j = 0; j < tests; j++) {
//		x = 0;
//		speed = 2;
//		x += speed * ((Math.pow(deceleration, ms + 1) - 1) / (deceleration - 1) - 1);
//		speed *= Math.pow(deceleration, ms);
//	}
//	console.log(x, speed, new Date().getTime() - start);

});
