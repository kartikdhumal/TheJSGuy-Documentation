import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ScopeChain() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>Scope Chain in JavaScript</h1>
      <p>
        The scope chain in JavaScript determines the accessibility of variables and functions within a particular context.
      </p>

      <h2>Example Code:</h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`// Logging the value of variable 'a'
console.log(a);

// Defining a function named 'sum'
function sum() {
    // Within the function 'sum', logging the sum of variables 'a' and 'b'
    console.log(a + b);
}

// Declaring variables 'a' and 'b' and assigning them values
var a = 10;
var b = 20;

// Calling the function 'sum'
sum();`}
        </CodeBlock>
      

      <h2>Explanation:</h2>
      <ol>
        <li>
          Variable Declaration and Initialization:
          <ul>
            <li>Variables 'a' and 'b' are declared using the 'var' keyword and initialized with values.</li>
            <li>'a' is assigned the value 10, and 'b' is assigned the value 20.</li>
          </ul>
        </li>
        <li>
          Function Declaration:
          <ul>
            <li>The function 'sum' is declared using the function declaration syntax.</li>
            <li>Within the function body, the sum of variables 'a' and 'b' is logged to the console.</li>
          </ul>
        </li>
        <li>
          Logging 'a':
          <ul>
            <li>Before the function 'sum' is called, the value of variable 'a' is logged to the console.</li>
            <li>At this point, 'a' has been declared but not yet initialized with a value, so it logs 'undefined'.</li>
          </ul>
        </li>
        <li>
          Function Call:
          <ul>
            <li>The function 'sum' is called.</li>
            <li>Within the function, the sum of 'a' and 'b' is computed and logged to the console.</li>
            <li>Since 'a' is now initialized with the value 10 and 'b' with the value 20, the sum is 30.</li>
          </ul>
        </li>
      </ol>

      <h2>Result:</h2>
      <p>
        The output of the code will be:
      </p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`undefined
30`}
        </CodeBlock>
      

      <h2>Conclusion:</h2>
      <p>
        JavaScript's hoisting mechanism allows functions and variable declarations to be hoisted to the top of their containing scope.
        Even though 'a' is logged before its declaration and initialization, it doesn't cause an error due to hoisting.
        However, it logs 'undefined' since it's accessed before it's assigned a value.
        The function 'sum' can access both 'a' and 'b' even though they are declared after the function since they are hoisted to the top of the scope.
      </p>
    </div>
  );
}

export default ScopeChain;
