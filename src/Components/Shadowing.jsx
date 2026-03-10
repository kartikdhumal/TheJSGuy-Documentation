import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Shadowing() {
  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>Variable Shadowing in JavaScript</h1>
      <p>
        Variable shadowing occurs when a variable declared within a certain scope shares the same name as a variable in an outer scope, effectively "shadowing" it.
      </p>

      <h2>Example Code:</h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`// Shadowing Example
var x = 50;

function myFunc(){
    var x = 20; // This 'x' shadows the global variable 'x'
    console.log(x); // Output: 20
}

myFunc();
console.log(x); // Output: 50`}
        </CodeBlock>
      

      <h2>Explanation:</h2>
      <ul>
        <li>
          In the example above, there is a global variable <CodeBlock language="javascript" style={atomDark}>x</CodeBlock> initialized to <CodeBlock language="javascript" style={atomDark}>50</CodeBlock>.
        </li>
        <li>
          Inside the function myFunc(), a local variable <CodeBlock language="javascript" style={atomDark}>x</CodeBlock> is declared with a value of <CodeBlock language="javascript" style={atomDark}>20</CodeBlock>, shadowing the global <CodeBlock language="javascript" style={atomDark}>x</CodeBlock>.
        </li>
        <li>
          When console.log(x) myFunc(), it logs the local <CodeBlock language="javascript" style={atomDark}>x</CodeBlock> value of <CodeBlock language="javascript" style={atomDark}>20</CodeBlock>, not the global one.
        </li>
      </ul>

      <h2>Illegal Shadowing:</h2>
      <p>
        JavaScript disallows certain types of shadowing when the variable declarations use incompatible keywords within the same scope. This results in a <CodeBlock language="javascript" style={atomDark}>SyntaxError</CodeBlock>.
      </p>

      <h3>Example 1: Illegal Shadowing with <CodeBlock language="javascript" style={atomDark}>var</CodeBlock> and <CodeBlock language="javascript" style={atomDark}>let</CodeBlock></h3>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`// var x = 50;
// let x = 20; // SyntaxError: Identifier 'x' has already been declared`}
        </CodeBlock>
      
      <p>This results in a <CodeBlock language="javascript" style={atomDark}>SyntaxError</CodeBlock> because <CodeBlock language="javascript" style={atomDark}>x</CodeBlock> is being redeclared with <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> in the same scope where it was previously declared with <CodeBlock language="javascript" style={atomDark}>var</CodeBlock>.</p>

      <h3>Example 2: Legal Shadowing with <CodeBlock language="javascript" style={atomDark}>var</CodeBlock> and <CodeBlock language="javascript" style={atomDark}>let</CodeBlock></h3>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`var y = 40;

function myFunc() {
    let y = 50; // Shadows the outer 'y' only within the function scope
    console.log(y); // Output: 50
}

myFunc();
console.log(y); // Output: 40`}
        </CodeBlock>
      
      <p>
        In this case, <CodeBlock language="javascript" style={atomDark}>y</CodeBlock> is declared using <CodeBlock language="javascript" style={atomDark}>var</CodeBlock> globally and <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> inside the function. This is valid because <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> creates a block-scoped variable that doesn't interfere with the outer <CodeBlock language="javascript" style={atomDark}>y</CodeBlock>.
      </p>

      <h2>Key Points:</h2>
      <ul>
        <li>
          Shadowing is allowed, but care must be taken to avoid illegal redeclarations (e.g., mixing <CodeBlock language="javascript" style={atomDark}>var</CodeBlock> and <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> in the same scope).
        </li>
        <li>
          Function and block-level scoping play a crucial role in how shadowing behaves.
        </li>
        <li>
          Illegal shadowing typically results in a <CodeBlock language="javascript" style={atomDark}>SyntaxError</CodeBlock>, especially when using <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> and <CodeBlock language="javascript" style={atomDark}>const</CodeBlock>.
        </li>
      </ul>
    </div>
  );
}

export default Shadowing;
