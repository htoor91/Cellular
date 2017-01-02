const Ship = require('./ship.js');
const key = require('../vendor/keymaster.js');

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.inPlay = false;
    this.startScreen = true;
    this.ship = this.game.addShip();
  }

  bindKeyHandlers() {
   const ship = this.ship;

   Object.keys(GameView.MOVES).forEach((k) => {
     let move = GameView.MOVES[k];
     key(k, () => { ship.power(move); });
   });

    key("enter", () => { this.pause();});
  }

  pause(){
    $(".overlay").toggle();
    if (this.inPlay === false){
      this.inPlay = true;
    }else{
      this.inPlay = false;
    }
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    const allObjects = this.game.allObjects();

    if (allObjects.length <= 1){
      if(allObjects[0] instanceof Ship){
        $('.you-win').toggle();
      }

    } else if((allObjects.filter(e => e instanceof Ship)).length === 0){
        $('.congratulations').html('Sorry, You Lost!');
        $('.you-win').toggle();

    } else{

      if (this.inPlay){
        this.game.step(timeDelta);
        this.game.draw(this.ctx);

      } else if (this.startScreen){
          $('.start-game').click(() => {
            this.startScreen = false;
            this.inPlay = true;
            $('.start-screen').css("display", "none");
        });
      }

      this.lastTime = time;
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

GameView.MOVES = {
  "w": [ 0, -0.5],
  "a": [-0.5,  0],
  "s": [ 0,  0.5],
  "d": [ 0.5,  0],
  "up": [ 0, -0.5],
  "left": [-0.5,  0],
  "down": [ 0,  0.5],
  "right": [ 0.5,  0]
};

module.exports = GameView;
