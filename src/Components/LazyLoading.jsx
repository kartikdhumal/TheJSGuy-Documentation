import React from 'react';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LazyLoading() {
  return (
    <div className="debounce-container">
      <h1>Lazy Loading in React</h1>

      <h2>Introduction</h2>
      <p>
        Lazy loading, also known as code splitting or chunking, is a performance optimization technique that delays the loading of resources until they are actually needed. In React, it helps break the app into smaller pieces or chunks, which can be loaded on demand. This significantly reduces the initial bundle size and speeds up the first load of the application.
      </p>

      <h2>Why Use Lazy Loading?</h2>
      <p>
        Lazy loading improves performance by reducing the initial JavaScript bundle size. It provides a better user experience by loading parts of the application only when necessary, which results in quicker initial render times. It also helps in utilizing resources efficiently by loading only what is needed at a given moment, saving memory and bandwidth.
      </p>

      <h2>How Lazy Loading Works in React</h2>
      <p>
        React offers built-in support for lazy loading using the React.lazy function along with the Suspense component. React.lazy is used to dynamically import a component only when it's needed. Suspense is used to show a fallback (like a loader or text) while the lazy-loaded component is being fetched.
      </p>

      <h3>Steps to Implement Lazy Loading</h3>
      <p>
        First, use React.lazy to dynamically import the component you want to lazy load. Then, wrap the component inside Suspense and provide a fallback UI. This fallback will be displayed until the component finishes loading.
      </p>

      <h2>Example</h2>
      <p>Below is a simple example showing how to implement lazy loading in a React application:</p>

      <CodeBlock language="javascript" style={atomDark}>
{`import React, { Suspense, lazy } from 'react';

// Lazy load the component
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div className="App">
      <h1>React Lazy Loading Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;`}
      </CodeBlock>

      <h2>Conclusion</h2>
      <p>
        Lazy loading is a powerful technique in React to improve performance, reduce load time, and create a smoother user experience by loading components only when needed. It's especially useful in large applications where performance matters.
      </p>
    </div>
  );
}

export default LazyLoading;