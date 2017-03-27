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

	const $e = __webpack_require__(6);
	const View = __webpack_require__(3);
	
	$e(()=>{
	    const rootEl = $e('.grid');
	      $e(".restart").on("click", () => {
	       $e(".score").html(0);
	       new View(rootEl);
	    });
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(2);
	const $e = __webpack_require__(6);
	
	class Snake {
	  constructor(board) {
	    this.dir = "N";
	    this.turning = false;
	    this.board = board;
	    this.score = 0;
	    const center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
	    this.segments = [center];
	    this.growTurns = 0;
	  }
	
	  eatApple() {
	    if (this.head().equals(this.board.apple.position)) {
	      this.growTurns += 3;
	      return true;
	    } else {
	      return false;
	    }
	  }
	
	  isOccupying(arr) {
	    let result = false;
	    this.segments.forEach((segment) => {
	      if (segment.x === arr[0] && segment.y === arr[1]) {
	        result = true;
	        return result;
	      }
	    });
	    return result;
	  }
	
	  head() {
	    return this.segments.slice(-1)[0];
	  }
	
	  isValid() {
	    const head = this.head();
	
	    if (!this.board.validPosition(this.head())) {
	      return false;
	    }
	
	    for (let i = 0; i < this.segments.length - 1; i++) {
	      if (this.segments[i].equals(head)) {
	        return false;
	      }
	    }
	
	    return true;
	  }
	
	  move() {
	    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
	
	    this.turning = false;
	
	    if (this.eatApple()) {
	      this.score += 5;
	      this.board.apple.replace();
	    }
	
	    if (this.growTurns > 0) {
	      this.growTurns -= 1;
	    } else {
	      this.segments.shift();
	    }
	
	    if (!this.isValid()) {
	      this.segments = [];
	    }
	  }
	
	  turn(dir) {
	    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) {
	      return;
	    } else {
	      this.turning = true;
	      this.dir = dir;
	    }
	  }
	  }
	
	  Snake.DIFFS = {
	    "N": new Coord(-1, 0),
	    "E": new Coord(0, 1),
	    "S": new Coord(1, 0),
	    "W": new Coord(0, -1)
	};
	
	Snake.SYMBOL = "S";
	Snake.GROW_TURNS = 3;
	
	module.exports = Snake;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Coord {
	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }
	
	  equals(coord2) {
	    return (this.x === coord2.x && this.y === coord2.y);
	  }
	
	  plus(coord2) {
	    return new Coord(this.x + coord2.x, this.y + coord2.y);
	  }
	
	  isOpposite(coord2) {
	    return (this.x === -coord2.x) && (this.y === -coord2.y);
	  }
	}
	
	module.exports = Coord;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(4);
	const $e = __webpack_require__(6);
	
	class View {
	  constructor($el){
	    this.$el = $el;
	    this.board = new Board(20);
	    this.setupGrid();
	    this.intervalId = window.setInterval(
	      this.step.bind(this),
	      View.STEP_MILLIS
	    );
	
	    $e(window).on("keydown", this.handleKeyEvent.bind(this));
	  }
	
	  render() {
	    this.updateClasses(this.board.snake.segments, "snake");
	    this.updateClasses([this.board.apple.position], "apple");
	    $e('.score').html(this.board.snake.score);
	  }
	
	
	
	  updateClasses(coords, className) {
	    $e(`.${className}`).removeClass(className);
	
	    coords.forEach( coord => {
	      const flatCoord = (coord.x * 20) + coord.y;
	      if (this.$li) {
	        this.$li.eq(flatCoord).addClass(className);
	      }
	    });
	  }
	
	  handleKeyEvent(event) {
	    if (View.KEYS[event.keyCode]) {
	      this.board.snake.turn(View.KEYS[event.keyCode]);
	    }
	  }
	
	  setupGrid() {
	    let html = "";
	
	    for (let i = 0; i < this.board.dim; i++){
	      html += "<ul>";
	      for (let j = 0; j < this.board.dim; j++){
	        html += "<li></li>";
	      }
	      html += "</ul>";
	    }
	
	    this.$el.html(html);
	    this.$li = $e('li');
	  }
	
	  step() {
	    if (this.board.snake.segments.length > 0) {
	      this.board.snake.move();
	      this.render();
	    }else {
	      $e('.apple').removeClass("apple");
	      $e('.score').append("<p>GAME OVER</p>");
	      window.clearInterval(this.intervalId);
	    }
	  }
	}
	
	View.KEYS = {
	  38: "N",
	  39: "E",
	  40: "S",
	  37: "W"
	};
	
	View.STEP_MILLIS = 100;
	
	module.exports = View;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(1);
	const Apple = __webpack_require__(5);
	
	class Board {
	  constructor(dim) {
	    this.dim = dim;
	    this.snake = new Snake(this);
	    this.apple = new Apple(this);
	  }
	
	  static makeGrid(dim) {
	    const grid = [];
	    for (let i = 0; i < dim; i++) {
	      const row = [];
	      for (let j = 0; j < dim; j++) {
	        row.push(Board.BLANK_SYMBOL);
	      }
	      grid.push(row);
	    }
	    return grid;
	  }
	
	  render() {
	    const grid = Board.makeGrid(this.dim);
	    this.snake.segments.forEach((segment) => {
	      grid[segment.x][segment.y] = Snake.SYMBOL;
	    });
	    grid[this.apple.position.x][this.apple.position.y] = Apple.SYMBOL;
	
	    grid.map((row) => {row.join("")}).join("\n");
	  }
	
	  validPosition(coord){
	    return (coord.x >= 0) && (coord.x < this.dim) && (coord.y >= 0) && (coord.y < this.dim);
	  }
	}
	Board.BLANK_SYMBOL = '.';
	module.exports = Board;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(2);
	
	class Apple {
	  constructor(board) {
	    this.board = board;
	    this.replace();
	  }
	
	  replace() {
	    let x = Math.floor(Math.random() * this.board.dim);
	    let y = Math.floor(Math.random() * this.board.dim);
	
	    while (this.board.snake.isOccupying([x, y])) {
	      x = Math.floor(Math.random() * this.board.dim);
	      y = Math.floor(Math.random() * this.board.dim);
	    }
	
	    this.position = new Coord(x, y);
	  }
	
	}
	
	module.exports = Apple;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	  const DOMNodeCollection = __webpack_require__(7);
	
	    const functionQueue = [];
	    let  docReady = false;
	
	    document.addEventListener('DOMContentLoaded', () => {
	       docReady = true;
	       functionQueue.forEach((fnc) => {
	        fnc();
	       });
	    });
	
	    const $e = (arg) => {
	      if (typeof arg === "function"){
	         if (docReady) {
	           arg();
	         } else {
	           functionQueue.push(arg);
	         }
	      }else if (typeof arg === HTMLElement || arg === window){
	        return new DOMNodeCollection([arg]);
	      }else if (typeof arg === 'string') {
	        let nodeList = document.querySelectorAll(arg)
	        let na = Array.from(nodeList);
	        return new DOMNodeCollection(na)
	      }
	  };
	
	  $e.extend = function(obj1, ...mobj) {
	     mobj.forEach((object) => {
	      for (let key in object) {
	        obj1[key] = object[key];
	      }
	    });
	  return obj1;
	 };
	
	 $e.ajax = function(options = {}) {
	  return new Promise((resolve, reject) => {
	    const defaults = {
	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	      method: "GET",
	      url: "document.URL",
	      data: {},
	      success: () => {},
	      error: () => {}
	   };
	    const xhr = new XMLHttpRequest();
	    options = $e.extend(defaults, options);
	    options.type = options.type.toUpperCase();
	    xhr.open(options.type, options.url, true);
	    xhr.onload = function () {
	      const response = JSON.parse(xhr.response);
	
	      if (xhr.status === 200) {
	        options.success(response);
	        resolve(response);
	      } else {
	        options.error(response);
	        reject(response);
	      }
	    };
	
	    xhr.send(options.data);
	  });
	}
	
	  window.$e = $e;
	
	  module.exports = $e;


/***/ },
/* 7 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	
	  constructor(nodes){
	    this.nodes = nodes;
	  }
	
	  each(cb){
	    this.nodes.forEach(cb);
	  }
	
	
	  html(html) {
	    if (typeof html === "string" || typeof html === "number" ) {
	      this.each(node => node.innerHTML = html);
	    } else {
	      if (this.nodes.length > 0) {
	        return this.nodes[0].innerHTML;
	      }
	    }
	  }
	
	
	  empty(){
	    this.html('');
	  }
	
	  append(children){
	    if (this.nodes.length === 0)return;
	
	    if (typeof children === "string") {
	      this.each(node => node.innerHTML += children);
	    }else if (children instanceof DOMNodeCollection){
	      this.each(node => {
	        children.each(childNode =>{
	          node.appendChild(childNode.cloneNode(true))
	        });
	      })
	    }
	
	  }
	
	  attr(key,val){
	    if (typeof val === "string") {
	      this.each(node => node.setAttribute(key,val) );
	    }else{
	      return this.nodes[0].getAttribute(key);
	    }
	  }
	
	  addClass(newClass){
	    this.each(node => node.classList.add(newClass));
	  }
	
	  removeClass(oldClass){
	    this.each(node => node.classList.remove(oldClass));
	  }
	
	  remove(){
	    this.each(node => node.parentNode.removeChild(node));
	  }
	
	  find(selector){
	    let foundNodes = [];
	    this.each(node => {
	      const nodeList = node.querySelectorAll(selector);
	      foundNodes = foundNodes.concat(Array.from(nodeList));
	    });
	    return new DOMNodeCollection(foundNodes);
	  }
	
	  parent() {
	     const parents = [];
	
	     this.each((node) => {
	       parents.push(node.parentNode);
	     });
	
	     return new DOMNodeCollection(parents);
	   }
	
	  children(){
	    let childNodes = [];
	    this.each(node => {
	      const childNodeList = node.children;
	      childNodes = childNodes.concat(Array.from(childNodeList));
	    });
	    return new DOMNodeCollection(childNodes);
	  }
	
	  on(evt, cb) {
	    this.each((node) => {
	      node.addEventListener(evt, cb);
	      node.eventCallback = cb;
	    });
	  }
	
	  off(evt) {
	     this.each((node) => {
	       const cb = node.eventCallback;
	       node.removeEventListener(evt, cb);
	     });
	   }
	
	   eq(idx) {
	      return new DOMNodeCollection([this.nodes[idx]]);
	   }
	
	}
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map