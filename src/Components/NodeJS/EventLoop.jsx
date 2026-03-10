import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function EventLoop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Event Loop & Asynchronous Programming in Node.js</h1>
      <p>
        This topic explains how Node.js can do many things at once even though it runs on a single thread. We use simple English and examples so you can see exactly what runs first and why.
      </p>

      <div className="method-section">
        <h2 className="method-title">Why do we need “async” at all?</h2>
        <p>
          Some tasks take time: reading a file from disk, waiting for a response from the internet, or waiting a few seconds. If Node.js stopped and did nothing until that task finished, your whole app would freeze. So instead, Node.js says: “Start this task, and when it’s done, run this function.” That way the rest of your code can keep running. This is called <strong>asynchronous</strong> (async) programming.
        </p>
        <p>
          <strong>In short:</strong> Async means “start something, don’t wait for it to finish right now; run other code, and when the result is ready, come back and do something with it.”
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Blocking vs non-blocking (simple idea)</h2>
        <p>
          <strong>Blocking:</strong> The program waits in place until the task is done. Nothing else runs. Like standing at a counter until your order is ready.
        </p>
        <p>
          <strong>Non-blocking:</strong> You give the task to someone (the system), get a “ticket,” and go do other things. When the task is done, you get a callback (your number is called). Node.js uses this model so one slow task doesn’t stop the whole server.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is the Event Loop?</h2>
        <p>
          The <strong>event loop</strong> is like a manager that keeps checking: “Is any task finished? If yes, run its callback. Then check again.” So Node has only one main thread doing your JavaScript, but when you start a task (like reading a file), that work is done outside the main thread. When it’s done, the event loop puts the callback in a queue, and when the main thread is free, it runs that callback.
        </p>
        <p>
          So: your code runs step by step. When you start an async operation, you pass a function (callback) that will run <em>later</em>. The event loop is what decides “later” — it runs your callback when the result is ready and when the main thread is not busy with something else.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Order of execution: what runs first?</h2>
        <p>
          Normal (synchronous) code runs first, line by line. Then things you scheduled for “later” run. But “later” has an order too: <strong>Promises (and other microtasks)</strong> run before <strong>setTimeout</strong> (and other macrotasks), even if the timer is 0 ms.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');`}
        </SyntaxHighlighter>
        <p><strong>Output:</strong> <code>1</code>, then <code>4</code>, then <code>3</code>, then <code>2</code>.</p>
        <p><strong>Why?</strong></p>
        <ul>
          <li>First, all normal code runs: so we get <code>1</code> and <code>4</code>.</li>
          <li>Then the event loop runs <strong>microtasks</strong> (like Promise callbacks): so <code>3</code> runs next.</li>
          <li>Then it runs <strong>macrotasks</strong> (like setTimeout): so <code>2</code> runs last.</li>
        </ul>
        <p>So: sync code → microtasks (Promises) → macrotasks (setTimeout, setInterval, I/O).</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Event loop phases (in simple words)</h2>
        <p>
          The event loop goes through a few stages again and again. You don’t have to memorize them, but it helps to know the idea:
        </p>
        <ul>
          <li><strong>Timers:</strong> Run callbacks for <code>setTimeout</code> and <code>setInterval</code> whose time is up.</li>
          <li><strong>Pending callbacks:</strong> Run some system callbacks that were delayed.</li>
          <li><strong>Poll:</strong> Wait for new I/O events (e.g. file read done, network response received); run their callbacks if any.</li>
          <li><strong>Check:</strong> Run <code>setImmediate()</code> callbacks.</li>
          <li><strong>Close:</strong> Run callbacks for closed connections (e.g. socket closed).</li>
        </ul>
        <p>
          After each phase, it runs all <strong>microtasks</strong> (Promise callbacks, etc.) before moving to the next phase. So microtasks get a chance to run very soon after the current piece of JavaScript finishes.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">process.nextTick() vs setImmediate()</h2>
        <p>
          Both run your function “later,” but at different times.
        </p>
        <p>
          <strong>process.nextTick(callback):</strong> Runs <em>as soon as possible</em>, before the event loop moves to the next phase. It runs even before Promises. Use it when you need to run something after the current code finishes but before anything else (e.g. before the next I/O or timer). Don’t use too many or the event loop can’t do I/O and timers on time.
        </p>
        <p>
          <strong>setImmediate(callback):</strong> Runs in the “check” phase of the event loop, after I/O and timers. So it runs after the current code and after microtasks, but in the same round as other “check” callbacks.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`console.log('Start');

process.nextTick(() => console.log('nextTick'));

setImmediate(() => console.log('setImmediate'));

Promise.resolve().then(() => console.log('Promise'));

console.log('End');`}
        </SyntaxHighlighter>
        <p><strong>Output:</strong> <code>Start</code>, <code>End</code>, <code>nextTick</code>, <code>Promise</code>, <code>setImmediate</code>.</p>
        <p>So: sync code first, then nextTick, then other microtasks (Promise), then setImmediate.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Three ways to write async code</h2>
        <p>
          You can do the same “read a file, then print it” in three styles: callbacks, Promises, or async/await. All use the same event loop; they just look different.
        </p>

        <h3>1. Callbacks (old style)</h3>
        <p>You pass a function that runs when the task is done. First argument is often an error (if any), second is the result.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs');

fs.readFile('notes.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('File content:', data);
});

console.log('This runs first, before the file is read');`}
        </SyntaxHighlighter>
        <p>So: “Read the file; when done, run this function. Until then, run the next line.” So you see “This runs first…” and then, when the file is read, “File content: …”.</p>

        <h3>2. Promises</h3>
        <p>Same idea, but you use <code>.then()</code> for success and <code>.catch()</code> for errors. Easier to chain many steps.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs').promises;

fs.readFile('notes.txt', 'utf8')
  .then((data) => {
    console.log('File content:', data);
  })
  .catch((err) => {
    console.error('Error:', err);
  });

console.log('This runs first');`}
        </SyntaxHighlighter>

        <h3>3. Async/await (easiest to read)</h3>
        <p>You write code that looks like normal “wait for this, then do that,” but it doesn’t block the rest of the app. Node runs other code while waiting.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs').promises;

async function showFile() {
  try {
    const data = await fs.readFile('notes.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

showFile();
console.log('This runs first');`}
        </SyntaxHighlighter>
        <p>Here too, “This runs first” appears before the file content, because <code>await</code> only pauses the <code>showFile</code> function, not the whole program. The event loop keeps running other code.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Real-world example: do two things one after the other</h2>
        <p>
          Say you want to read two files and then combine their contents. With async/await it stays readable:
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs').promises;

async function mergeTwoFiles() {
  try {
    const first = await fs.readFile('first.txt', 'utf8');
    const second = await fs.readFile('second.txt', 'utf8');
    console.log('First:', first);
    console.log('Second:', second);
    console.log('Merged:', first + second);
  } catch (err) {
    console.error('Something went wrong:', err.message);
  }
}

mergeTwoFiles();`}
        </SyntaxHighlighter>
        <p>Node reads the first file, then the second (or in parallel if you use <code>Promise.all</code>), and only when both are done it runs the rest. Meanwhile the event loop can handle other requests. That’s the power of async: many tasks in progress, one thread, no blocking.</p>
      </div>

      <div className="method-section">
        <h2 className="method-title">Summary</h2>
        <ul>
          <li>Async means “start a task, run other code, and when the result is ready run a callback.”</li>
          <li>The <strong>event loop</strong> decides when to run those callbacks so one thread can handle many tasks.</li>
          <li>Order: sync code runs first, then microtasks (Promises), then macrotasks (setTimeout, I/O callbacks, setImmediate).</li>
          <li><code>process.nextTick</code> runs before the next event loop phase; <code>setImmediate</code> runs in the “check” phase.</li>
          <li>You can use callbacks, Promises, or async/await; async/await is usually the easiest to read and maintain.</li>
        </ul>
      </div>
    </div>
  );
}

export default EventLoop;
