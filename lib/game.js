const Cell = require("./cell");
const Ship = require("./ship.js");
const Util = require("./utils.js");

class Game {
  constructor() {
    this.cells = [];
    this.ship = [];
    this.score = 0;
    this.level = 0;
    this.secs = 0;
    this.addCells();

  }

  setSurvival() {
    this.survival = true;
  }

  setMultiplayer() {
    this.multiplayer = true;
    this.ship = [];
    this.addShip("one");
    this.addShip("two");
    this.addCells(Game.NUM_CELLS, 0.1);
  }

  add(object) {
    if (object instanceof Cell){
      this.cells.push(object);
    }else if (object instanceof Ship){
      this.ship.push(object);
    }
  }

  addCells(num, vel=0.1) {
    this.level++;
    num = num || Game.NUM_CELLS;

    if (this.cells.length > 0){
      this.cells = [];
    }

    for (let i = 0; i < num; i++) {
      this.add(new Cell({ game: this, vel: Util.randomVec(vel), colorNum: this.level}, this.multiplayer));
    }
  }

  addShip(player) {
    let pos;
    let color;
    if(player === "one"){
      pos = [3*(Game.DIM_X/4), (Game.DIM_Y/2)];
      color = "blue";
    } else if(player === "two"){
      pos = [(Game.DIM_X/4), (Game.DIM_Y/2)];
      color = "red";
    } else {
      pos = [(Game.DIM_X/2), (Game.DIM_Y/2)];
      color = "black";
    }
    const ship = new Ship({
      pos,
      color,
      game: this
    });

    this.add(ship);

    return ship;
  }

  allObjects() {
    if(this.cells.length < 2 && !this.multiplayer){
      if (this.survival){
        this.addCells(70, (0.1));
      } else{
        this.addCells(70, (this.level*0.3));
      }
      this.ship[0].radius = 15;
      this.ship[0].vel = [0,0];
    }
    return [].concat(this.ship,this.cells);
  }

  checkCollisions() {
    const allObjects = this.allObjects();

    if(this.survival) {
      this.secs++;
      if(this.secs % 10 === 0){
        this.score += 10;
      }
    }
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision){
            if((obj1 instanceof Ship)|| obj2 instanceof Ship){
              if(obj1 instanceof Ship){
                if (obj1.radius > obj2.radius){
                  this.score += Math.floor(obj2.radius);
                }
              } else {
                if (obj2.radius > obj1.radius) {
                  this.score += Math.floor(obj1.radius);
                }
              }
            }
            return;
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
    if(!this.multiplayer){
      $('.score').html(`Score: ${this.score}`);
    }

  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  randomPosition() {

    let xPos = Game.DIM_X * Math.random();
    let yPos = Game.DIM_Y * Math.random();

    if (this.ship){
      let pos = [(Game.DIM_X/2),(Game.DIM_Y/2)];

      if(this.ship[0]){
        pos = this.ship[0].pos;
      }

      while(xPos > (pos[0] - 50) && xPos < (pos[0]+50)){
        xPos = Game.DIM_X * Math.random();
      }

      while(yPos > (pos[1]) - 50 && yPos < (pos[1])+50){
        yPos = Game.DIM_Y * Math.random();
      }
    }

    return [
      xPos,
      yPos
    ];
  }

  remove(object) {
    if (object instanceof Cell){
      this.cells.splice(this.cells.indexOf(object), 1);
    }else if (object instanceof Ship){
      this.ship.splice(this.ship.indexOf(object), 1);
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "lightgrey";
Game.DIM_X = window.innerWidth;
Game.DIM_Y = window.innerHeight;
Game.FPS = 60;
Game.NUM_CELLS = 70;

module.exports = Game;
