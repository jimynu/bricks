function Paddle() {
  // initialise coordinates
  this.position = [240, canvas.height-40];
  this.length = 120;
}

Paddle.prototype.render = function() {
    context.fillStyle = 'black';
    context.fillRect(this.position[0],this.position[1],this.length,6);
};

Paddle.prototype.moveLeft = function() {
  // stop loop if key isn't pressed anymore
  if (!keyDown.left) {
    return;
  }

  // check if outermost position is reached
  if (this.position[0] > 0) {
    this.position[0] -= 10;
  }

  this.render();
  setTimeout(this.moveLeft.bind(this), 17);
};

Paddle.prototype.moveRight = function() {
  // stop loop if key isn't pressed anymore
  if (!keyDown.right) {
    return;
  }

  // check if outermost position is reached
  if (this.position[0]+this.length < canvas.width) {
    this.position[0] += 10;
  }

  this.render();
  setTimeout(this.moveRight.bind(this), 17);
};
