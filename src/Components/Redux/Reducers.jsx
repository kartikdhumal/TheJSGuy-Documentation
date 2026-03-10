import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxReducers() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Reducers</h1>
      <p className="com-text">
        A reducer is a function that takes the current state and an action, and returns the new state. It must be pure: same inputs always give the same output, and it should not mutate the state, make API calls, or do other side effects. Reducers describe how state changes in response to actions.
      </p>
      <section className="method-section">
        <h2 className="method-title">Reducer signature</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function myReducer(state, action) {
  // state: current state for this slice
  // action: { type: '...', payload?: ... }
  switch (action.type) {
    case 'counter/increment':
      return { ...state, count: state.count + 1 };
    case 'counter/decrement':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Rules for reducers</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li>Return the same state if the action is not relevant (often in the default case).</li>
          <li>Do not mutate state. Return a new object (e.g. spread {`...state`}) with the updated fields.</li>
          <li>No side effects inside the reducer (no fetch, no setTimeout). Do those in middleware or outside (e.g. in a thunk or RTK Query).</li>
        </ul>
      </section>
      <section className="method-section">
        <h2 className="method-title">Redux Toolkit: createSlice</h2>
        <p className="com-text">With createSlice you write "mutating" logic inside reducers because Immer is used under the hood. You still never mutate state outside of createSlice. The slice generates the reducer and action creators for you.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;  // OK inside createSlice (Immer)
    },
    addBy: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, addBy } = counterSlice.actions;
export default counterSlice.reducer;`}
        </SyntaxHighlighter>
      </section>
    </div>
  );
}

export default ReduxReducers;
