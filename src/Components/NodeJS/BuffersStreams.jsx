import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BuffersStreams() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Buffers & Streams in Node.js</h1>
      <p>
        <strong>Buffer</strong> is a fixed-size chunk of memory for raw binary data. <strong>Streams</strong> let you read/write data in chunks instead of loading everything into memory.
      </p>

      <div className="method-section">
        <h2 className="method-title">Buffer</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Create a buffer from string
const buf = Buffer.from('Hello', 'utf8');
console.log(buf);        // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString());  // Hello

// Allocate 10 bytes
const buf2 = Buffer.alloc(10);
buf2.write('Node');
console.log(buf2.toString());  // Node`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Readable & Writable Streams</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs');

// Read file as stream
const readStream = fs.createReadStream('largefile.txt');
const writeStream = fs.createWriteStream('copy.txt');

readStream.on('data', (chunk) => {
  writeStream.write(chunk);
});

readStream.on('end', () => {
  writeStream.end();
});`}
        </SyntaxHighlighter>
      </div>

      <div className="method-section">
        <h2 className="method-title">Piping Streams</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const fs = require('fs');

fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default BuffersStreams;
