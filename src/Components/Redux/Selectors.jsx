import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxSelectors() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Selectors</h1>
      <p className="com-text">
        A selector is a function that takes the Redux state and returns a piece of it (or a derived value). Selectors help you keep reading logic in one place. When you use useSelector(selector) in React, the component re-renders only when the value returned by the selector changes. Good selectors make your components simpler and can improve performance.
      </p>
      <section className="method-section">
        <h2 className="method-title">Simple selectors</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Read a slice
const selectCounter = (state) => state.counter;

// Read a field
const selectCount = (state) => state.counter.value;

// Derived data
const selectDoubleCount = (state) => state.counter.value * 2;`}
        </CodeBlock>
      </section>
      <section className="method-section">
        <h2 className="method-title">Using selectors in React</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const double = useSelector((state) => state.counter.value * 2);
  return <p>{count} (double: {double})</p>;
}`}
        </CodeBlock>
      </section>
      <section className="method-section">
        <h2 className="method-title">Reselect (memoized selectors)</h2>
        <p className="com-text">When a selector does expensive work or returns a new object/array every time, the component may re-render even when the underlying data did not change. createSelector from Reselect (or from RTK) memoizes the result: it recomputes only when the inputs change. RTK re-exports createSelector.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { createSelector } from '@reduxjs/toolkit';

const selectUsers = (state) => state.users.list;
const selectFilter = (state) => state.users.filter;

export const selectFilteredUsers = createSelector(
  [selectUsers, selectFilter],
  (users, filter) => users.filter((u) => u.name.includes(filter))
);
// use: useSelector(selectFilteredUsers)`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default ReduxSelectors;
