import React, { useEffect } from 'react';
import '../styles/debouncing.css'

import 'prismjs/themes/prism.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Callback() {
  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Callback Functions</h1>
      
      <section className="method-section">
        <h2 className="method-title">What is a Callback Function?</h2>
        <p>
          A callback is a function that is passed as an argument to another function, 
          and is called after the main function has finished its execution.
        </p>
<CodeBlock language="javascript" style={atomDark}>
{`function mainFunction(callback) {
    console.log("Performing operation...");
    // Use setTimeout to simulate an asynchronous operation
    setTimeout(function () {
        callback("Operation complete");
    }, 1000);
}

// Define the callback function
function callbackFunction(result) {
    console.log("Result: " + result);
}

// Call the main function with the callback function
mainFunction(callbackFunction);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Why Use Callbacks?</h2>
        <p>
          Callbacks are used to handle asynchronous operations or to ensure certain code executes only after a specific task is complete.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Issues with Callbacks</h2>
        <h3>1. Callback Hell</h3>
        <p>
          Callback hell refers to the situation where callback functions are nested within one another excessively, leading to code that is difficult to read, understand, and maintain.
        </p>
<CodeBlock language="javascript" style={atomDark}>
{`asyncFunction1(() => {
    asyncFunction2(() => {
        asyncFunction3(() => {
            // More nested callbacks
        });
    });
});`}
        </CodeBlock>

        <h3>2. Inversion Of Control</h3>
        <p>
          Inversion of Control (IoC) is a design principle where the control of flow is inverted from the caller to the callee, often facilitated through callbacks or event-driven programming. 
          In IoC, the callee controls when certain methods or functions are executed, which can lead to better modularity and decoupling in software systems.
        </p>
<CodeBlock language="javascript" style={atomDark}>
{`function fetchData(callback) {
    // Simulating asynchronous operation
    setTimeout(() => {
        const data = { name: "John", age: 30 };
        callback(data);
    }, 1000);
}

function processData(data) {
    console.log("Processing data:", data);
}

fetchData(processData);`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default Callback;
