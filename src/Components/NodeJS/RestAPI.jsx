import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RestAPI() {
    return (
        <div className="debounce-container">
            <header className="rest-header">
                <h1 className="rest-title">Building REST APIs with Node.js</h1>
                <p className="rest-subtitle">Create scalable and maintainable APIs using Express</p>
            </header>

            <section className="rest-section">
                <div className="theory-block">
                    <h2 className="section-title">RESTful API Structure</h2>
                    <p className="section-description">
                        A well-structured REST API implements standard HTTP methods for CRUD operations
                        and follows consistent endpoint naming conventions.
                    </p>

                    <div className="code-editor">
                        <div className="editor-header">
                            <span className="file-name">routes/api.js</span>
                        </div>
                        <div className="code-content">
                            <CodeBlock language="javascript" style={atomDark}>{`const express = require('express');
const router = express.Router();

// GET /api/users - Get all users
router.get('/users', (req, res) => {
    res.json({ users: [] });
});

// GET /api/users/:id - Get single user
router.get('/users/:id', (req, res) => {
    res.json({ user: { id: req.params.id } });
});

// POST /api/users - Create user
router.post('/users', (req, res) => {
    res.status(201).json({ message: 'User created' });
});

// PUT /api/users/:id - Update user
router.put('/users/:id', (req, res) => {
    res.json({ message: 'User updated' });
});

// DELETE /api/users/:id - Delete user
router.delete('/users/:id', (req, res) => {
    res.json({ message: 'User deleted' });
});

module.exports = router;`}</CodeBlock>
                        </div>
                    </div>
                </div>

                <div className="implementation-block">
                    <h2 className="section-title">Error Handling Implementation</h2>
                    <p className="section-description">
                        Proper error handling ensures consistent error responses and improves API reliability.
                    </p>
                    <div className="code-editor">
                        <div className="editor-header">
                            <span className="file-name">middleware/errorHandler.js</span>
                        </div>
                        <div className="code-content">
                            <CodeBlock language="javascript" style={atomDark}>{`const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
};

module.exports = errorHandler;`}</CodeBlock>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RestAPI;