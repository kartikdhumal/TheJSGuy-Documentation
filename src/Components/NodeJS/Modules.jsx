import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Modules() {
    return (
        <div className="debounce-container">
            <header className="node-header">
                <h1 className="node-title">Node.js Modules & npm</h1>
            </header>

            <section className="content-section">
                <h2>What are Node.js Modules?</h2>
                <p>
                    Modules are reusable blocks of code that can be exported and imported when needed.
                    Node.js has three types of modules:
                </p>

                <div className="module-types">
                    <div className="module-card">
                        <h3>Core Modules</h3>
                        <p>Built-in modules that come with Node.js installation</p>
                        <div className="code-editor">
                            <div className="editor-header">
                                <span className="file-name">core-modules.js</span>
                            </div>
                            <div >
                                <CodeBlock language="javascript" style={atomDark}>
                                    {`// Using core modules
const fs = require('fs');
const http = require('http');
const path = require('path');

// Reading a file
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});`}
                                </CodeBlock>
                            </div>
                        </div>
                    </div>

                    <div className="module-card">
                        <h3>Local Modules</h3>
                        <p>Modules you create in your project</p>
                        <div className="code-editor">
                            <div className="editor-header">
                                <span className="file-name">math.js</span>
                            </div>
                            <div >
                                <CodeBlock language="javascript" style={atomDark}>
                                    {`// Creating a local module
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = {
    add,
    subtract
};`}
                                </CodeBlock>
                            </div>
                        </div>
                    </div>

                    <div className="module-card">
                        <h3>Third-party Modules</h3>
                        <p>Modules installed via npm</p>
                        <div className="terminal-section">
                            <CodeBlock language="bash" style={atomDark}>
                                {`$ npm install express
$ npm install mongoose`}
                            </CodeBlock>

                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>npm (Node Package Manager)</h2>
                <div className="npm-commands">
                    <h3>Essential npm Commands:</h3>
                    <div className="command-grid">
                        <div className="command-card">
                            <CodeBlock language="bash" style={atomDark}>npm init</CodeBlock>
                            <p>Initialize a new project</p>
                        </div>
                        <div className="command-card">
                            <CodeBlock language="bash" style={atomDark}>npm install</CodeBlock>
                            <p>Install dependencies</p>
                        </div>
                        <div className="command-card">
                            <CodeBlock language="bash" style={atomDark}>npm start</CodeBlock>
                            <p>Run start script</p>
                        </div>
                        <div className="command-card">
                            <CodeBlock language="bash" style={atomDark}>npm test</CodeBlock>
                            <p>Run tests</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Modules;