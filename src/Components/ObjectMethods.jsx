import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ObjectMethods() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='debounce-container'>
      <h1 className="doc-title">Object Methods</h1>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.1 Object.keys()</h3>
        <p className="doc-description">
          Object.keys() returns an array of a given object's own enumerable property names. It helps to retrieve the keys of an object.
        </p>

        <CodeBlock language="javascript" style={atomDark}>
          {`
const student = {
  id: 1,
  name: "Guddu",
  age: 22
};

console.log(Object.keys(student));
// Output: [ 'id', 'name', 'age' ]
`}
        </CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.2 Object.values()</h3>
        <p className="doc-description">
          Object.values() returns an array of a given object's own enumerable property values.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const student1 = {
  id: 1,
  name: "Guddu",
  age: 22
};

console.log(Object.values(student1));
// Output: [ 1, 'Guddu', 22 ]`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.3 Object.entries()</h3>
        <p className="doc-description">
          Object.entries() returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
        </p>

        <CodeBlock language="javascript" style={atomDark}>
          {`const student2 = {
  id: 1,
  name: "Guddu",
  age: 22
};

// Loop through entries
Object.entries(student2).forEach(([key, value]) => {
  console.log(\`\${key} is \${value}\`);
});

// Output:
// id is 1
// name is Guddu
// age is 22`}
        </CodeBlock>

      </section>


      <section className="doc-section">
        <h3 className="doc-subtitle">3.4 Object.assign()</h3>
        <p className="doc-description">
          Object.assign() copies all enumerable properties from one or more source objects to a target object.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const student3 = {
  id: 1,
  name: "Guddu",
  age: 22
};

const newObj = {
  id: 2,
  name: "Divya"
};

Object.assign(student3, newObj);
console.log(student3);
// Output: { id: 2, name: 'Divya', age: 22 }`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.5 Object.seal()</h3>
        <p className="doc-description">
          Object.seal() seals an object, preventing new properties from being added and marking all existing properties as non-configurable.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const student4 = {
  id: 1,
  name: "Guddu",
  age: 22
};

Object.seal(student4);
console.log(Object.isSealed(student4)); // true`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.6 Object.freeze()</h3>
        <p className="doc-description">
          Object.freeze() prevents modifications to an object.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const student5 = {
  id: 1,
  name: "Guddu",
  age: 22
};

Object.freeze(student5);

student5.age = 23;
student5.grade = "A";

console.log(student5);`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.7 Object.fromEntries()</h3>
        <p className="doc-description">
          Object.fromEntries() transforms a list of key-value pairs into an object.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const entries6 = [
  ['id', 2],
  ['name', 'Divya']
];

const obj = Object.fromEntries(entries6);
console.log(obj);`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.8 Object.values() with map()</h3>
        <p className="doc-description">
          Using Object.values() with map() lets you iterate and transform values.
        </p>

        <CodeBlock language="javascript" style={atomDark}>{
          `const student6 = {
  id: 2,
  name: "Divya",
  age: 22
};

const values = Object.values(student6);
values.map((val) => console.log(val));`
        }</CodeBlock>

      </section>

      <section className="doc-section">
        <h3 className="doc-subtitle">3.9 Deep Copy</h3>
        <p className="doc-description">
          Deep copy creates a completely new object and also duplicates all nested objects. Changes in the copy don’t affect the original.
        </p>

        <CodeBlock language="javascript" style={atomDark}>
          {`const person = {
  name: "Guddu",
  address: {
    city: "Pune"
  }
};

// Deep copy using JSON
const deepCopy = JSON.parse(JSON.stringify(person));
deepCopy.address.city = "Mumbai";

console.log(person.address.city); // Pune (original not affected)
console.log(deepCopy.address.city); // Mumbai`}
        </CodeBlock>
      </section>


      <section className="doc-section">
        <h3 className="doc-subtitle">3.10 Shallow Copy</h3>
        <p className="doc-description">
          Shallow copy copies the top-level properties, but nested objects are still referenced. So changes in nested data affect the original.
        </p>

        <CodeBlock language="javascript" style={atomDark}>
          {`const person = {
  name: "Guddu",
  address: {
    city: "Pune"
  }
};

// Shallow copy using spread operator
const shallowCopy = { ...person };
shallowCopy.address.city = "Mumbai";

console.log(person.address.city); // Mumbai (original also affected)
console.log(shallowCopy.address.city); // Mumbai`}
        </CodeBlock>
      </section>

    </div>
  );
}

export default ObjectMethods;
