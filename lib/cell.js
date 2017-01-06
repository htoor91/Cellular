const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');

const randomColor = (num = 0) => {
  const colors1 = ['#8cffdd', '#76aee8', '#8b64ae', '#77385f', '#4a2121'];
  const colors2 = ['red', 'blue', 'green', 'purple', 'orange', 'maroon', 'brown'];
  const colors3 = ['#b01317', '#ff2247', '#37fdfc', '#0021a4', '#7bafd4'];

  const allColors = [colors1,colors2,colors3];
  const colorPallete = allColors[num%3];

  let randomPosition = Math.floor(Math.random()*colorPallete.length);

  return colorPallete[randomPosition];
};

const randomRadius = (min, max) => {
  return Math.floor((Math.random() * (max-min)) + min);
};

class Cell extends MovingObject {

  constructor(options = {}) {
      options.colorNum = options.colorNum || 0;
      options.color = randomColor(options.colorNum);
      options.pos = options.pos || options.game.randomPosition();
      options.radius = randomRadius(3,40);
      options.vel = options.vel || Util.randomVec(0.1);
			super(options);
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


}

module.exports = Cell;
