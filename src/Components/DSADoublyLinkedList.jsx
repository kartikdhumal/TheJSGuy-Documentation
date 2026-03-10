import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSADoublyLinkedList() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Doubly Linked List</h1>
      <p>
        Like a linked list, but each node has both a next and a prev pointer, so you can move forward and backward. Useful when you need to go back or delete a node when you only have a reference to that node.
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`class DoublyNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
  }
  insert(data) {
    const newNode = new DoublyNode(data);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) current = current.next;
    current.next = newNode;
    newNode.prev = current;
  }
  delete(data) {
    if (!this.head) return;
    if (this.head.data === data) {
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
      return;
    }
    let current = this.head;
    while (current && current.data !== data) current = current.next;
    if (current) {
      if (current.next) current.next.prev = current.prev;
      if (current.prev) current.prev.next = current.next;
    }
  }
  search(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) return true;
      current = current.next;
    }
    return false;
  }
}

const list = new DoublyLinkedList();
list.insert(1);
list.insert(2);
console.log(list.search(2)); // true
list.delete(1);
console.log(list.search(1)); // false`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default DSADoublyLinkedList;
