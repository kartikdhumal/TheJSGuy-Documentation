import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxStore() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redux Store</h1>
      <p className="com-text">
        The store is the object that holds the entire state of your app. There is only one store. You create it once, usually at app startup, and then you read from it (getState), dispatch actions to it (dispatch), and subscribe to changes (subscribe).
      </p>
      <section className="method-section">
        <h2 className="method-title">Creating the store (Redux Toolkit)</h2>
        <p className="com-text">With Redux Toolkit you use configureStore. You pass it an object where each key is a slice name and the value is that slice's reducer.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});

export default store;`}
        </CodeBlock>
      </section>
      <section className="method-section">
        <h2 className="method-title">Store methods</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li><strong>getState():</strong> Returns the current state tree. Used to read state (e.g. in selectors or components).</li>
          <li><strong>dispatch(action):</strong> Sends an action to the store. The store runs the action through the reducers and updates state.</li>
          <li><strong>subscribe(listener):</strong> Runs the listener function whenever the state changes. In React you usually use the useSelector hook instead of subscribing by hand.</li>
        </ul>
      </section>
      <section className="method-section">
        <h2 className="method-title">One store only</h2>
        <p className="com-text">Redux uses a single store. If you need to split logic, you split reducers and combine them (configureStore does this for you). You do not create multiple stores for different parts of the app.</p>
      </section>
    </div>
  );
}

export default ReduxStore;
