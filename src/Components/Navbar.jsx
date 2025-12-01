import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar({ name }) {
    return (
        <div className="main">
            {/* <h1 className="head-title">{name}</h1> */}
            <div className="navbar-container">
                <div className="navbar-section">
                    <h1 className="navbar-title">React.js</h1>
                    <div className="navbar-links">
                        <div className="navbar-item"><Link to="/package" className="navbar-link">Package</Link></div>
                        <div className="navbar-item"><Link to="/component" className="navbar-link">Component & JSX</Link></div>
                        <div className="navbar-item"><Link to="/dom" className="navbar-link">DOM & Virtual DOM</Link></div>
                        <div className="navbar-item"><Link to="/hooks" className="navbar-link">Hooks</Link></div>
                        <div className="navbar-item"><Link to="/router" className="navbar-link">React Router DOM</Link></div>
                        <div className="navbar-item"><Link to="/props" className="navbar-link">Props</Link></div>
                        <div className="navbar-item"><Link to="/lazyloading" className="navbar-link">Lazy Loading</Link></div>
                        <div className="navbar-item"><Link to="/propsdrilling" className="navbar-link">Props Drilling / Lifting stateup</Link></div>
                        <div className="navbar-item"><Link to="/context" className="navbar-link">Context</Link></div>
                        <div className="navbar-item"><Link to="/redux" className="navbar-link">React Redux</Link></div>
                         <div className="navbar-item"><Link to="/performance-optimization" className="navbar-link">Performance Optimization</Link></div>
                        <div className="navbar-item"><Link to="/errorboundary" className="navbar-link">Error Boundary</Link></div>
                        <div className="navbar-item"><Link to="/testing" className="navbar-link">Testing</Link></div>
                        <div className="navbar-item"><Link to="/bestpractises" className="navbar-link">Best Practises</Link></div>
                    </div>
                </div>
                <div className="navbar-section">
                    <h1 className="navbar-title">Node.js & Express.js</h1>
                    <div className="navbar-links">
                        <div className="navbar-item">
                            <Link to="/nodejs-introduction" className="navbar-link">Introduction to Node.js</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-modules" className="navbar-link">Modules & npm</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-filesystem" className="navbar-link">File System Operations</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-express" className="navbar-link">Express.js Basics</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-middleware" className="navbar-link">Middleware</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-routing" className="navbar-link">Routing</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-mongodb" className="navbar-link">MongoDB Integration</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/jwtauth" className="navbar-link">JWT Authentication</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-apis" className="navbar-link">REST APIs</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/nodejs-deployment" className="navbar-link">Deployment</Link>
                        </div>
                    </div>
                </div>
                <div className="navbar-section">
                    <h1 className="navbar-title">Javascript</h1>
                    <div className='navbar-outer'>
                        <div className="navbar-links">
                            <div className="navbar-item"><Link to="/array-methods" className="navbar-link">Array Methods</Link></div>
                            <div className="navbar-item"><Link to="/async-await" className="navbar-link">Async Await</Link></div>
                            <div className="navbar-item"><Link to="/asynchronous-eventloop" className="navbar-link">Asynchronous and EventLoop</Link></div>
                            <div className="navbar-item"><Link to="/bind-function" className="navbar-link">Call, Bind, Apply</Link></div>
                            <div className="navbar-item"><Link to="/callback" className="navbar-link">Callback</Link></div>
                            <div className="navbar-item"><Link to="/closures" className="navbar-link">Closures</Link></div>
                            <div className="navbar-item"><Link to="/destructuring" className="navbar-link">Destructuring</Link></div>
                            <div className="navbar-item"><Link to="/dom-manipulation" className="navbar-link">DOM Manipulation</Link></div>
                            <div className="navbar-item"><Link to="/templateliteral" className="navbar-link">Template Literal</Link></div>
                            <div className="navbar-item"><Link to="/errors" className="navbar-link">Errors</Link></div>
                            <div className="navbar-item"><Link to="/es6" className="navbar-link">ES6</Link></div>
                            <div className="navbar-item"><Link to="/functions" className="navbar-link">Functions</Link></div>
                            <div className="navbar-item"><Link to="/higher-order-functions" className="navbar-link">Higher Order Functions</Link></div>
                            <div className="navbar-item"><Link to="/hoisting" className="navbar-link">Hoisting</Link></div>
                            <div className="navbar-item"><Link to="/javascript-engine" className="navbar-link">JavaScript Engine</Link></div>
                            <div className="navbar-item"><Link to="/modules" className="navbar-link">Modules</Link></div>
                            <div className="navbar-item"><Link to="/object-methods" className="navbar-link">Object Methods</Link></div>
                            <div className="navbar-item"><Link to="/datastructure" className="navbar-link">Data structure</Link></div>
                            <div className="navbar-item"><Link to="/oops" className="navbar-link">OOPS</Link></div>
                            <div className="navbar-item"><Link to="/promise-apis" className="navbar-link">Promises & APIs</Link></div>
                            <div className="navbar-item"><Link to="/scope-chain" className="navbar-link">Scope Chain</Link></div>
                            <div className="navbar-item"><Link to="/shadowing" className="navbar-link">Shadowing</Link></div>
                            <div className="navbar-item"><Link to="/string-methods" className="navbar-link">String Methods</Link></div>
                            <div className="navbar-item"><Link to="/this-keyword" className="navbar-link">This Keyword</Link></div>
                            <div className="navbar-item"><Link to="/variables" className="navbar-link">Variables</Link></div>
                            <div className="navbar-item"><Link to="/web-apis" className="navbar-link">Web APIs</Link></div>
                            <div className="navbar-item"><Link to="/debouncing" className="navbar-link">Debouncing & Throttling</Link></div>
                        </div>
                    </div>
                </div>
                <div className="navbar-section">
                    <h1 className="navbar-title">MongoDB</h1>
                    <div className="navbar-links">
                        <div className="navbar-item">
                            <Link to="/mongodb#introduction" className="navbar-link">What is MongoDB?</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#difference" className="navbar-link">MongoDB vs MySQL</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#commands" className="navbar-link">MongoDB Commands</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#operators" className="navbar-link">Query Operators</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#aggregation" className="navbar-link">Aggregation Pipelines</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#validation" className="navbar-link">Schema Validation</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#nodejs" className="navbar-link">MongoDB with Node.js</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/mongodb#mongoose" className="navbar-link">MongoDB vs Mongoose</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/impqueries" className="navbar-link">Most IMP Queries</Link>
                        </div>
                    </div>
                </div>
                <div className="navbar-section">
                    <h1 className="navbar-title">DSA</h1>
                    <div className="navbar-links">
                        <div className="navbar-item">
                            <Link to="/dsa" className="navbar-link">Data Structures & Algorithms</Link>
                        </div>
                    </div>
                </div>
                <div className="navbar-section">
                    <h1 className="navbar-title">DBMS , OS , Networking</h1>
                    <div className="navbar-links">
                        <div className="navbar-item"><Link to="/qna" className="navbar-link">DBMS & SQL</Link></div>
                        <div className="navbar-item"><Link to="/operatingsystem" className="navbar-link">Operating System</Link></div>
                        <div className="navbar-item"><Link to="/networking" className="navbar-link">Networking</Link></div>
                    </div>
                </div>
                                <div className="navbar-section">
                    <h1 className="navbar-title">Interview Questions</h1>
                    <div className="navbar-links">
                        <div className="navbar-item">
                            <Link to="/improvement" className="navbar-link">Interview Questions</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
