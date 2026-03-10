import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Modules() {
  useEffect(() => {    window.scrollTo(0, 0);

  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">JavaScript Modules</h1>

      <div className="method-section">
        <h3>1. Introduction</h3>
        <p>
          Modules are a way to organize and encapsulate code into reusable pieces. Each module can export
          functionalities like variables, functions, and classes, which can be imported and used in other modules.
        </p>
      </div>

      <div className="method-section">
        <h3>3. Default vs Named Exports</h3>
        <p>
          There are two types of exports in JavaScript modules: default exports and named exports.
        </p>
        <div>
          <div>
            Default Export:
            <p> A module can have one default export, which can be imported without curly braces. </p>
            
              <CodeBlock language="javascript" style={atomDark}>{`// file: greet.js
export default function greet(name) {
    return \`Hello, \${name}!\`;
}
    // index.js
    import greet from './math'
`}</CodeBlock>
            
          </div>
          <div>
            Named Export: A module can have multiple named exports. These must be imported with curly braces.
            
              <CodeBlock language="javascript" style={atomDark}>{`//
export const pi = 3.14159;
// index.js
import { pi } from './math'
`}</CodeBlock>
            
          </div>
        </div>
      </div>

      <div className="method-section">
        <h3>2. Basic Syntax</h3>

        <h4>2.1 Exporting from a module</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: math.js
export const pi = 3.14159;

export function add(a, b) {
    return a + b;
}

export class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    area() {
        return pi * this.radius * this.radius;
    }
}`}</CodeBlock>
        


        <h4>2.2 Importing from a module</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
import { pi, add, Circle } from './math.js';

console.log(pi); // 3.14159
console.log(add(2, 3)); // 5
const myCircle = new Circle(5);
console.log(myCircle.area()); // 78.53975`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>3. Default Exports</h3>

        <h4>3.1 Exporting a default value</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: greet.js
export default function greet(name) {
    return \`Hello, \${name}!\`;
}`}</CodeBlock>
        

        <h4>3.2 Importing a default value</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
import greet from './greet.js';

console.log(greet('World')); // Hello, World!`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>4. Renaming Exports and Imports</h3>

        <h4>4.1 Renaming exports</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: math.js
const pi = 3.14159;
const e = 2.71828;
export { pi as PI, e as E };`}</CodeBlock>
        

        <h4>4.2 Renaming imports</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
import { PI, E } from './math.js';

console.log(PI); // 3.14159
console.log(E); // 2.71828`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>5. Aggregating Modules</h3>

        <h4>5.1 Re-exporting from another module</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: constants.js
export { PI, E } from './math.js';`}</CodeBlock>
        

        <h4>5.2 Importing aggregated modules</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
import { PI, E } from './constants.js';

console.log(PI); // 3.14159
console.log(E); // 2.71828`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>6. Dynamic Imports</h3>

        <h4>6.1 Using dynamic imports</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
async function loadGreetModule() {
    const module = await import('./greet.js');
    console.log(module.default('Dynamic World')); // Hello, Dynamic World!
}

loadGreetModule();`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>7. Module Scope</h3>
        <p>
          Each module has its own scope. Variables and functions declared in a module are not accessible
          outside of that module unless they are explicitly exported.
        </p>
      </div>

      <div className="method-section">
        <h3>8. Importing Everything</h3>

        <h4>8.1 Importing all exports</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
import * as MathConstants from './math.js';

console.log(MathConstants.pi); // 3.14159
console.log(MathConstants.add(2, 3)); // 5
const myCircle = new MathConstants.Circle(5);
console.log(myCircle.area()); // 78.53975`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>9. Conditional Imports</h3>

        <h4>9.1 Conditionally importing modules</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: main.js
const condition = true;

if (condition) {
    import('./math.js').then((module) => {
        console.log(module.pi); // 3.14159
    });
}`}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>10. CommonJS and ES6 Modules</h3>

        <h4>10.1 CommonJS modules (Node.js)</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`// file: math.cjs
const pi = 3.14159;
const add = (a, b) => a + b;
module.exports = { pi, add };`}</CodeBlock>
        

        <h4>10.2 Mixing CommonJS and ES6 modules</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`
import { createRequire } from 'module'; // type : "module" 
const require = createRequire(import.meta.url); // type : "commonjs" 
const { pi, add } = require('./math.cjs'); // type : "commonjs" 

console.log(pi); // 3.14159
console.log(add(2, 3)); // 5`}</CodeBlock>
        
      </div>
    </div>
  );
}

export default Modules;