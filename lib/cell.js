const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');

const randomColor = (num = 0, multiplayer) => {
  let colors;
  if(multiplayer){
    colors = ['black', 'purple', 'magenta', 'orange', 'green'];
  } else{
    colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'maroon'];
  }
  let randomPosition = Math.floor(Math.random()*colors.length);
  return colors[randomPosition];

};

const randomRadius = (min, max) => {
  return Math.floor((Math.random() * (max-min)) + min);
};

class Cell extends MovingObject {

  constructor(options = {}, multiplayer=false) {
      options.colorNum = options.colorNum || 0;
      options.color = randomColor(options.colorNum, multiplayer);
      options.pos = options.pos || options.game.randomPosition();
      options.radius = randomRadius(3,40);
      options.vel = options.vel || Util.randomVec(0.1);
			super(options);
  }

}

module.exports = Cell;
