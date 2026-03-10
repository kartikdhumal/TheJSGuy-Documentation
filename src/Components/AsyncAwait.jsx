import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AsyncAwait() {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);
    return (
        <div className="debounce-container">
            <h1 className="title">Async/Await Documentation</h1>

            <section className="method-section">
                <h2 className="method-title">1. Async Functions</h2>
                <p>
                    Async functions always return a promise. The await keyword is used only in async functions to wait for a promise.
                    Async functions will always return a value, wrapping it in a promise if necessary.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`async function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Sabse pehle me aaya");
      resolve();
    }, 3000);
  });
}`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">2. Await</h2>
                <p>
                    The await keyword pauses the execution of the async function until the promise is resolved.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`async function run() {
  await getData();
  getData2();
}

run();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">3. Error Handling</h2>
                <p>
                    Async functions can use try/catch blocks to handle errors in a more synchronous style.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`async function getDataWithError() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Something went wrong!");
    }, 3000);
  });
}

async function runWithErrorHandling() {
  try {
    await getDataWithError();
    console.log("This will not be printed");
  } catch (error) {
    console.log("Error caught: " + error);
  }
}

runWithErrorHandling();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">4. Chaining Async Functions</h2>
                <p>
                    You can chain multiple async functions to run one after another.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`async function runChained() {
  await getData();
  await getData3();
  getData2();
}

runChained();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">5. Parallel Execution</h2>
                <p>
                    To run async functions in parallel, you can use Promise.all.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`async function runParallel() {
  await Promise.all([getDataParallel1(), getDataParallel2()]);
  console.log("Both parallel functions have completed");
}

runParallel();`}
                    </CodeBlock>
                
            </section>
        </div>
    );
}

export default AsyncAwait;
