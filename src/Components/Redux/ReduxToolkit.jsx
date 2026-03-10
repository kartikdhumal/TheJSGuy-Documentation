import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxToolkit() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redux Toolkit (RTK)</h1>
      <p className="com-text">
        Redux Toolkit is the official recommended way to write Redux. It includes utilities that reduce boilerplate and help you follow best practices. You get configureStore, createSlice, createAsyncThunk, and more, so you write less code and avoid common mistakes.
      </p>
      <section className="method-section">
        <h2 className="method-title">What RTK includes</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li><strong>configureStore:</strong> Creates the store with good defaults (e.g. Redux DevTools, thunk middleware).</li>
          <li><strong>createSlice:</strong> Lets you define reducers and initial state in one place; generates actions and the reducer. Uses Immer so you can write "mutating" updates.</li>
          <li><strong>createAsyncThunk:</strong> Helps you handle async logic (e.g. API calls) and dispatch pending/fulfilled/rejected actions.</li>
          <li><strong>Other:</strong> createEntityAdapter for normalized data, Immer for immutable updates, and sensible defaults.</li>
        </ul>
      </section>
      <section className="method-section">
        <h2 className="method-title">Example: configureStore + createSlice</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action) => { state.value += action.payload; },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Why use RTK?</h2>
        <p className="com-text">It reduces boilerplate (no manual action types or action creators), uses Immer so reducers are easier to write, sets up the store with good defaults, and is the approach the Redux docs recommend for new apps.</p>
      </section>
    </div>
  );
}

export default ReduxToolkit;
