  const DOMNodeCollection = require("./dom_node_collection");

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
