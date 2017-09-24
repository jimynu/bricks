// set canvas, context
var canvas = document.querySelector('#canvas');
var context = canvas.getContext('2d');
//context.scale(2, 2);

// controller for keys
var keyDown = {
  left: false,
  right: false
};

function Game() {
  // initialise ball + paddle
  this.ball = new Ball();
  this.ball.initialise();
  this.paddle = new Paddle();

  // array for wall of bricks
  this.wall = [];

  // points
  this.lives = 3;
  this.score = 0;
  this.level = 1;

  // listen for keys to move paddle -> set controller (upPressed, downPressed) in the respective paddle (1/2) to true
  document.addEventListener('keydown', function(event) {
    //console.log(event.keyCode);
    if(event.keyCode === 37) {
      // left pressed
      keyDown.left = true; // set controller
      this.paddle.moveLeft(); //
    } else if(event.keyCode === 39) {
      // right pressed
      keyDown.right = true; // set controller
      this.paddle.moveRight();
    }
  }.bind(this));

  //listen for key release -> set controller to false
  document.addEventListener('keyup', function(event) {
    if(event.keyCode === 37) {
      keyDown.left = false;
    } else if(event.keyCode === 39) {
      keyDown.right = false;
    }
  });
}

Game.prototype.buildWall = function(timesX, timesY) {
  // create bricks, loop, array

  // var brick1 = new Brick(80, 80);
  // var brick2 = new Brick(80 + 1*70 + 1*4, 80 + 20y + 4y);
  // var brick6 = new Brick(80 + 5*70 + 5*4, 80);
  for (var y = 0; y < timesY; y++) {
    for (var x = 0; x < timesX; x++) {
      this.wall.push(new Brick(80+74*x, 80+24*y));
    }
  }
};

Game.prototype.renderWall = function() {
  // loop through array game.wall and render each brick
  this.wall.forEach(function(brick) {
    brick.render();
  });
};


Game.prototype.resetCanvas = function() {
  context.fillStyle = '#8ccfd6';
  context.fillRect(0,0,canvas.width,canvas.height);
};


Game.prototype.checkPaddleCollision = function() {
  // horizontally: ball.x is at paddle height (and not below)
  // vertically:   paddle starts before ball.y and stops after ball.y (add radius to catch when ball hits edge of paddle)
  if (this.ball.position[1]+this.ball.radius >= this.paddle.position[1] && this.ball.position[1]+this.ball.radius < this.paddle.position[1]+10 &&
      this.paddle.position[0] - this.ball.radius <= this.ball.position[0] && this.paddle.position[0]+this.paddle.length + this.ball.radius >= this.ball.position[0] ) {
    console.log('hit paddle');
    // switch ball direction (y-axis)
    this.ball.speed[1] = -this.ball.speed[1];

    // edge case (quite literally): ball hits the edge of the paddle
    // problem: also is true if it hits the edge with 45° –> check trajectory (lastX)
    if ( this.paddle.position[0] >= this.ball.position[0] && /* ball comes from the left */ this.ball.lastX < this.ball.position[0] ||
         this.paddle.position[0] + this.paddle.length <= this.ball.position[0] && /* from right */ this.ball.lastX > this.ball.position[0]) {
      // switch ball direction (x-axis)
      this.ball.speed[0] = -this.ball.speed[0];
      console.log('last x: ' + this.ball.lastX);
      console.log('x: ' + this.ball.position[0]);
    }
  }
};


Game.prototype.checkBrickCollision = function() {
  var ball = {};
  ball.x = game.ball.position[0];
  ball.y = game.ball.position[1];
  ball.radius = game.ball.radius;

  this.wall.forEach(function(brick, index) {
    if ( ball.x + ball.radius >= brick.x  &&  ball.x - ball.radius <= brick.x + brick.width  &&
         ball.y + ball.radius >= brick.y  &&  ball.y - ball.radius <= brick.y + brick.height) {
      console.log('hit brick');

      // check if hit from the side or form below/above
      // use approximation: first 5px (radius) = hit from side
      if (ball.x <= brick.x  ||  ball.x >= brick.x+brick.width) {
        // bounce off sideways
        this.ball.speed[0] = -this.ball.speed[0];
      } else {
        // bounce off vertically
        this.ball.speed[1] = -this.ball.speed[1];
      }

      // delete brick from array
      this.wall.splice(index, 1);

      // check bricks left and increase speed / victory
      this.checkBricksLeft();

      // increase score
      this.score = this.score + 10 * this.level;
    }
  }.bind(this));
};

// check if ball under paddle –> ball + speed reset, decrease lives (if no more lives: game over)
Game.prototype.checkMissedBall = function() {
  if (this.ball.position[1] > canvas.height) {
    // decrease lives
    this.lives--;

    if (this.lives === 0) {
      this.finish('GAME OVER');
    }

    // new ball
    this.ball.initialise();

    // back to level 1
    this.level = 1;
  }
};

// check bricks left –> increase speed, shrink paddle; if all bricks are gone: win
Game.prototype.checkBricksLeft = function() {
  // all gone
  if (this.wall.length === 0) {
    this.finish('YOU WON!');
  }

  // faster, shorter, harder (after every 5th brick)
  if (this.wall.length % 5 === 0) {
    //faster ball
    this.ball.speed = this.ball.speed.map(function(currentSpeed) {
      return 1.2*currentSpeed;
    }.bind(this));
    // shorter paddle
    this.paddle.position[0] = this.paddle.position[0] + this.paddle.length*0.05;
    this.paddle.length = this.paddle.length/1.1;
    // next level
    this.level++;
  }
};

Game.prototype.renderScoreBoard = function() {
  context.fillStyle = 'white';
  context.font = 'bold 16px Arial';
  context.fillText('Lives: ' + this.lives, 12, canvas.height-12);
  context.fillText('Score: ' + this.score, canvas.width/2-40, canvas.height-12);
  context.fillText('Level: ' + this.level, canvas.width-70, canvas.height-12);
};

Game.prototype.finish = function(text) {
  clearInterval(this.interval);
  context.fillStyle = 'white';
  context.font = 'bold 18px Arial';
  context.fillText(text, canvas.width/2-60, canvas.height/2+40);
};


// method game.play –> sets interval to redraw every 17ms
  // √draw bckgr, √ball, –> bricks <–
  // check for collisions (√ball/paddle, –>ball/bricks<–)
Game.prototype.play = function() {
  this.interval = setInterval(function() {
    this.resetCanvas();
    this.ball.render();
    this.paddle.render();
    this.renderWall();
    this.ball.move();
    this.checkBrickCollision();
    this.checkPaddleCollision();
    this.checkMissedBall();
    this.renderScoreBoard();
  }.bind(this), 17);
};




// start game
var game = new Game();
game.buildWall(6, 5);
game.play();
