import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PathProcess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Path Module & Process in Node.js</h1>
      <p>
        <code>path</code> helps work with file and directory paths. <code>process</code> gives access to the current process, environment variables, and runtime info.
      </p>

      <div className="method-section">
        <h2 className="method-title">Path module</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`const path = require('path');

const filePath = '/home/user/project/src/index.js';

path.basename(filePath);   // 'index.js'
path.dirname(filePath);    // '/home/user/project/src'
path.extname(filePath);    // '.js'
path.join('src', 'utils', 'helper.js');  // 'src/utils/helper.js' (OS-aware)
path.resolve('src', 'app.js');  // absolute path

// __dirname = directory of current module
const fullPath = path.join(__dirname, 'config.json');`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Process: environment variables</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Read env vars (set via export NODE_ENV=production or .env)
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Often used with dotenv
// require('dotenv').config();
// process.env.DB_URL`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Process: argv, cwd, exit</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Command-line args: node script.js arg1 arg2
process.argv;        // [nodePath, scriptPath, 'arg1', 'arg2']

process.cwd();       // current working directory
process.exit(0);     // exit successfully (non-zero = error)
process.platform;    // 'win32', 'darwin', 'linux'`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default PathProcess;
