const axios = require('axios');

const Graph = function() {
  this.size = 0;
  this.links = 0;
  this.pageIdToPos = {}; // Keeps track of each page's position in AdjList
  this.pageRankMemo = {}; // Memoize results of each page rank calculation to avoid repetitive calculation
  this.AdjList = [];
};

Graph.prototype.resetConnections = function() {
  for (let i = 0; i < this.AdjList.length; i++) {
    this.AdjList[i] = [];
  }
  this.links = 0; 
};

Graph.prototype.wipe = function(clearCache) {
  this.size = 0;
  this.links = 0;
  this.pageIdToPos = {}; // Keeps track of each page's position in AdjList
  this.AdjList = [];
  clearCache ? this.pageRankMemo = {} : null;
}

Graph.prototype.addPage = function(id) {
  if (!id || this.pageIdToPos[id]) {
    return false;
  }
  this.pageIdToPos[id] = this.size;
  this.AdjList.push([]);
  this.size++;
  return true;
};

Graph.prototype.createLink = function(fromId, toId) {
  if (this.pageIdToPos[fromId] === undefined || this.pageIdToPos[toId] === undefined
    || fromId === toId) {
    return false;
  }
  let fromIndex = this.pageIdToPos[fromId];
  let links = this.AdjList[fromIndex];
  if (links.includes(toId)) { // Link already exists
    return false;
  }
  links.push(toId);
  this.links++;
  return true;
};

Graph.prototype.showAdjList = function() {
  return this.AdjList;
}

Graph.prototype.getLinksFor = function(id) {
  let index = this.pageIdToPos[id];
  if (index === undefined) {
    return;
  }
  return this.AdjList[index];
};

Graph.prototype.getListPosFor = function(id) {
  return this.pageIdToPos[id];
}

Graph.prototype.calculatePageRank = function(cb) {
  let AdjListToString = JSON.stringify(this.AdjList);
  if (this.pageRankMemo[AdjListToString]) { 
    // Have already calculated pagerank for this adjacency list
    cb(this.pageRankMemo[AdjListToString]);
    return;
  } 

  let AdjListWithIndices = createAdjListWithIndices(this.AdjList, this.pageIdToPos); // Map Id's to positions in array for python script to read

  axios.post('http://localhost:5000', AdjListWithIndices)
    .then((result) => {
      let { vector: pageRankVector, iterations } = result.data
      let pages = [];
      Object.keys(this.pageIdToPos).forEach((id) => {
        let index = this.pageIdToPos[id]
        pages[index] = [id, pageRankVector[index]];
      });
      pages.sort((page1, page2) => {
        return page2[1] - page1[1];
      });
      this.pageRankMemo[AdjListToString] = pages;
      cb(pages, iterations);
    })
    .catch((err) => {
      cb(null, null, err);
    });
};

function createAdjListWithIndices(AdjList, pageIdToPos) {
  return AdjList.map((list) => 
    list.map((id) => 
      pageIdToPos[id]
    )
  );
}

module.exports = Graph;