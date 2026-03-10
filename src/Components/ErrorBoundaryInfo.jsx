import React from 'react';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ErrorBoundaryInfo() {
  return (
    <div className="debounce-container">
      <h1>Error Boundaries in React</h1>
      <p>
        Error Boundaries are special components in React that catch runtime errors in child components during rendering, lifecycle methods, and constructors.
        Instead of crashing the whole app, they display a fallback UI.
      </p>

      <h2>Example Code (with Explanation)</h2>

      {/* 1. Creating ErrorBoundary class component */}
      <h3>1. Create ErrorBoundary Component</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }`}
      </CodeBlock>
      <p>Explanation: We create a class component with local state divhasErrordiv to track whether an error occurred.</p>

      {/* 2. Handle error with getDerivedStateFromError */}
      <h3>2. Use getDerivedStateFromError()</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`  static getDerivedStateFromError(error) {
    return { hasError: true };
  }`}
      </CodeBlock>
      <p>Explanation: This lifecycle method is triggered when an error occurs. It updates the state to show fallback UI.</p>

      {/* 3. Log error with componentDidCatch */}
      <h3>3. Use componentDidCatch()</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`  componentDidCatch(error, info) {
    console.error("Error caught by boundary:", error);
  }`}
      </CodeBlock>
      <p>Explanation: This method logs the actual error (to console or error monitoring tool).</p>

      {/* 4. Render fallback or children */}
      <h3>4. Render Fallback or Children</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong!</h2>;
    }
    return this.props.children;
  }
}`}
      </CodeBlock>
      <p>Explanation: If error is caught, show fallback message. Otherwise, render normal children.</p>

      {/* 5. Buggy component */}
      <h3>5. Create a Component that Breaks</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`function BuggyComponent() {
  throw new Error("Oops! I crashed.");
  return <p>This will not render</p>;
}`}
      </CodeBlock>
      <p>Explanation: This component throws an error on purpose to test the Error Boundary.</p>

      {/* 6. Use it in App */}
      <h3>6. Usage in App</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`function App() {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
}`}
      </CodeBlock>
      <p>Explanation: Wrap any risky component inside div&lt;ErrorBoundary&gt;div to safely catch errors.</p>

      <h2>Final Notes</h2>
      <ul>
        <li>Only class components can be Error Boundaries.</li>
        <li>divgetDerivedStateFromErrordiv → Sets fallback UI.</li>
        <li>divcomponentDidCatchdiv → Logs error.</li>
        <li>Does NOT catch errors in event handlers or async code like fetch.</li>
      </ul>
    </div>
  );
}

export default ErrorBoundaryInfo;
