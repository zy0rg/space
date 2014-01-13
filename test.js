define(function () {

	var j, start,
		deceleration = 0.998,
		rotation = 0.01 / Math.PI,
		acceleration = 0.0025,
		ms = 25, tests = 1000000000,
		dcc = deceleration / (deceleration - 1),
		mdc = 1 / deceleration,
		acdc = acceleration * dcc,
		pow;

	var x, y, xSpeed, ySpeed, angle;

//	start = new Date().getTime();
//	for (j = 0; j < tests; j++) {
//		x = 0;
////		y = 0;
//		xSpeed = 2;
////		ySpeed = 2;
////		angle = 0;
//		for (var i = 0; i < ms; i++) {
//			xSpeed += acceleration;
//			x += (xSpeed *= deceleration);
//		}
////		for (var i = 0; i < ms; i++) {
////			angle += rotation * -1;
////			xSpeed += Math.cos(angle) * acceleration;
////			ySpeed -= Math.sin(angle) * acceleration;
////			x += (xSpeed *= deceleration);
////			y += (ySpeed *= deceleration);
////		}
//	}
//	console.log(x, xSpeed, new Date().getTime() - start);

	start = new Date().getTime();
	for (j = 0; j < tests; j++) {
		x = 0;
		xSpeed = 2;
		pow = Math.pow(deceleration, ms);
		x += xSpeed * dcc * (pow - 1) + acceleration * dcc * ((pow - mdc) * dcc - 1 - ms);
		xSpeed = xSpeed * pow + acceleration * dcc * (pow - 1);
	}
	console.log(x, xSpeed, new Date().getTime() - start);

	start = new Date().getTime();
	for (j = 0; j < tests; j++) {
		x = 0;
		xSpeed = 2;
		pow = Math.pow(deceleration, ms);
		x += xSpeed * dcc * (pow - 1) + acdc * ((pow - 1) * dcc - ms);
		xSpeed = xSpeed * pow + acdc * (pow - 1);
	}
	console.log(x, xSpeed, new Date().getTime() - start);
});
