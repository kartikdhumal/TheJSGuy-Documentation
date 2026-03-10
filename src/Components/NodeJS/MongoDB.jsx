import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MongoDB() {
    return (
        <div className="debounce-container">
            <header className="mongo-header">
                <h1 className="mongo-title">MongoDB with Node.js</h1>
                <p className="mongo-subtitle">Database Integration and CRUD Operations</p>
            </header>

            <section className="mongo-content">
                <div className="setup-block">
                    <h2 className="section-title">Database Setup</h2>
                    <div>
                        <CodeBlock language="javascript" style={atomDark}>npm install mongoose</CodeBlock>
                    </div>

                    <div>
                        <div className="code-header">
                            <span className="file-name">config/db.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>
{`const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;`}</CodeBlock>
                    </div>
                </div>

                <div className="schema-block">
                    <h2 className="section-title">Schema Definition</h2>
                    <div>
                        <div className="code-header">
                            <span className="file-name">models/User.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>
{`const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);`}</CodeBlock>
                    </div>
                </div>

                <div className="operations-block">
                    <h2 className="section-title">CRUD Operations</h2>
                    <div>
                        <div className="code-header">
                            <span className="file-name">controllers/userController.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>
{`const User = require('../models/User');

// Create new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};`}</CodeBlock>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MongoDB;