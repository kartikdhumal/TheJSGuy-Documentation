import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Authentication() {
    return (
        <div className="debounce-container">
            <header className="auth-header">
                <h1 className="auth-title">Authentication in Node.js</h1>
                <p className="auth-subtitle">Implementation of JWT-based Authentication</p>
            </header>

            <section className="auth-content">
                <div className="theory-block">
                    <h2 className="section-title">Understanding JWT Authentication</h2>
                    <p className="section-description">
                        JSON Web Tokens (JWT) provide a secure method for handling user authentication. 
                        These tokens are encoded JSON objects containing user information and cryptographic signatures.
                    </p>
                    
                    <div className="key-points">
                        <h3 className="subsection-title">Key Components</h3>
                        <ul className="points-list">
                            <li>Header: Contains token type and algorithm information</li>
                            <li>Payload: Stores user claims and relevant data</li>
                            <li>Signature: Ensures data integrity and authenticity</li>
                        </ul>
                    </div>
                </div>

                <div className="implementation-block">
                    <h2 className="section-title">Implementation Guide</h2>
                    <div className="setup-section">
                        <h3 className="subsection-title">Initial Setup</h3>
                        <div>
                            <CodeBlock language="javascript" style={atomDark}>npm install jsonwebtoken bcryptjs</CodeBlock>
                        </div>
                    </div>

                    <div className="code-block">
                        <div className="code-header">
                            <span className="filename">middleware/auth.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>{`const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication required' });
    }
};

module.exports = auth;`}</CodeBlock>
                    </div>

                    <div className="code-block">
                        <div className="code-header">
                            <span className="filename">controllers/authController.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>{`const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};`}</CodeBlock>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Authentication;