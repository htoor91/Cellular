const MovingObject = require('./moving_object.js');
const Util = require('./utils.js');

class Ship extends MovingObject {
  constructor(options){
    options.color = options.color || 'black';
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0,0];
    super(options);
  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  }

}

Ship.RADIUS = 15;
module.exports = Ship;
