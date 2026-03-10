import React, { useEffect } from 'react';
import '../../styles/debouncing.css';

function ReduxQuestions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const qa = [
    {
      q: 'What is Redux and why use it?',
      a: 'Redux is a predictable state container for JavaScript apps. It keeps the whole app state in one place (the store), so you can manage and debug it easily. You use it when many components need to share state or when state updates are complex.',
    },
    {
      q: 'What is the Redux store?',
      a: 'The store is the single object that holds the entire state tree. You create it once with configureStore (or createStore). You read state with getState(), update it by dispatching actions with dispatch(), and optionally listen to changes with subscribe().',
    },
    {
      q: 'What are actions and reducers?',
      a: 'Actions are plain objects with a type (and optional payload) that describe what happened. Reducers are pure functions that take the current state and an action and return the new state. You never mutate state in a reducer; you return a new object.',
    },
    {
      q: 'What is Redux Toolkit (RTK)?',
      a: 'Redux Toolkit is the official recommended way to write Redux. It provides configureStore, createSlice, createAsyncThunk, and more. It reduces boilerplate and uses Immer so you can write simpler reducer logic. It also includes RTK Query for data fetching.',
    },
    {
      q: 'What is RTK Query?',
      a: 'RTK Query is a tool in Redux Toolkit for fetching and caching data. You define API endpoints with createApi and get hooks like useGetUsersQuery. It handles loading states, caching, and cache invalidation so you write less code for API calls.',
    },
    {
      q: 'What is middleware in Redux?',
      a: 'Middleware runs after you dispatch an action and before it reaches the reducers. It can log, delay, or transform actions. The most common use is for async logic: the thunk middleware lets you dispatch a function that can do async work and then dispatch actions.',
    },
    {
      q: 'What are selectors?',
      a: 'Selectors are functions that take the Redux state and return a part of it or a derived value. They keep reading logic in one place. In React you pass a selector to useSelector(selector). Memoized selectors (e.g. createSelector) help avoid unnecessary re-renders.',
    },
    {
      q: 'How do you use Redux in React?',
      a: 'You wrap the app with Provider and pass the store. Then in components you use useSelector(selector) to read state and useDispatch() to get the dispatch function and send actions. You do not pass the store down as props.',
    },
    {
      q: 'What is the difference between Redux and React Context?',
      a: 'Both can share state. Redux gives you a single store, predictable updates with reducers, DevTools, middleware, and patterns like RTK Query. Context is built into React and is simpler but can cause more re-renders and does not have built-in async or caching. Use Redux when state and updates are complex or shared across many components.',
    },
  ];

  return (
    <div className="debounce-container">
      <h1 className="title">Redux Questions</h1>
      <p className="com-text">Common questions and answers about Redux, in simple English.</p>
      {qa.map((item, index) => (
        <div key={index} className="faq-item">
          <h4 className="faq-question">{index + 1}. {item.q}</h4>
          <p className="faq-answer">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

export default ReduxQuestions;
