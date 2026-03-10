import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Introduction() {
    return (
        <div className="debounce-container">
            <header className="node-header">
                <h1 className="node-title">Introduction to Node.js</h1>
            </header>

            <section className="content-section">
                <h2 className="section-title">What is Node.js?</h2>
                <p>
                    Node.js is a powerful JavaScript runtime built on Chrome's V8 engine.
                    It allows you to run JavaScript code outside the browser, enabling
                    you to build scalable network applications and tools using JavaScript
                    on the server side.
                </p>

                <div className="practice-section">
                    <h3>Getting Started with Node.js</h3>
                    <div className="code-editor">
                        <div className="editor-header">
                            <span className="file-name">hello.js</span>
                        </div>
                        <div >
                            <CodeBlock language="javascript" style={atomDark}>
                                {`// Your first Node.js program
console.log("Welcome to Node.js!");

// Working with arrays
const technologies = ["Node.js", "Express", "MongoDB"];

// Using modern JavaScript features
technologies.forEach(tech => {
    console.log("Learning " + tech);
});

// Demonstrating async operations
setTimeout(() => {
    console.log("This runs after a delay");
}, 1000);`}
                            </CodeBlock>
                        </div>
                    </div>

                        <p>Running your program:</p>
                    <CodeBlock language="bash" style={atomDark}>
                        {`node hello.js`}
                    </CodeBlock>
                </div>

                <h3>Key Features and Benefits</h3>
                <ul>
                    <li>Non-blocking I/O operations for high performance</li>
                    <li>Rich ecosystem with NPM (Node Package Manager)</li>
                    <li>Full-stack JavaScript development</li>
                    <li>Active community and extensive documentation</li>
                    <li>Excellent for building real-time applications</li>
                </ul>

                <div className="practice-section">
                    <h3>Creating a Basic Web Server</h3>
                    <div className="code-editor">
                        <div className="editor-header">
                            <span className="file-name">server.js</span>
                        </div>
                        <div >
                            <CodeBlock language="javascript" style={atomDark}>
                                {`const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
    // Set the response headers
    res.writeHead(200, { 
        'Content-Type': 'text/html' 
    });

    // Handle different routes
    switch(req.url) {
        case '/':
            res.end('<h1>Welcome to our Node.js Server</h1>');
            break;
        case '/about':
            res.end('<h1>About Our Application</h1>');
            break;
        default:
            res.end('<h1>404: Page Not Found</h1>');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});`}
                            </CodeBlock>
                        </div>
                    </div>

                        <p>Start the server:</p>
                    <CodeBlock language="bash" style={atomDark}>
                        {`node server.js`}
                    </CodeBlock>
                </div>

                <div className="note-section">
                    <h3>Important Concepts to Remember</h3>
                    <ul>
                        <li>Node.js uses an event-driven architecture</li>
                        <li>Asynchronous operations prevent blocking</li>
                        <li>Built-in modules provide core functionality</li>
                        <li>NPM helps manage package dependencies</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default Introduction;