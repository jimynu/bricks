function Ball() {
  // initialise coordinates
  this.position = [];
  this.lastX = 0;

  // initialise radius
  this.radius = 5;

  // initialise ball speed (vector[horizontal, vertical])
  this.speed = [];
}

Ball.prototype.initialise = function() {
  // starting position
  this.position = [300, 330];

  // speed
  randomNumber = Math.ceil(Math.random()*4);
  console.log(randomNumber);
  switch (randomNumber) {
    case 1:
      this.speed = [2, -3];
      break;
    case 2:
      this.speed = [1.5, -3.5];
      break;
    case 3:
      this.speed = [-1.5, -3.5];
      break;
    case 4:
      this.speed = [-2, -3];
      break;
  }
};

Ball.prototype.render = function() {
  context.beginPath();
  // arc: (centerX, centerY, radius, startAngle, endAngle, (clockwise/anticlockwise))
  context.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
  context.fillStyle = 'white';
  context.fill();
};

Ball.prototype.move = function() {
  // check for wall kissing
  // bounce left
  if (this.position[0] <= this.radius) {
    this.speed[0] = -this.speed[0];
  }

  // bounce right
  if (this.position[0] >= canvas.width-this.radius) {
    this.speed[0] = -this.speed[0];
  }

  // bounce top
  if (this.position[1] <= this.radius) {
    this.speed[1] = -this.speed[1];
  }

  // move (rewrite positions)
  this.lastX = this.position[0];
  this.position = this.position.map(function(current, index) {
    return current + this.speed[index];
  }.bind(this));

};
