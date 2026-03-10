import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Routing() {
    return (
        <div className="debounce-container">
            <h1 className="routing-title">Express Routing</h1>

            <div className="routing-theory">
                <h2 className="routing-section-title">Understanding Express Routing</h2>
                <p className="routing-description">
                    Routing determines how an application responds to client requests to specific endpoints (URIs). 
                    Express provides a robust routing system that allows handling different HTTP methods and URL patterns.
                </p>

                <div className="routing-concepts">
                    <h3 className="concepts-title">Core Routing Concepts</h3>
                    <ul className="concepts-list">
                        <li className="concept-item">Route methods correspond to HTTP methods (GET, POST, PUT, DELETE)</li>
                        <li className="concept-item">Route paths define the request URL patterns</li>
                        <li className="concept-item">Route handlers contain the logic to process requests</li>
                        <li className="concept-item">Route parameters allow dynamic values in URLs</li>
                    </ul>
                </div>
            </div>

            <div className="routing-implementation">
                <h2 className="routing-section-title">Basic Route Implementation</h2>
                <div className="code-viewer">
                    <div className="code-header">
                        <span className="code-filename">routes/userRoutes.js</span>
                    </div>
                    <div className="code-block">
                        <CodeBlock language="javascript" style={atomDark}>
{`const express = require('express');
const router = express.Router();

// Get all users
router.get('/', (req, res) => {
    res.json({ users: ['John', 'Jane'] });
});

// Get user by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id, name: 'John' });
});

// Create new user
router.post('/', (req, res) => {
    const { name } = req.body;
    res.status(201).json({ message: 'User created', name });
});

module.exports = router;

// Implementation in app.js
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);`}</CodeBlock>
                    </div>
                </div>
            </div>

            <div className="routing-usage">
                <h3 className="usage-title">Testing Routes</h3>
                <div className="command-terminal">
                    <p className="terminal-line">GET request: http://localhost:3000/api/users</p>
                    <p className="terminal-line">GET user by ID: http://localhost:3000/api/users/123</p>
                    <p className="terminal-line">POST request: curl -X POST -H "Content-Type: application/json" -d {"\"name\":\"John\""} http://localhost:3000/api/users</p>
                </div>
            </div>

            <div className="routing-practices">
                <h3 className="practices-title">Routing Best Practices</h3>
                <ul className="practices-list">
                    <li className="practice-item">Use modular routing with express.Router()</li>
                    <li className="practice-item">Group related routes together</li>
                    <li className="practice-item">Implement proper error handling</li>
                    <li className="practice-item">Validate route parameters and request body</li>
                    <li className="practice-item">Follow RESTful naming conventions</li>
                </ul>
            </div>
        </div>
    );
}

export default Routing;