const Ship = require('./ship.js');

const Keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    w: false,
    a: false,
    s: false,
    d: false
};

window.onkeydown = function(e){
     const kc = e.keyCode;
     e.preventDefault();

     if(kc === 37) Keys.left = true;
     if(kc === 38) Keys.up = true;
     if(kc === 39) Keys.right = true;
     if(kc === 40) Keys.down = true;

     if(kc === 87) Keys.w = true;
     if(kc === 65) Keys.a = true;
     if(kc === 83) Keys.s = true;
     if(kc === 68) Keys.d = true;

 };

window.onkeyup = function(e){
     const kc = e.keyCode;
     e.preventDefault();

     if(kc === 37) Keys.left = false;
     if(kc === 38) Keys.up = false;
     if(kc === 39) Keys.right = false;
     if(kc === 40) Keys.down = false;

     if(kc === 87) Keys.w = false;
     if(kc === 65) Keys.a = false;
     if(kc === 83) Keys.s = false;
     if(kc === 68) Keys.d = false;


};





class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.inPlay = false;
    this.startScreen = true;
    this.ship = this.game.addShip();
  }

  pause(){
    if (this.inPlay === false){
      this.inPlay = true;
    }else{
      this.inPlay = false;
    }
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  shipControls() {
    this.ship.vel[0] *= 0.92;
    this.ship.vel[1] *= 0.92;
    const speed = this.game.survival ? 0.9 : 0.5;

    if(Keys.up) {
      this.ship.power([0,-speed]);
    }
    if(Keys.down){
      this.ship.power([0,speed]);
    }

    if(Keys.left) {
      this.ship.power([-speed,0]);
    }

    if(Keys.right){
      this.ship.power([speed,0]);
    }

  }

  setMultiplayerControls() {
    this.playerOne.vel[0] *= 0.92;
    this.playerOne.vel[1] *= 0.92;
    this.playerTwo.vel[0] *= 0.92;
    this.playerTwo.vel[1] *= 0.92;
    const speed = 0.7;

    if(Keys.up) {
      this.playerOne.power([0,-speed]);
    }
    if(Keys.down){
      this.playerOne.power([0,speed]);
    }

    if(Keys.left) {
      this.playerOne.power([-speed,0]);
    }

    if(Keys.right){
      this.playerOne.power([speed,0]);
    }

    if(Keys.w) {
      this.playerTwo.power([0,-speed]);
    }
    if(Keys.s){
      this.playerTwo.power([0,speed]);
    }

    if(Keys.a) {
      this.playerTwo.power([-speed,0]);
    }

    if(Keys.d){
      this.playerTwo.power([speed,0]);
    }


  }

  setLocalStorage() {
    if(!this.game.multiplayer){
      if(!localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", 1000);
      }
      if(!localStorage.getItem("survivalScore")) {
        localStorage.setItem("survivalScore", 500);
      }

      if (this.game.survival){
        if (this.game.score > localStorage.getItem("survivalScore")){
          localStorage.setItem("survivalScore", this.game.score);
        }
      } else{
        if (this.game.score > localStorage.getItem("highScore")){
          localStorage.setItem("highScore", this.game.score);
        }
      }
      const scoreVal = localStorage.getItem('highScore');
      const survivalVal = localStorage.getItem("survivalScore");
      const highScore = `<div class="high-score">Standard high score: ${scoreVal}</div>`;
      const survivalScore = `<div class="survival-score">Survival high score: ${survivalVal}</div>`;
      $('.you-win').append(highScore);
      $('.you-win').append(survivalScore);
    } else{
      // display which color won
      const winningShip = this.game.ship[0];
      const shipColor = winningShip.color;
      const winner = `<div class="winner"><span class=${shipColor}>${shipColor}</span> cell wins!</div>`;
      $('.you-win').append(winner);
    }
    const website = "<div class='website'>For more projects, visit <a href='http://www.hassantoor.com'>here</a></div>";
    $('.you-win').append(website);
  }

  removeScreen() {
    this.startScreen = false;
    this.inPlay = true;
    $('.start-screen').css("display", "none");
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    const allObjects = this.game.allObjects();
    // this.shipControls();
    if(this.game.multiplayer) {
      this.setMultiplayerControls();
    } else {
      this.shipControls();
    }

    if (allObjects.length <= 1){
      if(allObjects[0] instanceof Ship){
        $('.you-win').toggle();
      }
    } else if((this.game.ship.length === 0) ||
              (this.game.multiplayer && this.game.ship.length < 2)){
        $('.you-win').toggle();
        this.setLocalStorage();
    } else{
      if (this.inPlay){
        this.game.step(timeDelta);
        this.game.draw(this.ctx);
      } else if (this.startScreen){
          $('.start-game').click(() => {
            this.removeScreen();
        });
          $('.survival-game').click(() => {
            this.removeScreen();
            this.game.setSurvival();
          });
          $('.multiplayer-game').click(() => {
            this.removeScreen();
            if(!this.game.multiplayer){
              this.game.setMultiplayer();
              this.playerOne = this.game.ship[0];
              this.playerTwo = this.game.ship[1];
            }
          });
      }

      this.lastTime = time;


      requestAnimationFrame(this.animate.bind(this));
    }
  }
}


module.exports = GameView;
