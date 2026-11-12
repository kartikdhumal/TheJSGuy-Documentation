import React, { useContext } from 'react';
import '../styles/debouncing.css';
import { userContext } from '..';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function HooksFAQ() {
    const { name, info } = useContext(userContext);

    return (
        <div className="debounce-container">
            <h1 className="main-title">React Hooks</h1>

            <div className="hook-section">
                <h2 className="hook-title">1. useState</h2>

                <div className="faq-item">
                    <h3 className="faq-question">What is the useState hook? What are its parameters?</h3>
                    <p className="faq-answer">
                        The useState hook is a function that lets you add state to functional components. It takes the initial state as an argument and returns an array containing the current state and a function to update it.
                        <ul>
                            <li>Try to keep all states in top of the function. It creates consistency</li>
                        </ul>
                        <br />
                        Parameters:
                        <ul>
                            <li>initialState: The initial state value.</li>
                        </ul>
                        Returns:
                        <ul>
                            <li>state: The current state value.</li>
                            <li>setState: A function to update the state.</li>
                        </ul>
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">Every time state changes, does it re-render the component?</h3>
                    <p className="faq-answer">
                        Yes, every time the state changes, React re-renders the component to reflect the new state.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">What is Reconciliation in React ? </h3>
                    <p className="faq-answer">
                        When a component's props or state change, React decides
                        whether an actual DOM update is necessary by comparing the
                        newly returned element with the previously rendered one.
                        When they are not equal, React will update the DOM. This
                        process is called reconciliation.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">How is a const variable updated in state while it can't modify the value directly?</h3>
                    <p className="faq-answer">
                        A const variable in state can be updated because React re-renders the component whenever the state changes. Each render creates a new instance of the variable, so the const variable is effectively replaced with a new value each time the state updates.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">What is the initial state in useState?</h3>
                    <p className="faq-answer">
                        The initial state in useState is the value you provide when calling the hook for the first time. It can be any valid data type such as a string, number, array, object, or boolean.
                    </p>
                </div>
            </div>

            <div className="hook-section">
                <h2 className="hook-title">2. useEffect</h2>

                <div className="faq-item">
                    <h3 className="faq-question">What is the useEffect hook? What are its parameters?</h3>
                    <p className="faq-answer">
                        The useEffect hook is a function that lets you perform side effects in functional components. It runs after the render is committed to the screen.
                        <ul>
                            <li>useEffect will be called after every render</li>
                            <li>If we put dependencies in an array, it will be called after every dependency change.</li>
                        </ul>
                        <br />
                        Parameters:
                        <ul>
                            <li>effect: The function containing the side-effect logic. It can optionally return a cleanup function.</li>
                            <li>dependencies: An optional array of dependencies. The effect is only re-run if one of the dependencies has changed since the last render.</li>
                        </ul>
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">Why does changing state in an onChange handler re-render the whole component?</h3>
                    <p className="faq-answer">
                        Changing state in an onChange handler triggers a re-render of the component to ensure the UI is updated to reflect the new state. React's re-rendering mechanism ensures that the component stays in sync with the state changes.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">Can useEffect run before the initial render?</h3>
                    <p className="faq-answer">
                        No, useEffect runs after the initial render and after every update, but not before the initial render.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">What is the cleanup function in useEffect?</h3>
                    <p className="faq-answer">
                        The cleanup function in useEffect is an optional function that you return from the effect function. It runs when the component unmounts or before the effect runs again if the dependencies have changed. It is used to clean up side effects like timers, subscriptions, or event listeners.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">How do you conditionally run an effect in useEffect?</h3>
                    <p className="faq-answer">
                        You can conditionally run an effect by specifying a dependency array as the second argument to useEffect. The effect will only re-run if one of the dependencies has changed.
                    </p>
                </div>

                <div className="faq-item">
                    <h3 className="faq-question">Can you use multiple useState or useEffect hooks in a single component?</h3>
                    <p className="faq-answer">
                        Yes, you can use multiple useState or useEffect hooks in a single component. Each call to these hooks is independent and maintains its own state or effect logic.
                    </p>
                </div>
                <div className="hook-section">
                    <h2 className="hook-title">3. useRouteError</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useRouteError hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useRouteError hook is used in React Router to manage errors that occur during routing. It allows you to display customized error pages or perform alternative actions when a route error arises.
                            <br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const routeError = useRouteError();

// routeError.status     -> HTTP status code
// routeError.message    -> Error message
// routeError.location   -> Location where the error occurred
// routeError.code       -> Error code
// routeError.timestamp  -> Timestamp when the error occurred`}
                            </CodeBlock>

                        </p>
                    </div>
                </div>

                <div className="hook-section">
                    <h2 className="hook-title">4. useParams</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useParams hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useParams hook is used to access the parameters (URL segments) of the current route in React Router. It returns an object containing key-value pairs of the URL parameters.
                            <br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const { id } = useParams();
console.log(id);`}
                            </CodeBlock>

                        </p>
                    </div>
                </div>


                <div className="hook-section">
                    <h2 className="hook-title">5. Custom Hook</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is a Custom Hook?</h3>
                        <p className="faq-answer">
                            Hooks are reusable functions. When you have component logic that needs to be used by multiple
                            components, we can extract that logic to a custom Hook.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">How to Create a Custom Hook?</h3>
                        <p className="faq-answer">
                            To create a custom hook, simply define a function starting with "use" and utilize other hooks or perform custom logic inside it.
                            Custom hooks can take arguments and return values, just like regular functions.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Why Use Custom Hooks?</h3>
                        <p className="faq-answer">
                            Custom hooks promote code reuse and separation of concerns by allowing you to extract and share stateful logic across multiple components.
                            They help in keeping components clean and focused on presentation logic, while the custom hook handles the complex state management or side effects.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Example of a Custom Hook</h3>
                        <h2 className="hook-title">useGetData.js</h2>
                        <p className="faq-answer">
                            <CodeBlock language="javascript" style={atomDark}>
                                {`
 import { useState, useEffect } from 'react';
 import FETCH_URL from '../utils/constants'

 const useGetData = (cri_id) => {
     const [data, setData] = useState(null);
     const [error, setError] = useState(null);
 
     useEffect(() => {
         const fetchData = async () => {
             try {
                 const response = await fetch(FETCH_URL + cri_id);
                 if (!response.ok) {
                     throw new Error('Failed to fetch data');
                 }
                 const data = await response.json();
                 setData(data);
                 setError(null);
             } catch (error) {
                 setError(error.message);
             }
         };
 
         if (cri_id) {
             fetchData();
         }
     }, [cri_id]);
 
     return { data, error };
 };
 
 export default useGetData;   
                              
 `}
                            </CodeBlock>
                            <h2 className="hook-title">Cricketers.jsx</h2>
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const response = useGetData(cri_id);
setData(response);
                    `}
                            </CodeBlock>
                        </p>
                    </div>
                </div>

                <div className="hook-section">
                    <h2 className="hook-title">6. useNavigate</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useNavigate hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useNavigate hook is used for imperative navigation in React Router. It returns a function that can be used to navigate to different routes programmatically.
                            <br />
                            Example:
                            <br />
                            <div>
                                <CodeBlock language="javascript" style={atomDark}>
                                    {`const navigate = useNavigate();`}<br />
                                    {`navigate('/user');`}
                                </CodeBlock>
                            </div>
                        </p>
                    </div>
                </div>

                <div className="hook-section">
                    <h2 className="hook-title">7. useContext</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useContext hook? How is it used?</h3>
                        <p className="faq-answer"> {'Name : ' + name} - {info} </p>
                        <p className="faq-answer"> {'Info : ' + info} </p>
                        <p className="faq-answer">
                            The useContext hook is a function that lets you access the context values in a functional component. It takes a context object (created using React.createContext) and returns the current context value for that context.
                            <br />
                            MyComponent.jsx
                            <CodeBlock language="javascript" style={atomDark}>
                                {`import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const MyComponent = () => {
  const { name, user } = useContext(UserContext);
  return (
    <div>
      <p>Name: {name}</p>
      <p>Info: {user.info}</p>
    </div>
  );
};`}
                            </CodeBlock>

                        </p>
                        <p className='faq-answer'>
                            index.js
                            <CodeBlock language="javascript" style={atomDark}>
                                {`
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

export const UserContext = createContext();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContext.Provider value={{ name: 'Guddu Pandit', info: 'React info' }}>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/hooks" element={<HooksFAQ />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </UserContext.Provider>
);

`}
                            </CodeBlock>
                        </p>
                    </div>
                </div>
                <div className="hook-section">
                    <h2 className="hook-title">8. useDispatch</h2>
                    <div className="faq-item">
                        <p>This is Redux Hooks not React.js</p>
                        <p className="faq-answer">
                            The useDispatch hook returns a reference to the dispatch function from the Redux store. You use this function to dispatch actions.
                            <br />
                            Example:
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const handleRemove = (index) => {
  dispatch(removeItem(index));
 };
                             `}
                            </CodeBlock>
                        </p>
                    </div>
                    <h2 className="hook-title">8. useSelector</h2>
                    <div className="faq-item">
                        <p className="faq-answer">
                            The useSelector hook allows you to extract data from the Redux store state using a selector function.
                            <br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`import { useSelector } from 'react-redux';

const cartItems = useSelector((state) => state.cart.items);`}
                            </CodeBlock>

                        </p>
                    </div>

                    <h2 className="hook-title">9. useStore</h2>
                    <div className="faq-item">
                        <p className="faq-answer">
                            The useStore hook provides access to the entire Redux store instance. It returns an Object
                            <br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`import { useStore } from 'react-redux';

const store = useStore();

console.log(store.getState());`}
                            </CodeBlock>

                        </p>
                    </div>
                </div>
                <div className="hook-section">
                    <h2 className="hook-title">8. useMemo</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useMemo hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useMemo hook is used to memoize a computationally expensive function and optimize performance.
                            It only re-computes the memoized value when one of the dependencies has changed.
                            <br />This is particularly useful for preventing heavy computations from freezing the app.<br />
                            useMemo is used to memoize the result of a computation or value.
                            <br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const prime = useMemo(() => findPrime(text), [text]);`}
                            </CodeBlock>
                        </p>
                    </div>
                </div>

                <div className="hook-section">
                    <h2 className="hook-title">9. useCallback</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useCallback hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useCallback hook returns a memoized callback function. It is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
                            <br />
                            useCallback is used to memoize a callback function.<br />
                            Example:
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);`}
                            </CodeBlock>
                        </p>
                    </div>
                </div>

                <div className="hook-section">
                    <h2 className="hook-title">10. useRef</h2>

                    <div className="faq-item">
                        <h3 className="faq-question">What is the useRef hook? How is it used?</h3>
                        <p className="faq-answer">
                            The useRef hook returns a mutable ref object whose .current property is initialized to the passed argument (initial value). The returned object will persist for the full lifetime of the component.
                            <br />
                            Example 1
                            <br />
                            <CodeBlock language="javascript" style={atomDark}>
                                {`
import React, { useRef } from 'react';

function SimpleUseRefExample() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Focus me with button" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default SimpleUseRefExample;
    `}
                            </CodeBlock>
                            Example 2
                            <CodeBlock language="javascript" style={atomDark}>
                                {`
import React, { useRef, useState } from 'react';

function CricketerForm() {
  const nameRef = useRef(null);
  const [cricketers, setCricketers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    if (name) {
      setCricketers([...cricketers, name]);
      nameRef.current.value = '';
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={nameRef} type="text" placeholder="Enter cricketer's name" />
        <button type="submit">Add Cricketer</button>
      </form>
      <h3>Cricketers List:</h3>
      <ul>
        {cricketers.map((cricketer, index) => (
          <li key={index}>{cricketer}</li>
        ))}
      </ul>
    </div>
  );
}

export default CricketerForm;
    `}
                            </CodeBlock>

                        </p>
                    </div>

                    <div className="hook-section">
                        <h2 className="hook-title">11. useReducer</h2>

                        <div className="faq-item">
                            <h3 className="faq-question">What is the useReducer hook? How is it used?</h3>
                            <p className="faq-answer">
                                The useReducer hook used for state management, particularly when dealing with complex state logic that involves multiple sub-values or when the next state depends on the previous state.
                                <br />
                                Example:
                                <br />
                                <CodeBlock language="javascript" style={atomDark}>
                                    {`
 import React, { useReducer } from 'react'
 const initialState = { count: 0 };
 
 function reducer(state, action) {
   switch (action.type) {
     case 'increment':
       return { count: state.count + 1 };
     case 'decrement':
       return { count: state.count - 1 };
     default:
       throw new Error();
   }
 }
 
 function Counter() {
   const [state, dispatch] = useReducer(reducer, initialState);
 
   return (
     <div>
       <p>Count: {state.count}</p>
       <button onClick={() => dispatch({ type: 'increment' })}>+</button>
       <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
     </div>
   );
 }
 
 export default Counter;
 
 `}
                                </CodeBlock>
                            </p>
                        </div>
                    </div>

                    <div className="hook-section">
                        <h2 className="hook-title">12. useLocation</h2>

                        <div className="faq-item">
                            <h3 className="faq-question">What is the useLocation hook? How is it used?</h3>
                            <p className="faq-answer">
                                The useReducer Provides information about the current URL. It's useful for getting the current path, search, and hash values from the URL.
                                <br />
                                Example:
                                <br />
                                <CodeBlock language="javascript" style={atomDark}>
                                    {`
import { useLocation } from 'react-router-dom';

function ShowLocation() {
  const location = useLocation();
  return <div>Current location: {location.pathname}</div>;
}

export default ShowLocation;

 `}
                                </CodeBlock>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HooksFAQ;
