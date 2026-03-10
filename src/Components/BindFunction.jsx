import React, { useEffect } from 'react';
import '../styles/debouncing.css';
import 'prismjs/themes/prism.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BindFunction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Function call(), apply(), and bind()</h1>

      {/* call() */}
      <section className="method-section">
        <h2 className="method-title">call()</h2>
        <p>
          The call() method calls a function with a given this value and arguments provided one by one.
        </p>
        <p>
          It immediately invokes the function.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const person = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + " from " + city + ", " + country;
  }
};

const member = {
  firstName: "Guddu",
  lastName: "Pandit"
};

const result = person.fullName.call(member, "Gaya", "India");
console.log(result); // Output: Guddu Pandit from Gaya, India`}
        </CodeBlock>

      </section>

      {/* bind() */}
      <section className="method-section">
        <h2 className="method-title">bind()</h2>
        <p>
          The bind() method returns a new function, with a specific this value. It doesn’t invoke the function immediately.
        </p>
        <p>
          Commonly used to fix the context of this inside a function.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const person = {
  firstName: "Guddu",
  lastName: "Pandit",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  }
};

const member = {
  firstName: "Guddu",
  lastName: "Pandit"
};

const fullName = person.fullName.bind(member);
console.log(fullName()); // Output: Guddu Pandit`}
        </CodeBlock>
      </section>

      {/* apply() */}
      <section className="method-section">
        <h2 className="method-title">apply()</h2>
        <p>
          The apply() method is similar to call(), but it takes arguments as an array.
        </p>
        <p>
          Useful when arguments are already in array form.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const person = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + " from " + city + ", " + country;
  }
};

const member = {
  firstName: "Guddu",
  lastName: "Pandit"
};

const result = person.fullName.apply(member, ["Gaya", "India"]);
console.log(result); // Output: Guddu Pandit from Gaya, India`}
        </CodeBlock>
      </section>

      {/* Difference */}
      <section className="method-section">
        <h2 className="method-title">Difference Between call, apply, and bind</h2>
        <p>call(): Invokes the function immediately. Accepts arguments one by one.</p>
        <p>apply(): Invokes the function immediately. Accepts arguments as an array.</p>
        <p>bind(): Returns a new function. You need to call it manually later.</p>
      </section>
    </div>
  );
}

export default BindFunction;
