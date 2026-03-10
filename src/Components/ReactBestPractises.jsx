import React from 'react';
import '../styles/debouncing.css'
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReactBestPractises() {
    return (
        <div className="debounce-container">
            <h2 className="title">React Best Practices</h2>

            <section className="practice-section">
                <h3 className="subtitle">1. Organize Your Project Structure</h3>
                <p>
                    Use a clean and modular folder structure. Separate components, pages, hooks, and utils. This makes your codebase scalable and easy to maintain.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
src/
|-- components/
|   |-- Button.jsx
|   |-- Header.jsx
|-- pages/
|   |-- Home.jsx
|-- hooks/
|   |-- useAuth.js
|-- utils/
|   |-- validateEmail.js
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">2. Use Functional Components and Hooks</h3>
                <p>
                    Prefer functional components over class components. Hooks like <strong>useState</strong>, <strong>useEffect</strong> simplify logic and make code cleaner.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">3. Keep Components Small and Reusable</h3>
                <p>
                    Break large UI into smaller reusable components. Each component should do one job only.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
function ProductCard({ product }) {
  return (
    <div>
      <h4>{product.name}</h4>
      <p>{product.price}</p>
    </div>
  );
}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">4. Validate Props</h3>
                <p>
                    Use <strong>PropTypes</strong> or <strong>TypeScript</strong> to validate props and avoid bugs.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
import PropTypes from 'prop-types';

function User({ name }) {
  return <h3>Hello, {name}</h3>;
}

User.propTypes = {
  name: PropTypes.string.isRequired
};
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">5. Always Use Keys in Lists</h3>
                <p>
                    Keys help React identify which items have changed. Never use index as key unless you're sure the list won’t change.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">6. Avoid Props Drilling</h3>
                <p>
                    If you’re passing the same prop through multiple levels, use <strong>React Context</strong> or <strong>Redux</strong> to manage global state.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
import { createContext, useContext } from 'react';

const AuthContext = createContext();

function Parent() {
  return (
    <AuthContext.Provider value={{ user: 'Guddu' }}>
      <Child />
    </AuthContext.Provider>
  );
}

function Child() {
  const { user } = useContext(AuthContext);
  return <p>Logged in as {user}</p>;
}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">7. Use Ternary or Logical && for Conditional UI</h3>
                <p>
                    Use conditional rendering smartly. Avoid long nested if-else blocks in JSX.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
{isLoggedIn ? <Dashboard /> : <LoginPage />}
{isLoading && <Spinner />}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">8. Keep Logic Outside the JSX</h3>
                <p>
                    Don’t mix business logic inside the JSX. Prepare data before return statement.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
function PriceDisplay({ price }) {
  const formatted = \`₹ \${price.toFixed(2)}\`;
  return <p>{formatted}</p>;
}
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">9. Use useEffect Properly</h3>
                <p>
                    Always clean up side effects and manage dependency array properly to avoid infinite loops.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
useEffect(() => {
  const timer = setInterval(() => console.log("Tick"), 1000);
  return () => clearInterval(timer); // cleanup
}, []);
        `}</CodeBlock>
            </section>

            <section className="practice-section">
                <h3 className="subtitle">10. Optimize Performance</h3>
                <p>
                    Use <strong>React.memo</strong>, <strong>useCallback</strong>, and <strong>useMemo</strong> for expensive operations or preventing unnecessary re-renders.
                </p>
                <CodeBlock language="javascript" style={atomDark}>{`
const MemoizedComponent = React.memo(function HeavyComponent({ data }) {
  // Renders only if data changes
});
        `}</CodeBlock>
            </section>
        </div>
    );
}

export default ReactBestPractises;
