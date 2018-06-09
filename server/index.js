const express = require('express');
const path = require('path');
const Graph = require('./graph.js');

const Network = new Graph();

Network.addPage('apple.com');
Network.addPage('orange.com');
Network.addPage('banana.com');
Network.addPage('kiwi.com');
Network.addPage('grape.com');
Network.addPage('coconut.com');
Network.addPage('peach.com');
Network.createLink('apple.com', 'kiwi.com');
Network.createLink('apple.com', 'grape.com');
Network.createLink('coconut.com', 'kiwi.com');
Network.createLink('coconut.com', 'orange.com');
Network.createLink('coconut.com', 'apple.com');
Network.createLink('orange.com', 'kiwi.com');
Network.createLink('orange.com', 'peach.com');
Network.createLink('banana.com', 'kiwi.com');
Network.createLink('kiwi.com', 'grape.com');
