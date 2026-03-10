import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReduxRTKQuery() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">RTK Query</h1>
      <p className="com-text">
        RTK Query is a powerful data fetching and caching tool that comes with Redux Toolkit. It lets you define API endpoints, and it automatically handles loading states, caching, refetching, and updating the Redux store. You use it when you need to fetch data from a REST or GraphQL API and want less boilerplate than writing thunks and reducers by hand.
      </p>
      <section className="method-section">
        <h2 className="method-title">Basic idea</h2>
        <p className="com-text">You create an API slice with createApi and define endpoints (queries for reading data, mutations for changing data). RTK Query generates hooks you can use in components. It caches results so the same request is not sent again unless the cache is invalidated or the data is stale.</p>
      </section>
      <section className="method-section">
        <h2 className="method-title">Define an API slice</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (id) => \`users/\${id}\`,
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useAddUserMutation } = api;`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Use in a component</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function UserList() {
  const { data, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: \${error.message}</p>;
  return (
    <ul>
      {data?.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}`}
        </SyntaxHighlighter>
      </section>
      <section className="method-section">
        <h2 className="method-title">Features</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li>Automatic loading, success, and error states.</li>
          <li>Caching and deduplication of requests.</li>
          <li>Refetch on focus or after a timeout (configurable).</li>
          <li>Tag-based cache invalidation (e.g. when a mutation runs, invalidate a list query).</li>
        </ul>
      </section>
    </div>
  );
}

export default ReduxRTKQuery;
