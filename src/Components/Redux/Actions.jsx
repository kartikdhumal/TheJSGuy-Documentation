import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxActions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Actions & Action Creators</h1>
      <p className="com-text">
        An action is a plain JavaScript object that describes something that happened in the app. It must have a <code>type</code> property (usually a string). Any other properties (e.g. payload) are optional and carry data. You never change state inside an action; you just describe what happened.
      </p>
      <section className="method-section">
        <h2 className="method-title">Action shape</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Minimal action: only type
{ type: 'counter/increment' }

// Action with extra data (often called payload)
{ type: 'users/addUser', payload: { name: 'John', id: 1 } }

// Another common pattern
{ type: 'todos/toggle', id: 3 }`}
        </CodeBlock>
      </section>
      <section className="method-section">
        <h2 className="method-title">Action creators</h2>
        <p className="com-text">An action creator is a function that returns an action. It helps avoid typos and keeps action structure in one place. With Redux Toolkit, action creators are generated for you from createSlice.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Manual action creator
function addUser(name, id) {
  return { type: 'users/addUser', payload: { name, id } };
}
dispatch(addUser('Jane', 2));

// With Redux Toolkit createSlice, you get action creators automatically
const { addUser } = userSlice.actions;
dispatch(addUser({ name: 'Jane', id: 2 }));`}
        </CodeBlock>
      </section>
      <section className="method-section">
        <h2 className="method-title">Dispatching actions</h2>
        <p className="com-text">You send an action to the store with dispatch. The store runs all reducers with that action and updates state. In React you use the useDispatch hook to get the dispatch function.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { useDispatch } from 'react-redux';
const dispatch = useDispatch();
dispatch({ type: 'counter/increment' });`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default ReduxActions;
