import React from 'react';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/debouncing.css';

const PropsInfo = () => {
    return (
        <div className="debounce-container">
            <section className="sub-method-section">
                <h2>React Props (Properties)</h2>

                <p className="description">
                    In React, props (short for "properties") are used to send data from one component (usually parent) to another (child). Think of them like arguments passed to a function.
                    <br />Props help make components dynamic and reusable. Without props, every component would be hardcoded and limited.
                </p>

                <CodeBlock language="javascript" style={atomDark}>
                    {`// Passing props to a component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Using the component
<Welcome name="Guddu" />`}
                </CodeBlock>

                <p className="description">
                    In the above code:
                    <ul>
                        <li>name="Guddu" is the prop</li>
                        <li>It is received in the function as props.name</li>
                    </ul>
                </p>

                <CodeBlock language="javascript" style={atomDark}>
                    {`// Destructuring props for cleaner code
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}`}
                </CodeBlock>

                <p className="description">
                    Let's say you want to show multiple user profiles with different names and ages. Instead of copying code, pass props:
                </p>

                <CodeBlock language="javascript" style={atomDark}>
                    {`const UserCard = ({ name, age }) => (
  <div>
    <h3>{name}</h3>
    <p>Age: {age}</p>
  </div>
);

// Usage
<UserCard name="Guddu" age={22} />
<UserCard name="Aisha" age={25} />`}
                </CodeBlock>

                <p className="description">
                    Props can also be functions, not just strings or numbers. Useful when child needs to communicate back to parent.
                </p>

                <CodeBlock language="javascript" style={atomDark}>
                    {`function Parent() {
  const handleClick = (msg) => {
    alert(msg);
  };

  return <Child onClick={handleClick} />;
}

function Child({ onClick }) {
  return <button onClick={() => onClick("Clicked from Child!")}>Click Me</button>;
}`}
                </CodeBlock>

                <h4 className="interview-title">Interview Questions & Answers:</h4>
                <ul className="faq-list">
                    <li className="faq-item">
                        <p className="faq-question">Q1: What are props in React?</p>
                        <p className="faq-answer">
                            - Props are inputs to components. They allow data to be passed from parent to child component. Props are read-only and make components reusable.
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q2: Are props mutable or immutable?</p>
                        <p className="faq-answer">
                            - Props are <strong>immutable</strong>. A child component cannot change the value of props directly. Only the parent can change the prop by passing a new value.
                            If you try to change props directly inside a child component, React will ignore it or throw a warning in strict mode.
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q3: What is the difference between state and props?</p>
                        <p className="faq-answer">
                            - Props come from the parent and are read-only. State is local to the component and can change over time. Props = external data, State = internal data.
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q4: Can we pass a function as a prop?</p>
                        <p className="faq-answer">
                            - Yes. It’s common to pass callback functions from parent to child, so that child can trigger actions in the parent (e.g., button clicks).
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q5: What is props drilling?</p>
                        <p className="faq-answer">
                            - When you pass props through many levels of components just to reach a deeply nested child, that’s called props drilling. It can make code harder to maintain.
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q6: How do you avoid props drilling?</p>
                        <p className="faq-answer">
                            - Use <strong>React Context</strong> or <strong>Redux</strong> to manage and access shared state globally instead of passing props down manually through each level.
                        </p>
                    </li>

                    <li className="faq-item">
                        <p className="faq-question">Q7: Can props be validated?</p>
                        <p className="faq-answer">
                            - Yes, using a library like <code>prop-types</code>. This helps catch bugs early by ensuring the correct data type is passed into components.
                        </p>
                    </li>
                </ul>


                <p className="description">
                    Tips:<br />
                    - Keep components reusable by depending on props.<br />
                    - Don't mutate props in child — use callback functions.<br />
                    - If passing too many props, consider using Context or grouping them into an object.
                </p>
            </section>
        </div>
    );
};

export default PropsInfo;
