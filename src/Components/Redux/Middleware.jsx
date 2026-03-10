import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxMiddleware() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Redux Middleware</h1>
      <p className="com-text">
        Middleware in Redux is code that runs after you dispatch an action but before it reaches the reducers. It can log actions, delay or block them, or dispatch extra actions. The most common use is for async logic: for example, redux-thunk lets you dispatch a function that can run async code and then dispatch real actions when done.
      </p>
      <section className="method-section">
        <h2 className="method-title">How middleware fits in</h2>
        <p className="com-text">When you call dispatch(action), the action goes through each middleware in order. A middleware can pass the action to the next middleware, dispatch a different action, or not call next at all. Redux Toolkit's configureStore adds the thunk middleware by default, so you can dispatch functions (thunks) for async work.</p>
      </section>
      <section className="method-section">
        <h2 className="method-title">Thunks</h2>
        <p className="com-text">A thunk is a function that returns another function. The inner function receives dispatch and getState. You use it to run async code and then dispatch actions with the result.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { createAsyncThunk } from '@reduxjs/toolkit';

// With createAsyncThunk (recommended)
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) return rejectWithValue('Failed to fetch');
    return res.json();
  }
);

// In a slice, handle the extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => { state.loading = true; })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(fetchUser.rejected, (state) => { state.loading = false; });
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Other middleware</h2>
        <p className="com-text">redux-logger logs every action and state. redux-saga uses generators for more complex async flows. For most apps, thunks (or RTK Query) are enough. configureStore already includes the thunk middleware.</p>
      </section>
    </div>
  );
}

export default ReduxMiddleware;
