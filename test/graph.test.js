const Graph = require('../server/graph.js');
const testGraph = new Graph();

describe('Testing Graph', () => {
  afterEach(() => {
    testGraph.wipe(true);
  });
  
  test('Should have empty adjacency list on init', () => {
    expect(testGraph.AdjList).toHaveLength(0);
    expect(testGraph.size).toBe(0);
  });

  test('Should be able to add new pages to graph', () => {
    testGraph.addPage('foo');
    testGraph.addPage('bar');
    expect(testGraph.AdjList).toHaveLength(2);
    expect(testGraph.size).toBe(2);
    expect(testGraph.pageIdToPos).toHaveProperty('foo', 0);
    expect(testGraph.pageIdToPos).toHaveProperty('bar', 1);
  });

  test('Should create link from one page to another', () => {
    testGraph.addPage('foo');
    testGraph.addPage('bar'); 
    testGraph.createLink('foo', 'bar');
    let fooLinks = testGraph.getLinksFor('foo');
    expect(fooLinks).toContain('bar');
  });

  test('Should be able to create multiple links from a page', () => {
    testGraph.addPage('foo');
    testGraph.addPage('bar');
    testGraph.addPage('apple');
    testGraph.addPage('orange');
    testGraph.createLink('foo', 'bar');
    testGraph.createLink('foo', 'apple');
    testGraph.createLink('foo', 'orange');
    let fooLinks = testGraph.getLinksFor('foo');
    expect(fooLinks).toEqual(['bar', 'apple', 'orange']);
  });
})