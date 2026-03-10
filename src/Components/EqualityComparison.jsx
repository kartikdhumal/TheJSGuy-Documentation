import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function EqualityComparison() {

    return (
        <div className="debounce-container">
            <h1 className="title">Double vs. Triple Equality in JavaScript</h1>

            <section className="description-section">
                <p className="description">
                    In JavaScript, equality operators like double equals (==) and triple equals (===)
                    are used to compare two values. However, both operators work differently:
                </p>
                <ul className="comparison-list">
                    <li>Double Equals (==): Converts both operands to the same type (type coercion) before comparison.</li>
                    <li>Triple Equals (===): Compares both the value and type, making it a strict comparison without type coercion.</li>
                </ul>
            </section>

            <section className="code-section">
                <h2 className="code-title">Code Example</h2>

                
                    <CodeBlock language="javascript" style={atomDark}>
                        {`// Example: Double vs. Triple Equality
let str = "10";
let num = 10;

console.log(str == num ? "Both are same " : "Not same");
// Output: "Both are same" (because == does type coercion)

console.log(str === num ? "Both are same " : "Not same");
// Output: "Not same" (because === checks both value and type strictly)`}
                    </CodeBlock>
                
            </section>

            <section className="key-difference">
                <h2 className="code-title">Key Differences</h2>
                <ul className="difference-list">
                    <li>Type coercion: The double equals operator converts the operands to the same type before comparison.</li>
                    <li>Strict comparison: The triple equals operator checks both the value and the type without converting them.</li>
                    <li>Usage: Prefer triple equals (<CodeBlock language="javascript" style={atomDark}>===</CodeBlock>) for strict comparisons, as it avoids unexpected behavior due to type coercion.</li>
                </ul>
            </section>
        </div>
    );
}

export default EqualityComparison;
