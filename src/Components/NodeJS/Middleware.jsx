import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Middleware() {
    return (
        <div className="debounce-container">
            <header className="middleware-header">
                <h1 className="middleware-title">Express Middleware</h1>
                <p className="middleware-subtitle">
                    Understanding Middleware in Express.js with Real-World Examples
                </p>
            </header>

            <section className="middleware-content">

                {/* Theory Section */}
                <div className="theory-block">
                    <h2 className="section-title">What is Middleware?</h2>
                    <p className="section-description">
                        Middleware functions are special functions in Express.js that have access to the 
                        request object <code>(req)</code>, the response object <code>(res)</code>, and 
                        the <code>next()</code> function. They sit in between the incoming request and the 
                        final route handler, and can:
                    </p>
                    <ul>
                        <li>Log information (e.g., request details)</li>
                        <li>Authenticate users</li>
                        <li>Parse request bodies (like JSON)</li>
                        <li>Handle errors gracefully</li>
                    </ul>
                </div>

                {/* Real-World JWT Example */}
                <div className="implementation-block">
                    <h2 className="section-title">Real-World Example: Token Authentication Middleware</h2>
                    <p className="section-description">
                        In real applications, middleware is often used for authentication. 
                        Below is a middleware that verifies a JWT (JSON Web Token) 
                        to protect certain routes.
                    </p>

                    <div className="code-header">
                        <span className="file-name">authMiddleware.js</span>
                    </div>
                    <CodeBlock language="javascript" style={atomDark}>
{`const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;`}
                    </CodeBlock>

                    <div className="code-header">
                        <span className="file-name">app.js</span>
                    </div>
                    <CodeBlock language="javascript" style={atomDark}>
{`const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const app = express();

app.use(express.json());

// Dummy login route: returns JWT token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'kartik' && password === '1234') {
        const token = jwt.sign(
            { id: 1, username: 'kartik' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ token });
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

// Protected route
app.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome!', user: req.user });
});

app.listen(5000, () => console.log('Server running on port 5000'));`}
                    </CodeBlock>
                </div>

                {/* Common Middleware Packages */}
                <div className="implementation-block">
                    <h2 className="section-title">Commonly Used Middleware Packages</h2>
                    <p className="section-description">
                        Express has many helpful middleware packages that are commonly used:
                    </p>
                    <CodeBlock language="bash" style={atomDark}>
{`npm install cors morgan helmet`}
                    </CodeBlock>

                    <div className="code-header">
                        <span className="file-name">app.js</span>
                    </div>
                    <CodeBlock language="javascript" style={atomDark}>
{`const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

app.use(helmet());   // Adds security headers
app.use(cors());     // Enables CORS
app.use(morgan('dev')); // Logs requests`}
                    </CodeBlock>
                </div>
            </section>
        </div>
    );
}

export default Middleware;
