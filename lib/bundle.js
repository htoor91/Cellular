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
	      this.add(new Cell({ game: this, vel: Util.randomVec(vel), colorNum: this.level}));
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
	
	    $('.score').html(`Score: ${this.score}`);
	
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
	
	const randomColor = (num = 0) => {
	  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'maroon'];
	  let randomPosition = Math.floor(Math.random()*colors.length);
	  return colors[randomPosition];
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
	const key = __webpack_require__(7);
	
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
	
	  bindKeyHandlers() {
	   const ship = this.ship;
	    key("enter", () => { this.pause();});
	  }
	
	  pause(){
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
	    } else if((allObjects.filter(e => e instanceof Ship)).length === 0 ||
	              (this.game.multiplayer && (allObjects.filter(e => e instanceof Ship)).length < 2)){
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.
	
	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];
	
	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;
	
	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }
	
	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }
	
	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };
	
	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;
	
	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }
	
	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);
	
	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;
	
	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;
	
	    scope = getScope();
	
	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];
	
	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };
	
	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);
	
	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }
	
	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };
	
	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };
	
	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }
	
	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };
	
	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;
	
	    multipleKeys = getKeys(key);
	
	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');
	
	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }
	
	      key = keys[keys.length - 1];
	      key = code(key);
	
	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };
	
	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }
	
	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }
	
	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }
	
	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;
	
	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };
	
	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;
	
	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };
	
	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }
	
	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }
	
	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };
	
	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);
	
	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);
	
	  // store previously defined key
	  var previousKey = global.key;
	
	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }
	
	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;
	
	  if(true) module.exports = assignKey;
	
	})(this);


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map