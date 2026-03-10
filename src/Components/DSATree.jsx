import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSATree() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Tree (Binary Search Tree)</h1>
      <p>
        A tree has a root and nodes with left and right children. In a Binary Search Tree (BST), values in the left subtree are smaller and in the right subtree are larger than the node’s value. Insert and search use this rule to go left or right.
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  insert(data) {
    const newNode = new TreeNode(data);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }
  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }
  search(data) {
    return this.searchNode(this.root, data);
  }
  searchNode(node, data) {
    if (!node) return false;
    if (data < node.data) return this.searchNode(node.left, data);
    if (data > node.data) return this.searchNode(node.right, data);
    return true;
  }
}

const tree = new BinaryTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);
console.log(tree.search(15)); // true
console.log(tree.search(20)); // false`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSATree;
