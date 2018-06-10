const axios = require('axios');
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.log('Could not connect: ', err);
});

client.on('connect', () => {
  console.log('Connected to Redis server');
})

const Graph = function() {
  this.size = 0;
  this.links = 0;
  this.pageIdToPos = {}; // Keeps track of each page's position in AdjList
  this.AdjList = [];
};

Graph.prototype.resetConnections = function() {
  for (let i = 0; i < this.AdjList.length; i++) {
    this.AdjList[i] = [];
  }
  this.links = 0; 
};

Graph.prototype.wipe = function() {
  this.size = 0;
  this.links = 0;
  this.pageIdToPos = {}; // Keeps track of each page's position in AdjList
  this.AdjList = [];
}

Graph.prototype.addPage = function(id) {
  if (!id || this.pageIdToPos[id] !== undefined) {
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
  client.get(AdjListToString, (err, data) => {
    if (data) {
      let { pageOrder, iterations } = data
      cb(pageOrder, iterations);
      return;
    }
    let AdjListWithIndices = createAdjListWithIndices(this.AdjList, this.pageIdToPos); // Map Id's to positions in array for python script to read
    
    axios.post('http://localhost:5000', AdjListWithIndices)
      .then((result) => {
        let { vector: pageRankVector, iterations } = result.data
        let pageOrder = [];
        Object.keys(this.pageIdToPos).forEach((id) => {
          let index = this.pageIdToPos[id];
          pageOrder[index] = [id, pageRankVector[index]];
        });
        pageOrder.sort((page1, page2) => {
          return page2[1] - page1[1];
        });
        let data = {pageOrder: pageOrder, iterations: iterations}
        client.set(AdjListToString, data);
        cb(pageOrder, iterations);
      })
      .catch((err) => {
        cb(null, null, err);
      });
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