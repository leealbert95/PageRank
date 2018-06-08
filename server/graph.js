const spawn = require('child_process');

const py = spawn('python', ['compute_pagerank.py']);

const Graph = function() {
  this.idCounter = 0;
  this.size = 0;
  this.links = 0;
  this.pageIdToPos = {}; // Keeps track of each page's position in AdjList
  this.pageRankMemo = {}; // Memoize results of each page rank calculation to avoid repetitive calculation
  this.AdjList = [];
};

Graph.prototype.populate = function(pageLinks) {
  
};

Graph.prototype.addPage = function(id) {
  if (!id) {
    return false;
  }
  this.pageIdToPos[id] = this.size;
  this.AdjList.push([]);
  this.size++;
  return true;
};

Graph.prototype.createLink = function(from, to) {
  let indexFrom = this.pageIdToPos[from];
  let indexTo = this.pageIdToPos[to]; 
  if (indexFrom === undefined || indexTo === undefined) {
    return false;
  }
  let links = this.AdjList[indexFrom];
  links.push(indexTo);
  return true;
};

Graph.prototype.calculatePageRank = function(cb) {
  let AdjListToString = JSON.stringify(this.AdjList);
  if (this.pageRankMemo[AdjListToString]) { 
    // Have already calculated pagerank for this adjacency list
    cb(this.pageRankMemo[AdjListToString]);
    return;
  } 
  py.stdin.write(JSON.stringify(this.AdjList));
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
}