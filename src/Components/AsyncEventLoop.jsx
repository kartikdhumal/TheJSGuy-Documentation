import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AsyncEventLoop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="debounce-container">
      <h1 className="title">Asynchronous JavaScript & Event Loop</h1>

      <section className="method-section">
        <h2 className="method-title">Asynchronous JavaScript</h2>
        <p>
          Asynchronous JavaScript is a programming approach that enables the non-blocking execution of tasks, allowing
          concurrent operations, improved responsiveness, and efficient handling of time-consuming operations in web
          applications. JavaScript is a single-threaded and synchronous language. The code is executed in order one at
          a time, but JavaScript may appear to be asynchronous in some situations.
        </p>
      </section>

      <section className="method-section">
        <p>
          When we say that JavaScript is single-threaded, it means that JavaScript executes code one line at a time, in a sequence. The main thread, where all JavaScript code runs, can only do one task at a time, and there is no way to run multiple pieces of code in parallel on this thread. This might sound limiting, but JavaScript’s design is well-suited for handling many tasks efficiently, thanks to the event loop.
        </p>
        <h2 className="method-title">Event Loop</h2>
        <p>
          The event loop is a fundamental concept in JavaScript that enables asynchronous programming.
          It is responsible for handling and executing code, collecting and processing events, and executing queued sub-tasks.
          Here’s a step-by-step explanation of how the event loop works:
        </p>

        <h3>STEP 1: Call Stack</h3>
        <p>
          Description: The call stack is a LIFO (Last In, First Out) data structure that keeps track of function calls.<br />
          Operation: When a function is called, it is pushed onto the call stack. When the function execution is complete, it is popped off the stack.
        </p>

        <h3>STEP 2: Callback Queue</h3>
        <p>
          Description: Also known as the task queue, it is a queue that holds callback functions waiting to be executed.<br />
          Operation: Once the Web API completes an asynchronous operation, it pushes the corresponding callback to the callback queue.
        </p>

        <h3>STEP 3: Event Loop</h3>
        <p>
          Description: The event loop is a process that continuously checks the call stack and the callback queue.<br />
          Operation:
          <ul>
            <li>The event loop checks if the call stack is empty.</li>
            <li>If the call stack is empty, the event loop takes the first callback from the callback queue and pushes it onto the call stack for execution.</li>
            <li>This process repeats, ensuring the single-threaded JavaScript environment can handle asynchronous operations without blocking.</li>
          </ul>
        </p>

        <h3>STEP 4: Execution</h3>
        <p>
          Description: The function at the top of the call stack is executed. During this execution, if the function contains any asynchronous code, it may initiate further asynchronous operations.
        </p>
        <p>
          Operation:
          <ul>
            <li>The currently executing function is processed until it completes.</li>
            <li>If there are any asynchronous tasks (like setTimeout, Promises, etc.), they may be initiated within this function.</li>
            <li>Once the function finishes executing, control returns to the event loop to check the call stack and the callback queue.</li>
          </ul>
        </p>

        <h3>STEP 5: Callback Execution</h3>
        <p>
          Description: Once an asynchronous operation is completed, its callback function is placed in the callback queue, waiting to be executed.
        </p>
        <p>
          Operation:
          <ul>
            <li>The asynchronous operation signals that it has completed (e.g., data is fetched, a timer ends).</li>
            <li>The associated callback function is then moved to the callback queue.</li>
            <li>This callback waits until the call stack is empty before it can be executed.</li>
          </ul>
        </p>

        <h3>STEP 6: Repeat</h3>
        <p>
          Description: The event loop continuously checks the status of the call stack and the callback queue, repeating the process to manage function execution.
        </p>
        <p>
          Operation:
          <ul>
            <li>The event loop checks if the call stack is empty.</li>
            <li>If the call stack is empty, the event loop takes the first callback from the callback queue and pushes it onto the call stack for execution.</li>
            <li>This cycle continues, allowing JavaScript to efficiently handle multiple asynchronous operations without blocking the main execution thread.</li>
          </ul>
        </p>


        <h3>Example</h3>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`console.log("Start");

setTimeout(() => {
    console.log("Timeout callback");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise callback");
});

console.log("End");
//Start
//End
//Promise callback
//Timeout callback
`}
          </CodeBlock>
        

        <h3>Step-by-Step Execution:</h3>
        <ul>
          <li>"Start" is logged immediately (synchronous).</li>
          <li>`setTimeout` is called with a delay of `0`. The callback is sent to the Web API and will be placed in the callback queue after the delay.</li>
          <li>`Promise.resolve().then` is called. The callback is placed in the microtask queue.</li>
          <li>"End" is logged immediately (synchronous).</li>
          <li>The call stack is now empty, so the event loop checks the microtask queue first.</li>
          <li>"Promise callback" is logged from the microtask queue.</li>
          <li>The event loop then checks the callback queue.</li>
          <li>"Timeout callback" is logged from the callback queue.</li>
        </ul>

        <h3>Summary</h3>
        <ul>
          <li>Call Stack: Manages function calls and execution order.</li>
          <li>Web APIs: Handle asynchronous operations.</li>
          <li>Callback Queue: Stores callbacks from asynchronous operations.</li>
          <li>Event Loop: Manages execution order between the call stack and callback queue.</li>
          <li>Microtask Queue: Handles promise callbacks and other microtasks with higher priority than the callback queue.</li>
        </ul>

        <p>
          Understanding the event loop is crucial for mastering asynchronous JavaScript and ensuring efficient and non-blocking code execution.
        </p>
      </section>
    </div>
  );
}

export default AsyncEventLoop;
