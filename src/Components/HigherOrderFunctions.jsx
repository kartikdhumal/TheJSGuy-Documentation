import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function HigherOrderFunctions() {
  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Higher-Order Functions in JavaScript</h1>
      <div className="method-section">
        <h3>What is a Higher-Order Function?</h3>
        <p>
          A higher-order function is a function that takes one or more functions as arguments or returns a function as its result. Common higher-order functions include map , filter , and reduce.
        </p>
      </div>

      <div className="method-section">
        <h3>Example of a Higher-Order Function</h3>
        
          <CodeBlock language="javascript" style={atomDark}>{`function myName(title) {
    title();
    console.log(" Guddu Pandit ");
}

function title() {
    console.log("---- My Name ----");
}

myName(title); // Output: ---- My Name ----
                  //          Guddu Pandit`}</CodeBlock>
        
        <p>
          In this example, myName is a higher-order function because it takes another function title as its argument.
        </p>
      </div>

      <div className="method-section">
        <h3>Calculating Area and Diameter of Circles</h3>
        
          <CodeBlock language="javascript" style={atomDark}>{`const radius = [1, 2, 3];

const area = function (radius) {
    return Math.PI * radius * radius;
}

const diameter = function (radius) {
    return 2 * radius;
}

const calculate = function (radius, logic) {
    const output = [];
    for (let i = 0; i < radius.length; i++) {
        output.push(logic(radius[i]));
    }
    return output;
}

console.log(calculate(radius, area));    // Output: [3.141592653589793, 12.566370614359172, 28.274333882308138]
console.log(calculate(radius, diameter)); // Output: [2, 4, 6]`}</CodeBlock>
        
        <p>
          This demonstrates the flexibility and reusability of higher-order functions in JavaScript.
        </p>
      </div>

      <div className="method-section">
        <h3>Using Map, Filter, and Reduce</h3>

        <h4>1. Map</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`let arr = [12, 21, 54, 64];

function square(x) {
    return x * x;
}

const squares = arr.map((x) => square(x));
console.log(squares); // Output: [144, 441, 2916, 4096]`}</CodeBlock>
        
        <p>
          The map function creates a new array populated with the results of calling a provided function on every element in the calling array.
        </p>

        <h4>2. forEach</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`arr.forEach((value) => {
    console.log(value);
}); // Output: 12 21 54 64`}</CodeBlock>
        
        <p>
          The forEach method executes a provided function once for each array element. Unlike map, it does not return a new array.
        </p>

        <h4>3. Filter</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`const evens = arr.filter(x => x % 2 == 0);
console.log(evens); // Output: [12, 54, 64]`}</CodeBlock>
        
        <p>
          The filter method creates a new array with all elements that pass the test implemented by the provided function.
        </p>

        <h4>4. Reduce</h4>
        
          <CodeBlock language="javascript" style={atomDark}>{`const sum = arr.reduce((acc, curr) => {
    return acc + curr;
}, 0);
console.log(sum); // Output: 151`}</CodeBlock>
        
        <p>
          The reduce method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.
          It takes two parameters:
          <div>
            <p>Reducer Function: This function takes two arguments, the accumulator and the current value. The accumulator accumulates the callback's return values. It is the accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied.</p>
            <p>Initial Value (optional): A value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used as the initial accumulator value, and the callback will start executing at the second element.</p>
          </div>
        </p>
      </div>

      <div className="method-section">
        <h3>Summary</h3>
          <p>Higher-Order Functions: Functions that take other functions as arguments or return functions as results.</p>
          <p>Map: Transforms each element in an array by applying a function and returns a new array.</p>
          <p>forEach: Executes a provided function once for each array element; does not return a new array.</p>
          <p>Filter: Filters elements in an array based on a condition and returns a new array of elements that meet the condition.</p>
          <p>Reduce: Reduces an array to a single value by applying a reducer function to each element. It takes a reducer function and an optional initial value as parameters.</p>
      </div>
    </div>
  );
}

export default HigherOrderFunctions;
