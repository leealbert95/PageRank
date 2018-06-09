const spawn = require('child_process').spawn;

const py = spawn('python', ['compute_pagerank.py']);

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
  if (!id) {
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
  links.push(toId);
  this.links++;
  return true;
};

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
  
  py.stdin.write(JSON.stringify(AdjListWithIndices));
  py.stdin.end();

  let dataString = '';
  py.stdout.on('data', (data) => {
    dataString += data;
  });
  py.stdout.on('end', () => {
    let pageRankVector = JSON.parse(dataString);
    let pages = [];
    Object.keys(this.pageIdToPos).forEach((id) => {
      pages[this.pageIdToPos[id]] = id;
    });
    pages.sort((id1, id2) => {
      let index1 = this.pageIdToPos[id1];
      let index2 = this.pageIdToPos[id2];
      return pageRankVector[index2] - pageRankVector[index1];
    });
    this.pageRankMemo[AdjListToString] = pages;
    cb(pages);
  });
};

function createAdjListWithIndices(AdjList, pageIdToPos) {
  return AdjList.map((list) => 
    list.map((id) => 
      pageIdToPos(id)
    )
  );
}

module.exports = Graph;