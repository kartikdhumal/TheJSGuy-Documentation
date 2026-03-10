import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSALinkedList() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Linked List</h1>
      <p>
        A Linked List is a chain of nodes. Each node has data and a pointer to the next node. Insert and delete can be efficient by changing links; access by index requires walking from the head.
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  insert(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) current = current.next;
    current.next = newNode;
  }
  delete(data) {
    if (!this.head) return;
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    while (current.next && current.next.data !== data) current = current.next;
    if (current.next) current.next = current.next.next;
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

const list = new LinkedList();
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

export default DSALinkedList;
