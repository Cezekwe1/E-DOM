/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	  const DOMNodeCollection = __webpack_require__(1);

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
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {

	  constructor(nodes){
	    this.nodes = nodes;
	  }

	  each(cb){
	    return this.nodes.forEach(cb);
	  }

	  html(item){
	    if(typeof item === 'string'){
	       this.each(node => node.innnerHtml = item);
	    }else{
	      return this.nodes[0].innnerHtml;
	    }
	  }

	  empty(){
	    this.html('');
	  }

	  append(children){
	    if (this.nodes.length === 0)return;

	    if (typeof children === "string") {
	      this.each(node => node.innnerHtml += children);
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