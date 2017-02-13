/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementById("game-canvas");
	  const ctx = canvasEl.getContext("2d");
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  $('.restart').click(() => window.location.reload());
	
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Cell = __webpack_require__(2);
	const Ship = __webpack_require__(5);
	const Util = __webpack_require__(3);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util =  {
	
	  dir(vec){
	    const norm = Util.norm(vec);
	    return Util.scale(vec, 1/norm);
	  },
	
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  randomVec (length) {
	    const deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  wrap (coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(3);
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(5);
	
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
	    const website = "<div class='website'>For more projects, visit <a href='http://www.hassantoor.com' target='_blank'>here</a></div>";
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map