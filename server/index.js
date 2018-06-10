const express = require('express');
const path = require('path');
const Graph = require('./graph.js');

const Network = new Graph();

Network.addPage('apple.com');
Network.addPage('orange.com');
Network.addPage('banana.com');
Network.addPage('kiwi.com');
Network.addPage('grape.com');
Network.createLink('apple.com', 'orange.com');
Network.createLink('apple.com', 'kiwi.com');
Network.createLink('apple.com', 'grape.com');
Network.createLink('orange.com', 'grape.com');
Network.createLink('banana.com', 'apple.com');
Network.createLink('banana.com', 'orange.com');
Network.createLink('kiwi.com', 'orange.com');
Network.createLink('grape.com', 'orange.com');
Network.calculatePageRank((sortedPages, iterations, err) => {
  console.log(sortedPages);
  console.log(`Calculated in ${iterations} iterations`);
});
