const Util = require("./utils.js");

class MovingObject {
  constructor(options){
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
    this.shadowColor = 'white';
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);

    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.radius;
    ctx.fill();
  }

  collideWith(otherObject) {
    if (otherObject.radius < this.radius){
      otherObject.remove();
      this.radius += (0.2 * otherObject.radius);
      return true;
    }else if (otherObject.radius > this.radius){
      this.remove();
      otherObject.radius += (0.2 * this.radius);
      return true;
    }
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    if(this.game.survival) {
      this.vel[0] *= 1.01;
      this.vel[1] *= 1.01;
    }
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }
  }

  remove() {
    this.game.remove(this);
  }

}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
