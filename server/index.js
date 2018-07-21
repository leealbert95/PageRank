const express = require('express');
const path = require('path');
const Graph = require('./graph.js');

const Network = new Graph();
const app = express(); 

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('/graph', (req, res) => {
  
});



