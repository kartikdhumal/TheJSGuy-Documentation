import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAStack() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Stack</h1>
      <p>
        A Stack is Last In, First Out (LIFO): the last item added is the first removed. Operations: push (add on top), pop (remove from top), peek (see top without removing).
      </p>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    if (this.items.length === 0) return null;
    return this.items.pop();
  }
  peek() {
    if (this.items.length === 0) return null;
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop());  // 2
console.log(stack.peek()); // 1`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSAStack;
