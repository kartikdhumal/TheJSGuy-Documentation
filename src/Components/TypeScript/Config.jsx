import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypeScriptConfig() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">tsconfig.json</h1>
      <p>
        <code>tsconfig.json</code> configures the TypeScript compiler: which files to include, output directory, strictness, and module system. Generate a default one with <code>tsc --init</code>.
      </p>
      <div className="method-section">
        <h2 className="method-title">Common options</h2>
        <CodeBlock language="json" style={atomDark}>
          {`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Strict mode</h2>
        <p><code>"strict": true</code> enables <code>strictNullChecks</code>, <code>noImplicitAny</code>, <code>strictFunctionTypes</code>, and others. Recommended for new projects.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Paths (path mapping)</h2>
        <CodeBlock language="json" style={atomDark}>
          {`"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
}`}
        </CodeBlock>
        <p>Allows <code>import x from '@/components/X'</code>. Your bundler (e.g. Vite, webpack) must resolve these too.</p>
      </div>
    </div>
  );
}

export default TypeScriptConfig;
