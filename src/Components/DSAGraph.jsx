import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAGraph() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Graph</h1>
      <p>
        A graph has vertices (nodes) and edges between them. It can be directed or undirected. We can store it as an adjacency list (each vertex has a list of neighbors) or an adjacency matrix (2D array). Below is an adjacency list example.
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation (Adjacency List)</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }
  getVertices() {
    return Object.keys(this.adjacencyList);
  }
}

const graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B');
console.log(graph.adjacencyList); // { A: ['B'], B: ['A'] }`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation (Adjacency Matrix)</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`class AdjacencyMatrixGraph {
  constructor() {
    this.adjacencyMatrix = [];
    this.vertexCount = 0;
  }
  addVertex() {
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      this.adjacencyMatrix[i].push(0);
    }
    this.adjacencyMatrix.push(new Array(this.vertexCount + 1).fill(0));
    this.vertexCount++;
  }
  addEdge(vertex1, vertex2) {
    this.adjacencyMatrix[vertex1][vertex2] = 1;
    this.adjacencyMatrix[vertex2][vertex1] = 1;
  }
}

const g = new AdjacencyMatrixGraph();
g.addVertex();
g.addVertex();
g.addEdge(0, 1);
console.log(g.adjacencyMatrix); // [[0, 1], [1, 0]]`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSAGraph;
