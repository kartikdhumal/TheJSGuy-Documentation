import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Promises() {
  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>Promises in JavaScript</h1>
      <p>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</p>

      <h2>Promise Constructor</h2>
      <p>
        The promise constructor takes only one argument, which is a callback function.
        The callback function takes two arguments: resolve and reject.
      </p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`const promise = new Promise((resolve, reject) => {
  // Perform operations
  if (success) {
    resolve('Success!');
  } else {
    reject('Failure!');
  }
});`}
        </CodeBlock>
      

      <h2>Promise States</h2>
      <ul>
        <li>Fulfilled: Action related to the promise succeeded</li>
        <li>Rejected: Action related to the promise failed</li>
        <li>Pending: Promise is still pending (not fulfilled or rejected)</li>
      </ul>

      <h2>Promise Methods</h2>

      <h3>1. Promise.all()</h3>
      <p>
        Definition: Promise.all() takes an iterable of promises and returns a single promise that resolves when all of the promises in the iterable have resolved, or rejects if any of the promises reject.
      </p>
      <h2>
        If all true then resolves with an array of resolved values else will return first rejected promise
      </h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`Promise.all([promise1,promise2,promise3])
  .then(values => {
    // All promises resolved
  })
  .catch(error => {
    // At least one promise rejected
  });`}
        </CodeBlock>
      

      <h3>2. Promise.race()</h3>
      <p>
        Definition: Promise.race() returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.
      </p>
      <h2>
        It always resolves with an array of objects that each describe the outcome of each promise.
      </h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`Promise.race([promise1,promise2,promise3])
  .then(value => {
    // First resolved or rejected promise
  })
  .catch(error => {
    // First rejected promise
  });`}
        </CodeBlock>
      

      <h3>3. Promise.allSettled()</h3>
      <p>
        Definition: Promise.allSettled() returns a promise that resolves after all of the given promises have either resolved or rejected. It provides an array of objects describing the outcome of each promise.
      </p>
      <h2>
        It will return the first promise no matter it is resolved or rejected
      </h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`Promise.allSettled([promise1,promise2,promise3])
  .then(results => {
    // Array of outcome objects
  });`}
        </CodeBlock>
      

      <h3>4. Promise.any()</h3>
      <p>
        Definition: Promise.any() returns a promise that resolves as soon as any of the given promises fulfill. If no promises fulfill, it rejects with an AggregateError, grouping all rejection reasons.
      </p>
      <h2>
        with the value from that promise. If none of the promises resolve, it rejects with an AggregateError containing all the rejection reasons.
      </h2>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`Promise.any([promise1,promise2,promise3])
  .then(value => {
    // First resolved promise
  })
  .catch(errors => {
    // All promises rejected
  });`}
        </CodeBlock>
      
    </div>
  );
}

export default Promises;
