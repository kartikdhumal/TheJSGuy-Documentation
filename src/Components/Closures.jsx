import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Closures() {
    useEffect(() => {
    
        window.scrollTo(0,0);
    }, []);

    return (
        <div className="debounce-container">
            <h1 className="title">Closures</h1>

            <section className="method-section">
                <h2 className="method-title">What is a Closure?</h2>
                <p>
                    A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).
                    In other words, a closure gives you access to an outer function's scope from an inner function.
                    In JavaScript, closures are created every time a function is created, at function creation time.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function init() {
    var name = "Mozilla"; // name is a local variable created by init
    function displayName() {
        // displayName() is the inner function, that forms the closure
        console.log(name); // use variable declared in the parent function
    }
    displayName();
}
init();`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Scoping with let and const</h2>
                <p>
                    The behavior of variable declarations with var, let, and const can lead to different scoping rules:
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`if (Math.random() > 0.5) {
    var x = 1;
} else {
    var x = 2;
}
console.log(x); // Outputs either 1 or 2

// if (Math.random() > 0.5) {
//     let x = 1; 
// } else {
//     let x = 2;
// }
// console.log(x); // ReferenceError: x is not defined

// if (Math.random() > 0.5) {
//     const x = 1;
// } else {
//     const x = 2;
// }
// console.log(x);`}
                    </CodeBlock>
                
            </section>

            <section className="method-section">
                <h2 className="method-title">Creating Functions with Closures</h2>
                <p>
                    You can also create functions that retain access to their lexical scope through closures:
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function makeFunc() {
    const name = "Mozilla";
    function displayName() {
      console.log(name);
    }
    return displayName;
}
  
const myFunc = makeFunc();
myFunc(); // Outputs: Mozilla`}
                    </CodeBlock>
                
            </section>

            {/* New Section: Function Scoped vs Block Scoped Variables */}
            <section className="method-section">
                <h2 className="method-title">Function Scoped vs Block Scoped Variables</h2>
                <p>
                    Understanding the difference between function scoped and block scoped variables is crucial for managing variable accessibility and preventing scope-related bugs in JavaScript.
                </p>

                <h3>Function Scoped Variables</h3>
                <p>
                    Variables declared with var are function scoped, meaning they are accessible throughout the entire function in which they are declared.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function exampleFunction() {
    if (true) {
        var functionScoped = "I am function scoped";
    }
    console.log(functionScoped); // Accessible here
}
exampleFunction(); // Outputs: I am function scoped

// Outside the function
// console.log(functionScoped); // ReferenceError: functionScoped is not defined`}
                    </CodeBlock>
                

                <h3>Block Scoped Variables</h3>
                <p>
                    Variables declared with let and const are block scoped, meaning they are only accessible within the block (e.g., <CodeBlock language="javascript" style={atomDark}>{`{ ... }`}</CodeBlock>) they are declared in.
                </p>
                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`function exampleBlockScope() {
    if (true) {
        let blockScopedLet = "I am block scoped with let";
        const blockScopedConst = "I am block scoped with const";
        console.log(blockScopedLet); // Accessible here
        console.log(blockScopedConst); // Accessible here
    }
     console.log(blockScopedLet); // ReferenceError: blockScopedLet is not defined
     console.log(blockScopedConst); // ReferenceError: blockScopedConst is not defined
}
exampleBlockScope();`}
                    </CodeBlock>
                
            </section>
        </div>
    );
}

export default Closures;
