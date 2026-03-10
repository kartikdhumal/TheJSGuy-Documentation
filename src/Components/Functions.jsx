import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Functions() {
    useEffect(() => {
    
        window.scrollTo(0,0);
    }, []);

    return (
        <div className="debounce-container">
            <h1 className="title">Functions</h1>

            <section className="method-section">
                <h2 className="method-title">What is a Function?</h2>
                <p>
                    A function is a set of statements that performs a task or calculates a value.
                </p>
            </section>

            <section className="method-section">
                <h2 className="method-title">Function Declaration</h2>
                <p>
                    A named function defined with the <CodeBlock language="javascript" style={atomDark}>function</CodeBlock> keyword, hoisted to the top of its scope.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function myName() {
    console.log("Pappu Kumar");
}
myName();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Function Expression</h2>
                <p>
                    A function expression is a way to define a function and assign it to a variable.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`var b = function () {
    console.log("Pappu Kumar");
};
b();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Anonymous Functions</h2>
                <p>
                    Functions that do not have a name are called anonymous functions.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`var b = function () {
    console.log("Pappu Kumar");
};`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Named Function Expressions</h2>
                <p>
                    A named function expression is a function defined within an expression that has a name.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`var b = function xyz() {
    console.log("I am Named functions expressions");
};
b();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Parameters vs Arguments</h2>
                <p>
                    Parameters are variables defined in the function signature to accept input values. Arguments are the actual values passed to the function when it is called.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function sum(a, b) { // Parameters
    console.log(a + b);
}
sum(32, 54); // Arguments`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">First-Class Functions</h2>
                <p>
                    First-class functions refer to the concept that functions are treated as first-class citizens, meaning they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`const greet = function() {
    console.log("Hello, World!");
};
greet(); // Output: Hello, World!

function callFunction(fn) {
    fn();
}
callFunction(greet); // Output: Hello, World!

function createGreeter() {
    return function() {
        console.log("Hello from the returned function!");
    };
}
const greeter = createGreeter();
greeter(); // Output: Hello from the returned function!

const functionsArray = [
    function() { console.log("First function"); },
    function() { console.log("Second function"); }
];
functionsArray[0](); // Output: First function
functionsArray[1](); // Output: Second function`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Arrow Functions</h2>
                <p>
                    Arrow functions are anonymous functions without a name, often assigned to a variable. They are also called lambda functions.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`const sayName = () => {
    console.log("Pappu Kumar");
};`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Limitations of Arrow Functions</h2>
                <ul>
                    <li>Arrow functions do not have the <CodeBlock language="javascript" style={atomDark}>prototype</CodeBlock> property.</li>
                    <li>They do not have their own <CodeBlock language="javascript" style={atomDark}>this</CodeBlock>.</li>
                    <li>Cannot be used with the <CodeBlock language="javascript" style={atomDark}>new</CodeBlock> keyword.</li>
                    <li>Cannot be used as constructors.</li>
                    <li>These functions are anonymous, making debugging harder.</li>
                    <li>Cannot be used as generator functions that use the <CodeBlock language="javascript" style={atomDark}>yield</CodeBlock> keyword.</li>
                </ul>
            </section>

            <section className="method-section">
                <h2 className="method-title">Differences Between Normal Functions and Arrow Functions</h2>
                <table className='comparison-table'>
                    <thead>
                        <tr>
                            <th>ASPECT</th>
                            <th>ARROW FUNCTIONS</th>
                            <th>NORMAL FUNCTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Anonymous</td>
                            <td>Yes</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>Syntax</td>
                            <td>Shorter</td>
                            <td>Longer</td>
                        </tr>
                        <tr>
                            <td>Handling multiple expressions</td>
                            <td>Difficult</td>
                            <td>Better</td>
                        </tr>
                        <tr>
                            <td>this keyword behavior</td>
                            <td>Inherits from a broader scope</td>
                            <td>Refers to the object it belongs to</td>
                        </tr>
                        <tr>
                            <td>Constructor functionality</td>
                            <td>Not suitable</td>
                            <td>Suitable</td>
                        </tr>
                        <tr>
                            <td>Arguments object</td>
                            <td>Does not have</td>
                            <td>Has</td>
                        </tr>
                        <tr>
                            <td>Duplicate named parameters</td>
                            <td>Not allowed</td>
                            <td>Allowed</td>
                        </tr>
                        <tr>
                            <td>Call, apply, and bind</td>
                            <td>Do not change this</td>
                            <td>Can change the value of this</td>
                        </tr>
                        <tr>
                            <td>Lexical scoping</td>
                            <td>Lexically scoped</td>
                            <td>Functionally scoped</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default Functions;
