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
