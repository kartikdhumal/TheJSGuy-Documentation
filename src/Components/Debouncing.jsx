import React from 'react';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DebounceExample from './DebounceExample';
import ThrottleExample from './ThrottleExample';
import '../styles/debouncing.css';

function Debouncing() {
  return (
    <div className="debounce-container">
      <h1>Debouncing & Throttling in JavaScript</h1>

      <section className="example-section">
        <h2>What is Debouncing?</h2>
        <p>
          Debouncing is a technique to limit the rate at which a function gets called.
          It delays the execution until a certain time has passed since the last trigger.
          Common use-case: search input or autocomplete.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import React, { useRef } from 'react';

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const handleDebouncedSearch = debounce((value) => {
  console.log('Value :', value);
}, 500);

<input onChange={(e) => handleDebouncedSearch(e.target.value)} />`}
        </CodeBlock>

      </section>

      <DebounceExample />

      <section className="example-section">
        <h2>Debouncing by Package (Using Lodash)</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install lodash`}
        </CodeBlock>

        <h2>Lodash Debouncing Example</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { debounce } from 'lodash';

const debouncedFunction = debounce((value) => {
  console.log('API Call with:', value);
}, 500);

<input onChange={(e) => debouncedFunction(e.target.value)} />`}
        </CodeBlock>
      </section>


      <section className="example-section">
        <h2>What is Throttling?</h2>
        <p>
          Throttling ensures a function is only called once every X milliseconds,
          even if it's triggered multiple times.
          Common use-case: Prevent users from sending OTP again and again by clicking the button rapidly.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const [message, setMessage] = useState('');
const lastClickTimeRef = useRef(0);

const handleClick = () => {
  const now = Date.now();
  const throttleDelay = 3000;

  if (now - lastClickTimeRef.current >= throttleDelay) {
    lastClickTimeRef.current = now;

    setMessage('Sending API request...');

    setTimeout(() => {
      setMessage('API response received at: ' + new Date().toLocaleTimeString());
    }, 1000); // Simulated API delay
  } else {
    setMessage('Throttled! Wait for 3 seconds.');
  }
};`}
        </CodeBlock>

      </section>

      <ThrottleExample />

      <section className="example-section">
        <h2>Throttling by Package (Using Lodash)</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install lodash`}
        </CodeBlock>

        <h2>Lodash Throttle Example</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { throttle } from 'lodash';

const throttledFunction = throttle(() => {
  console.log('Throttled API call at:', new Date().toLocaleTimeString());
}, 2000);

window.addEventListener('resize', throttledFunction);`}
        </CodeBlock>
      </section>

    </div>
  );
}

export default Debouncing;
