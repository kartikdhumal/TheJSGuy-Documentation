import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAQueue() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Queue</h1>
      <p>
        A Queue is First In, First Out (FIFO): the first item added is the first removed. Operations: enqueue (add at back), dequeue (remove from front), front (see front without removing).
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    if (this.items.length === 0) return null;
    return this.items.shift();
  }
  front() {
    if (this.items.length === 0) return null;
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1
console.log(queue.front());   // 2`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSAQueue;
