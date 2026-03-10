import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function StaticCORS() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Static Files & CORS in Express.js</h1>
      <p>
        Serve static assets (HTML, CSS, images) with <code>express.static</code>. Enable <strong>CORS</strong> when your API is called from a different origin (e.g. a frontend on another port or domain).
      </p>

      <div className="method-section">
        <h2 className="method-title">Serving static files</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`const path = require('path');
const express = require('express');
const app = express();

// Serve files from 'public' folder at root URL
app.use(express.static('public'));
// http://localhost:3000/style.css  → public/style.css

// Mount at a path
app.use('/assets', express.static(path.join(__dirname, 'public')));`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">CORS (Cross-Origin Resource Sharing)</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// npm install cors
const cors = require('cors');

// Allow all origins (dev only)
app.use(cors());

// Restrict to your frontend
app.use(cors({
  origin: 'https://myapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default StaticCORS;
