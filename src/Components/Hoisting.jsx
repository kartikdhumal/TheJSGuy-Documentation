import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Hoisting() {
  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Hoisting in JavaScript</h1>

      <div className="method-section">
        <h3>What is Hoisting?</h3>
        <p>
          Hoisting is JavaScript's default behavior of moving declarations to the top of the scope. 
          It's crucial to understand how different types of declarations are hoisted.
        </p>
      </div>

      <div className="method-section">
        <h3>How Hoisting Works</h3>
        
          <CodeBlock language="javascript" style={atomDark}>{`// Hoisting Example

console.log(a); // ReferenceError: Cannot access 'a' before initialization
console.log(b); // Undefined
console.log(c); // ReferenceError: Cannot access 'c' before initialization
myName(); // Pappu Kumar
console.log(myCity); // Undefined

let a = 10;    // 'let' variables are hoisted but not initialized
var b = 10;    // 'var' variables are hoisted and initialized with 'undefined'
const c = 10;  // 'const' variables are hoisted but not initialized

function myName() {
    console.log("Pappu Kumar"); // Function declarations are hoisted
}

var myCity = () => {
    console.log("Mirzapur"); // Function expressions are not hoisted as functions
}`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>Key Points about Hoisting</h3>
        <ul>
          <li>var: Hoisted and initialized with 'undefined'.</li>
          <li>let: Hoisted but not initialized, leading to a ReferenceError if accessed before declaration.</li>
          <li>const: Similar to 'let'; hoisted but not initialized, causing a ReferenceError.</li>
          <li>Function Declarations: Hoisted completely, allowing them to be called before their declaration.</li>
          <li>Function Expressions: Only the variable is hoisted, not the function, leading to 'undefined' until the assignment.</li>
        </ul>
      </div>
    </div>
  );
}

export default Hoisting;
