import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxReact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redux with React</h1>
      <p className="com-text">
        To use Redux in a React app you use the react-redux library. It gives you a Provider component that makes the store available to the tree, and hooks like useSelector (to read state) and useDispatch (to dispatch actions). You wrap your app with Provider once, then use the hooks in any component that needs the store.
      </p>
      <section className="method-section">
        <h2 className="method-title">Provider</h2>
        <p className="com-text">Wrap your app (or the part that needs Redux) with Provider and pass the store as a prop. Every component inside can then use useSelector and useDispatch.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">useSelector</h2>
        <p className="com-text">useSelector takes a selector function. It returns the value from the store that the selector returns. The component re-renders when that value changes (compared by reference, so avoid returning a new object/array every time if you want to avoid extra re-renders).</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  return <span>{count}</span>;
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">useDispatch</h2>
        <p className="com-text">useDispatch returns the store's dispatch function. You call it with an action (or the result of an action creator) to update the store.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { useDispatch, useSelector } from 'react-redux';
import { increment } from './counterSlice';

function CounterButtons() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
    </div>
  );
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Full example</h2>
        <p className="com-text">Store is created with configureStore, app is wrapped in Provider, and components use useSelector and useDispatch to read and update state. No need to pass the store down by hand.</p>
      </section>
    </div>
  );
}

export default ReduxReact;
