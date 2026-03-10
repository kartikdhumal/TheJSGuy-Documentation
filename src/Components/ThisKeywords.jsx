import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ThisKeyword() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>JavaScript `this` Keyword</h1>
      <p>
        The `this` keyword in JavaScript refers to the context in which a function is executed.
        Its value can change depending on how a function is called.
      </p>

      <h2>1. Global Context</h2>
      <p>In the global context, `this` refers to the global object (e.g., `window` in browsers).</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`console.log(this); // Output: Window (in browsers)`}
        </CodeBlock>
      

      <h2>2. Object Method</h2>
      <p>When a function is called as a method of an object, `this` refers to the object the method belongs to.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`const obj = {
  name: "Guddu",
  greet() {
    console.log("Hello, " + this.name); // Output: "Hello, Guddu"
  }
};
obj.greet();`}
        </CodeBlock>
      

      <h2>3. Constructor Function</h2>
      <p>In a constructor function, `this` refers to the instance of the object being created.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`function Person(name) {
  this.name = name;
}
const person1 = new Person("Guddu");
console.log(person1.name); // Output: "Guddu"`}
        </CodeBlock>
      

      <h2>4. Class Syntax</h2>
      <p>In classes, `this` refers to the instance of the class.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log("Hello, " + this.name); // Output: "Hello, Guddu"
  }
}
const person2 = new Person("Guddu");
person2.greet();`}
        </CodeBlock>
      

      <h2>5. Arrow Functions</h2>
      <p>Arrow functions do not have their own `this`. Instead, they inherit `this` from the parent scope.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`const obj2 = {
  name: "Guddu",
  greet: () => {
    console.log("Hello, " + this.name); // Output: "Hello, undefined"
  }
};
obj2.greet();`}
        </CodeBlock>
      

      <h2>6. Event Handlers</h2>
      <p>In event handlers, `this` refers to the element that fired the event.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`const button = document.createElement("button");
button.innerText = "Click me!";
button.addEventListener("click", function() {
  console.log(this); // Output: <button> element
});
document.body.appendChild(button);`}
        </CodeBlock>
      

      <h2>7. Explicit Binding</h2>
      <p>You can explicitly bind `this` using <CodeBlock language="javascript" style={atomDark}>call</CodeBlock>, <CodeBlock language="javascript" style={atomDark}>apply</CodeBlock>, or <CodeBlock language="javascript" style={atomDark}>bind</CodeBlock>.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`function greet() {
  console.log("Hello, " + this.name);
}
const obj3 = { name: "Guddu" };
greet.call(obj3); // Output: "Hello, Guddu"`}
        </CodeBlock>
      

      <h2>8. The `this` Keyword in Strict Mode</h2>
      <p>In strict mode, `this` is `undefined` in the global context and for regular functions.</p>
      
        <CodeBlock language="javascript" style={atomDark}>
          {`function strictFunction() {
  "use strict";
  console.log(this); // Output: undefined
}
strictFunction();`}
        </CodeBlock>
      

      <h2>9. Summary</h2>
      <p>The value of `this` is determined by the context in which a function is executed.
        Understanding how `this` works is crucial for writing effective JavaScript code.
      </p>
    </div>
  );
}

export default ThisKeyword;
