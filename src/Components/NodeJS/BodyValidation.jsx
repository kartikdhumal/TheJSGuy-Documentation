import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BodyValidation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Body Parsing & Validation in Express.js</h1>
      <p>
        Use <code>express.json()</code> and <code>express.urlencoded()</code> to parse request bodies. Add validation (e.g. <code>express-validator</code> or Joi) to reject invalid input.
      </p>

      <div className="method-section">
        <h2 className="method-title">Body parsing middleware</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const express = require('express');
const app = express();

// Parse JSON body (Content-Type: application/json)
app.use(express.json());

// Parse URL-encoded form (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  // req.body is now an object
  const { name, email } = req.body;
  res.json({ name, email });
});`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Validation with express-validator</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// npm install express-validator
const { body, validationResult } = require('express-validator');

app.post('/users',
  body('email').isEmail(),
  body('name').trim().isLength({ min: 2 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email } = req.body;
    res.status(201).json({ name, email });
  }
);`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default BodyValidation;
