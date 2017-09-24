function Brick(x, y) {
  this.height = 20;
  this.width = 70;
  this.x = x;
  this.y = y;
}

Brick.prototype.render = function() {
  context.fillStyle = '#ffb';
  context.fillRect(this.x, this.y, this.width, this.height);
};
