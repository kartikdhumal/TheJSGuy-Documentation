import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ES6() {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    return (
        <div className="debounce-container">
            <h1 className="title">JavaScript ES6 Features Documentation</h1>

            <section className="method-section">
                <h2 className="method-title">What is ES6?</h2>
                <p>
                    ES6, or ECMAScript 2015, is the sixth edition of the ECMAScript language specification. 
                    It introduces significant improvements to JavaScript, including new syntax and features that enhance code readability and performance.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example of an ES6 feature: Arrow Functions\nconst add = (a, b) => a + b;\nconsole.log(add(2, 3)); // Outputs: 5`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">1. let and const</h2>
                <p>
                    The <CodeBlock language="javascript" style={atomDark}>let</CodeBlock> and <CodeBlock language="javascript" style={atomDark}>const</CodeBlock> keywords introduce block-scoping to JavaScript, allowing variables to be limited in scope.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`if (true) {\n    let x = 1;\n    const y = 2;\n    console.log(x); // Outputs: 1\n}\n// console.log(x); // ReferenceError: x is not defined`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">2. Template Literals</h2>
                <p>
                    Template literals allow for multi-line strings and expression interpolation.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`const name = "World";\nconst greeting = \`Hello, \${name}!\`;\nconsole.log(greeting); // Outputs: Hello, World!`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">3. Default Parameters</h2>
                <p>
                    Default parameters allow function parameters to be initialized with default values if no value or undefined is passed.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function multiply(a, b = 1) {\n    return a * b;\n}\nconsole.log(multiply(5)); // Outputs: 5`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">4. Rest and Spread Operators</h2>
                <p>
                    The rest operator allows us to represent an indefinite number of arguments as an array, while the spread operator expands an iterable into more elements.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Rest operator\nfunction sum(...numbers) {\n    return numbers.reduce((acc, num) => acc + num, 0);\n}\nconsole.log(sum(1, 2, 3)); // Outputs: 6\n\n// Spread operator\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];\nconsole.log(arr2); // Outputs: [1, 2, 3, 4, 5]`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">5. Destructuring Assignment</h2>
                <p>
                    Destructuring allows unpacking values from arrays or properties from objects into distinct variables.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`const arr = [1, 2, 3];\nconst [a, b] = arr;\nconsole.log(a, b); // Outputs: 1, 2\n\nconst obj = { x: 1, y: 2 };\nconst { x, y } = obj;\nconsole.log(x, y); // Outputs: 1, 2`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">6. Enhanced Object Literals</h2>
                <p>
                    ES6 allows for more concise syntax when creating objects.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`const x = 1;\nconst y = 2;\nconst obj = { x, y, getSum() { return x + y; } };\nconsole.log(obj.getSum()); // Outputs: 3`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">7. Modules</h2>
                <p>
                    ES6 introduced a module system for better code organization and reuse.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// module.js\nexport const pi = 3.14;\nexport function add(a, b) { return a + b; }\n\n// main.js\nimport { pi, add } from './module';\nconsole.log(pi); // Outputs: 3.14\nconsole.log(add(2, 3)); // Outputs: 5`}
                    </CodeBlock>
                
            </section>
        </div>
    );
}

export default ES6;
