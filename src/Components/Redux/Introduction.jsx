import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to Redux</h1>
      <p className="com-text">
        Redux is a predictable state container for JavaScript apps. It helps you manage the state of your application in one place (called the store) and makes it easier to debug and test. Redux is often used with React, but it can work with any UI library.
      </p>
      <section className="method-section">
        <h2 className="method-title">Why use Redux?</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li><strong>Single source of truth:</strong> All app state lives in one store. No need to pass props through many levels.</li>
          <li><strong>Predictable updates:</strong> State only changes when you dispatch an action. You can trace every change.</li>
          <li><strong>Easy to debug:</strong> Tools like Redux DevTools let you see every action and state change over time.</li>
          <li><strong>Works with React:</strong> React-Redux provides hooks (useSelector, useDispatch) to read and update the store from components.</li>
        </ul>
      </section>
      <section className="method-section">
        <h2 className="method-title">Core ideas</h2>
        <p className="com-text">Redux has three main parts:</p>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li><strong>Store:</strong> The single object that holds the whole state tree.</li>
          <li><strong>Actions:</strong> Plain objects that describe what happened (e.g. {'{ type: "counter/increment" }'} ).</li>
          <li><strong>Reducers:</strong> Functions that take the current state and an action, and return the new state. They must be pure (no side effects).</li>
        </ul>
        <p className="com-text">Flow: You dispatch an action → the store runs it through the reducer → the store updates → components that read from the store re-render.</p>
      </section>
      <section className="method-section">
        <h2 className="method-title">Install Redux (with React)</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm install redux @reduxjs/toolkit react-redux`}
        </CodeBlock>
        <p className="com-text">Redux Toolkit is the official recommended way to write Redux. It includes the store, helpers for reducers and actions, and optional tools like RTK Query for fetching data.</p>
      </section>
    </div>
  );
}

export default ReduxIntroduction;
