const spawn = require('child_process');

const py = spawn('python', ['compute_pagerank.py']);

const Network = function() {
  this.idCounter = 0;
  this.size = 0;
  /* Since indices will change during page removal,
    must keep map id of page to its current position in array*/
  //###################
  this.mapPageToPos = {}; 
  //###################
  this.pageLinkPos = [];
};

Network.prototype.populate = function(pageLinks) {
  this.size = Object.keys(pageLinks).length;
  this.pageLinks = pageLinks;
  // for (let i = 0; i < this.size; i++) {
  //   let conns = this.matrix.reduce((acc, pages) => {
  //     pages[i] === 0 ? null : acc.push(pages[i])
  //   }, []);
  //   this.pageLinks[i] = conns;
  // }
};

Network.prototype.addPage = function(id) {
  if (!id) {
    return false;
  }
  this.mapPageToPos[id] = this.size;
  this.pageLinksPos.push({id: id, links: []})
  this.size++;
};

Network.prototype.removePage = function(id) {
  if (!this.mapPageToPos.hasOwnPropery(id)) {
    return false;
  }
  let pos = this.mapPageToPos[id];
  delete this.mapPageToPos[id];
  this.pageLinkPos.splice(pos, 1);
  Object.keys(this.pageLinksPos).forEach((page) => {
    let index = page.links.indexOf(pos);
    index !== -1 ? page.links.splice(index) : null;
  });
  Object.keys(this.mapPageToPos).forEach((id) => {
    this.mapPageToPos[i] > pos ? this.mapPageToPos[i]-- : null; 
  })
  return true;
}

Network.prototype.createLink = function(from, to) {
  if (!this.mapPageToPos.hasOwnPropery(from) || !this.mapPageToPos.hasOwnPropery(to) 
    || from === to || this.pageLinks[from].indexOf(to) !== -1) {
    return false;
  }
  this.pageLinksPos[from].push(to);
  return true;
};

Network.prototype.removeLink = function(from, to) {
  if (!this.mapPageToPos.hasOwnPropery(from) || !this.mapPageToPos.hasOwnPropery(to)) {
    return false;
  }
  let fromIndex = this.mapPageToPos(from);
  let toIndex = this.mapPageToPos(to);
  let rmIndex = this.pageLinksPos[fromIndex].links.indexOf(toIndex);
  if (rmIndex === -1) {
    return false;
  }
  this.pageLinks[fromIndex].links.splice(rmIndex, 1);
  Object.keys(this.pageLinks.forEach((page) => {

  }))
  return true;
};

Network.getMatrix = function() {
  let matrix = [];
  for (let i = 0; i < this.size; i++) {
    let row = [];
    for (let j = 0; j < this.size; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  Object.keys(this.pageLinks).forEach((page) => {
    this.pageLinks[page].forEach()
    
  })
}