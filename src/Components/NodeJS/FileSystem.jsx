import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function FileSystem() {
    return (
        <div className="debounce-container">
            <header className="fs-header">
                <h1 className="fs-title">File System Operations in Node.js</h1>
                <p className="fs-subtitle">Working with Files and Directories</p>
            </header>

            <section className="fs-content">
                <div className="theory-block">
                    <h2 className="section-title">Reading Files</h2>
                    <div className="code-block">
                        <div className="code-header">
                            <span className="file-name">readFile.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>
{`const fs = require('fs');

// Synchronous reading
const content = fs.readFileSync('example.txt', 'utf8');
console.log(content);

// Asynchronous reading
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Promise-based reading
const fsPromises = require('fs').promises;
async function readMyFile() {
    try {
        const data = await fsPromises.readFile('example.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}`}</CodeBlock>
                    </div>
                </div>

                <div className="implementation-block">
                    <h2 className="section-title">Writing Files</h2>
                    <div className="code-block">
                        <div className="code-header">
                            <span className="file-name">writeFile.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>
{`const fs = require('fs');

// Writing file synchronously
fs.writeFileSync('output.txt', 'Hello World!');

// Writing file asynchronously
fs.writeFile('output.txt', 'Hello Async World!', (err) => {
    if (err) throw err;
    console.log('File has been saved!');
});

// Appending to file
fs.appendFile('output.txt', '\\nNew line of text', (err) => {
    if (err) throw err;
    console.log('Text appended!');
});`}</CodeBlock>
                    </div>
                </div>

                <div className="practice-block">
                    <h2 className="section-title">Testing File Operations</h2>
                    <div>
                        <CodeBlock language="javascript" style={atomDark}>node readFile.js</CodeBlock>
                        <CodeBlock language="javascript" style={atomDark}>node writeFile.js</CodeBlock>
                        <CodeBlock language="javascript" style={atomDark}>cat output.txt</CodeBlock>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FileSystem;