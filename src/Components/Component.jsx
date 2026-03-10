import React, { useEffect } from 'react';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Component() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Components</h1>
      <p className="com-text">
        In React, a component is a reusable piece of the user interface. You can think of it as a custom building block that can receive input (props) and return what should appear on the screen (JSX). React has two main ways to write components: <strong>functional components</strong> and <strong>class components</strong>. Today, functional components with Hooks are the recommended approach.
      </p>

      {/* ========== FUNCTIONAL COMPONENTS ========== */}
      <section className="method-section">
        <h2 className="method-title">Functional Components</h2>
        <p className="com-text">
          A functional component is a plain JavaScript function that takes <code>props</code> as an argument and returns JSX (what to render). It does not use the <code>class</code> keyword or <code>this</code>. Before Hooks, functional components could not hold state or use lifecycle logic; now they can do everything class components can, using Hooks.
        </p>

        <h3 className="com-subtitle">How to Write a Functional Component</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Or with arrow function
const Welcome = (props) => <h1>Hello, {props.name}</h1>;`}
        </CodeBlock>

        <h3 className="com-subtitle">State in Functional Components (useState)</h3>
        <p className="com-text">
          Use the <code>useState</code> hook to keep local state. It returns the current value and a function to update it. Each time you call the updater, React re-renders the component with the new state.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`}
        </CodeBlock>

        <h3 className="com-subtitle">Lifecycle in Functional Components (useEffect)</h3>
        <p className="com-text">
          In class components you use lifecycle methods like <code>componentDidMount</code> and <code>componentWillUnmount</code>. In functional components you use the <code>useEffect</code> hook to run code at the right time. You can mimic mount, update, and unmount with one hook.
        </p>
        <ul className="com-list" style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
          <li><strong>Mount (after first render):</strong> Run logic in <code>useEffect</code> with an empty dependency array <code>[]</code>. This runs once when the component appears on the screen.</li>
          <li><strong>Update (when props/state change):</strong> Put the values you care about in the dependency array. The effect runs after every render where one of those values changed.</li>
          <li><strong>Unmount (cleanup when component is removed):</strong> Return a function from <code>useEffect</code>. React calls that function when the component is removed or before the effect runs again.</li>
        </ul>
        <CodeBlock language="javascript" style={atomDark}>
          {`import React, { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs after first render (like componentDidMount)
    const controller = new AbortController();
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser);

    return () => {
      // Cleanup when component unmounts (like componentWillUnmount)
      controller.abort();
    };
  }, [userId]); // Re-run when userId changes (like componentDidUpdate)

  if (!user) return <p>Loading...</p>;
  return <p>{user.name}</p>;
}`}
        </CodeBlock>

        <h3 className="com-subtitle">Pros and Cons of Functional Components</h3>
        <p className="com-text"><strong>Pros:</strong> Less code, no <code>this</code>, easier to read and test. Hooks let you reuse stateful logic without class hierarchies. React team recommends them for new code. Better tree-shaking and often slightly better performance.</p>
        <p className="com-text"><strong>Cons:</strong> You must follow the Rules of Hooks (only call Hooks at the top level, not inside loops or conditions). If you are used to classes, the mental model is different.</p>
      </section>

      {/* ========== CLASS COMPONENTS ========== */}
      <section className="method-section">
        <h2 className="method-title">Class Components</h2>
        <p className="com-text">
          A class component is an ES6 class that extends <code>React.Component</code> (or <code>React.PureComponent</code>). It must have a <code>render()</code> method that returns JSX. State is held in <code>this.state</code> and updated with <code>this.setState()</code>. Lifecycle is handled by special methods like <code>componentDidMount</code> and <code>componentWillUnmount</code>.
        </p>

        <h3 className="com-subtitle">How to Write a Class Component</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`import React from 'react';

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}`}
        </CodeBlock>

        <h3 className="com-subtitle">State in Class Components</h3>
        <p className="com-text">
          State is a single object on <code>this.state</code>, usually set in the <code>constructor</code>. You update it with <code>{'this.setState({ key: value })'}</code>. React merges the object you pass into the existing state and re-renders.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}`}
        </CodeBlock>

        <h3 className="com-subtitle">Lifecycle Methods in Class Components</h3>
        <p className="com-text">
          Class components have well-defined phases: mounting (added to the DOM), updating (re-rendered due to props/state change), and unmounting (removed from the DOM). You hook into these with lifecycle methods.
        </p>

        <div className="faq-item">
          <h4 className="faq-question">Mounting (component is being created and inserted into the DOM)</h4>
          <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
            <li><code>constructor(props)</code> – Runs first. Use it to set initial <code>this.state</code> and bind methods. Call <code>super(props)</code> before using <code>this</code>.</li>
            <li><code>static getDerivedStateFromProps(props, state)</code> – Runs before every render (including first). Use it to sync state with props. Rare; often you do not need it.</li>
            <li><code>render()</code> – Returns JSX. Must be pure (no side effects).</li>
            <li><code>componentDidMount()</code> – Runs once after the component is in the DOM. Use it for network requests, subscriptions, or DOM measurements.</li>
          </ul>
        </div>

        <div className="faq-item">
          <h4 className="faq-question">Updating (props or state changed)</h4>
          <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
            <li><code>static getDerivedStateFromProps(props, state)</code> – Same as above.</li>
            <li><code>shouldComponentUpdate(nextProps, nextState)</code> – Return <code>false</code> to skip the render (optimization). Default is <code>true</code>.</li>
            <li><code>render()</code> – Same as above.</li>
            <li><code>getSnapshotBeforeUpdate(prevProps, prevState)</code> – Runs right before the DOM is updated. Return a value that is passed to <code>componentDidUpdate</code>. Used rarely (e.g. scroll position).</li>
            <li><code>componentDidUpdate(prevProps, prevState, snapshot)</code> – Runs after the update. Use it to react to prop/state changes (e.g. refetch data when an ID changes). Be careful not to cause infinite loops with <code>setState</code>.</li>
          </ul>
        </div>

        <div className="faq-item">
          <h4 className="faq-question">Unmounting (component is being removed)</h4>
          <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
            <li><code>componentWillUnmount()</code> – Runs once before the component is removed. Use it to cancel network requests, clear timers, or remove event listeners.</li>
          </ul>
        </div>

        <h3 className="com-subtitle">Full Class Component Example with Lifecycle</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    fetch(\`/api/users/\${this.props.userId}\`)
      .then(res => res.json())
      .then(user => this.setState({ user }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      fetch(\`/api/users/\${this.props.userId}\`)
        .then(res => res.json())
        .then(user => this.setState({ user }));
    }
  }

  componentWillUnmount() {
    // Cancel any pending requests or subscriptions
  }

  render() {
    if (!this.state.user) return <p>Loading...</p>;
    return <p>{this.state.user.name}</p>;
  }
}`}
        </CodeBlock>

        <h3 className="com-subtitle">Pros and Cons of Class Components</h3>
        <p className="com-text"><strong>Pros:</strong> Familiar if you know classes. Lifecycle methods have clear names (mount, update, unmount). Error boundaries today must be class components.</p>
        <p className="com-text"><strong>Cons:</strong> More boilerplate (<code>this</code>, <code>bind</code>, <code>super</code>). <code>this</code> can be confusing. Reusing logic often leads to HOCs or render props. React recommends functional components with Hooks for new code.</p>
      </section>

      {/* ========== DIFFERENCES ========== */}
      <section className="method-section">
        <h2 className="method-title">Difference Between Functional and Class Components</h2>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Functional Component</th>
                <th>Class Component</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Syntax</strong></td>
                <td>JavaScript function that returns JSX</td>
                <td>ES6 class extending React.Component with a render() method</td>
              </tr>
              <tr>
                <td><strong>State</strong></td>
                <td>useState hook</td>
                <td>this.state and this.setState()</td>
              </tr>
              <tr>
                <td><strong>Lifecycle</strong></td>
                <td>useEffect (and other hooks) for side effects and cleanup</td>
                <td>componentDidMount, componentDidUpdate, componentWillUnmount, getDerivedStateFromProps, etc.</td>
              </tr>
              <tr>
                <td><strong>Props</strong></td>
                <td>First argument: function MyComponent(props)</td>
                <td>this.props</td>
              </tr>
              <tr>
                <td><strong>this</strong></td>
                <td>No this; no binding needed</td>
                <td>Uses this; often need to bind event handlers in constructor or use arrow functions</td>
              </tr>
              <tr>
                <td><strong>Code size</strong></td>
                <td>Usually shorter and simpler</td>
                <td>More boilerplate</td>
              </tr>
              <tr>
                <td><strong>React recommendation</strong></td>
                <td>Preferred for new code</td>
                <td>Still supported; use when you need an Error Boundary or existing codebase is class-based</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== WHEN TO USE WHICH ========== */}
      <section className="method-section">
        <h2 className="method-title">When to Use Which?</h2>
        <p className="com-text">
          <strong>Use functional components with Hooks</strong> for almost all new components. They are easier to write, read, and test, and React's docs and examples focus on them. Use <strong>class components</strong> when you have to (e.g. you need <code>componentDidCatch</code> for an Error Boundary, or you are maintaining an old codebase that uses classes). You can mix both in the same project: functional components can render class components and vice versa.
        </p>
      </section>

      {/* ========== EXTRA: JSX & FRAGMENTS ========== */}
      <section className="method-section">
        <h2 className="method-title">JSX and Fragments (Brief)</h2>
        <p className="com-text">
          <strong>JSX</strong> is a syntax that looks like HTML but is JavaScript. React compiles it to <code>React.createElement</code> calls. You can embed expressions with <code>{'{}'}</code>. Component names must start with a capital letter so React treats them as components, not HTML tags.
        </p>
        <p className="com-text">
          <strong>Fragments</strong> let you return multiple elements without wrapping them in an extra DOM node. Use <code>&lt;React.Fragment&gt;</code> or the short form <code>&lt;&gt;...&lt;/&gt;</code>.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>`}
        </CodeBlock>
      </section>

      {/* ========== INTERVIEW-STYLE Q&A ========== */}
      <section className="method-section">
        <h2 className="method-title">Quick Recap (Interview Style)</h2>
        <div className="faq-item">
          <h4 className="faq-question">What is the difference between functional and class components?</h4>
          <p className="faq-answer">
            Functional components are functions that return JSX; they use Hooks (useState, useEffect) for state and lifecycle. Class components are classes that extend React.Component, use this.state and this.setState, and lifecycle methods like componentDidMount and componentWillUnmount. React recommends functional components for new code.
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-question">How do you mimic componentDidMount in a functional component?</h4>
          <p className="faq-answer">
            Use useEffect with an empty dependency array: <code>{'useEffect(() => { /* run once */ }, [])'}</code>. The function runs once after the first render, similar to componentDidMount.
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-question">How do you mimic componentWillUnmount in a functional component?</h4>
          <p className="faq-answer">
            Return a cleanup function from useEffect. React calls it when the component unmounts or before the effect runs again. Example: <code>{'useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, [])'}</code>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Component;
