import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MemoryObjectReferences() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Memory & Object References in JavaScript</h1>
      <p>
        JavaScript stores primitives by value and objects (including arrays and functions) by reference. Understanding how values are copied and compared prevents subtle bugs when mutating shared data.
      </p>

      {/* 1. Primitive vs Non-Primitive */}
      <div className="method-section">
        <h2 className="method-title">1. Primitive vs Non-Primitive Data Types</h2>
        <p>
          <strong>Primitives</strong> are immutable values stored directly: <code>number</code>, <code>string</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>symbol</code>, <code>bigint</code>. Copying them copies the value.
        </p>
        <p>
          <strong>Non-primitives</strong> (objects, arrays, functions, dates, etc.) are reference types. The variable holds a reference (pointer) to the value in memory; copying the variable copies the reference, not the data.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Primitives — each variable has its own value
let x = 10;
let y = x;
y = 20;
console.log(x);  // 10 (unchanged)
console.log(y);  // 20

// Non-primitives — variables point to the same object
let a = [1, 2, 3];
let b = a;
b.push(4);
console.log(a);  // [1, 2, 3, 4] — a and b reference the same array
console.log(b);  // [1, 2, 3, 4]`}
        </SyntaxHighlighter>
      </div>

      {/* 2. Pass by Value */}
      <div className="method-section">
        <h2 className="method-title">2. Pass by Value</h2>
        <p>
          When you pass a primitive to a function, a copy of the value is passed. Changes inside the function do not affect the original variable.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function addFive(num) {
  num = num + 5;
  return num;
}

let value = 10;
addFive(value);   // returns 15
console.log(value);  // 10 — unchanged

// Same for strings
function greet(s) {
  s = "Bye";
}
let msg = "Hi";
greet(msg);
console.log(msg);  // "Hi"`}
        </SyntaxHighlighter>
      </div>

      {/* 3. Pass by Reference (Reference Assignment) */}
      <div className="method-section">
        <h2 className="method-title">3. Pass by Reference (Reference Assignment)</h2>
        <p>
          When you pass an object or array, the reference (memory address) is passed. The parameter and the argument point to the same object, so mutations inside the function affect the original.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function pushItem(arr, item) {
  arr.push(item);
}

let nums = [1, 2, 3];
pushItem(nums, 4);
console.log(nums);  // [1, 2, 3, 4] — original array was mutated

// Classic example: why a changes when we only touch b
let a = [1, 2, 3];
let b = a;           // b points to the same array as a
b.push(4);           // we mutate that shared array
console.log(a);      // [1, 2, 3, 4]`}
        </SyntaxHighlighter>
        <p>
          <strong>Why does <code>console.log(a)</code> show <code>[1, 2, 3, 4]</code>?</strong> Because <code>let b = a</code> does not create a new array; it copies the reference. Both <code>a</code> and <code>b</code> point to the same array in memory. When you <code>b.push(4)</code>, you modify that single array, so <code>a</code> reflects the change too.
        </p>
      </div>

      {/* 4. JavaScript Memory Model */}
      <div className="method-section">
        <h2 className="method-title">4. JavaScript Memory Model (Stack vs Heap)</h2>
        <p>
          <strong>Stack</strong>: Fixed-size, fast. Stores primitive values and references (pointers) to heap objects. Local variables and function call frames live here.
        </p>
        <p>
          <strong>Heap</strong>: Dynamic, larger. Stores objects, arrays, and other reference-type data. Variables on the stack hold references that point into the heap.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Stack: num = 42, ref = <address>
// Heap: [1, 2, 3] (array data)
let num = 42;           // primitive on stack
let ref = [1, 2, 3];    // ref on stack, array data on heap

let ref2 = ref;          // ref2 gets same address as ref — same heap object`}
        </SyntaxHighlighter>
      </div>

      {/* 5. Reference vs Value Equality */}
      <div className="method-section">
        <h2 className="method-title">5. Reference Equality vs Value Equality</h2>
        <p>
          <code>===</code> for objects compares references: same reference ⇒ equal. It does not compare contents. For value-like comparison of primitives or deep content, use explicit checks or utilities.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Reference equality
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];
console.log(arr1 === arr2);  // false — different references

let arr3 = arr1;
console.log(arr1 === arr3);  // true — same reference

// Value equality for primitives
console.log(5 === 5);        // true
console.log("hi" === "hi");  // true

// Comparing object contents (value equality) needs custom logic or JSON
console.log(JSON.stringify(arr1) === JSON.stringify(arr2));  // true (with caveats for key order)`}
        </SyntaxHighlighter>
      </div>

      {/* 6. Shallow Copy */}
      <div className="method-section">
        <h2 className="method-title">6. Shallow Copy</h2>
        <p>
          A shallow copy creates a new top-level object/array, but nested objects/arrays are still shared by reference. Methods: spread (<code>...</code>), <code>Array.prototype.slice()</code>, <code>Object.assign()</code>.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`let original = [1, 2, { x: 10 }];
let shallow = [...original];   // or original.slice()

shallow.push(4);               // only shallow changes
console.log(original.length);  // 3 — original unchanged

shallow[2].x = 99;             // nested object is shared!
console.log(original[2].x);   // 99 — nested object mutated

// Object shallow copy
let obj = { a: 1, b: { c: 2 } };
let copy = { ...obj };
copy.b.c = 3;
console.log(obj.b.c);  // 3`}
        </SyntaxHighlighter>
      </div>

      {/* 7. Deep Copy */}
      <div className="method-section">
        <h2 className="method-title">7. Deep Copy</h2>
        <p>
          A deep copy creates a new object/array and recursively copies all nested values so nothing is shared. Use <code>JSON.parse(JSON.stringify(obj))</code> for JSON-safe data, or <code>structuredClone(obj)</code> (modern), or a library like Lodash <code>cloneDeep</code>.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`let original = [1, 2, { x: 10 }];
let deep = JSON.parse(JSON.stringify(original));

deep[2].x = 99;
console.log(original[2].x);  // 10 — unchanged

// structuredClone (modern browsers / Node 17+)
let deep2 = structuredClone(original);
deep2[2].x = 100;
console.log(original[2].x);  // 10

// JSON approach fails for: undefined, functions, symbols, circular refs`}
        </SyntaxHighlighter>
      </div>

      {/* 8. Mutation vs Immutability */}
      <div className="method-section">
        <h2 className="method-title">8. Mutation vs Immutability</h2>
        <p>
          <strong>Mutation</strong>: changing an existing object/array in place (e.g. <code>arr.push(4)</code>, <code>obj.name = "x"</code>). Can cause bugs when multiple parts of the code share the same reference.
        </p>
        <p>
          <strong>Immutability</strong>: treating data as read-only and creating new copies when you need changes. Common in React and Redux; avoids accidental shared-state bugs.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Mutating (avoid when sharing references)
let list = [1, 2, 3];
list.push(4);        // same array modified

// Immutable update — create new array
let list2 = [1, 2, 3];
let newList = [...list2, 4];  // new array, list2 unchanged

// Object: mutation
user.age = 31;

// Object: immutable update
let updatedUser = { ...user, age: 31 };`}
        </SyntaxHighlighter>
      </div>

      {/* 9. Real-world bug example */}
      <div className="method-section">
        <h2 className="method-title">9. Real-World Bug: Shared Reference</h2>
        <p>
          A common bug is reusing the same default or config object. Multiple callers share one reference; one mutation affects everyone.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// BUG: default options is shared
const defaultOptions = { theme: "dark", count: 10 };

function getConfig(userOptions) {
  const config = userOptions || defaultOptions;
  config.count = config.count ?? 20;  // mutates defaultOptions!
  return config;
}

getConfig();           // { theme: "dark", count: 20 }
getConfig();           // { theme: "dark", count: 20 } — defaultOptions already mutated
console.log(defaultOptions);  // { theme: "dark", count: 20 } — broken

// FIX: use a copy so defaults are not mutated
function getConfigFixed(userOptions) {
  const config = { ...defaultOptions, ...userOptions };
  config.count = config.count ?? 20;
  return config;
}`}
        </SyntaxHighlighter>
        <p>
          Another example: storing references to the same array in state or cache, then mutating it. All consumers see the same mutated array. Fix: always use shallow or deep copies when you need independent data.
        </p>
      </div>

      {/* Summary / Key example again */}
      <div className="method-section">
        <h2 className="method-title">Key Example: Reference Assignment</h2>
        <p>
          This pattern is the core of many reference-related bugs:
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`let a = [1, 2, 3];
let b = a;
b.push(4);
console.log(a);   // [1, 2, 3, 4]`}
        </SyntaxHighlighter>
        <p>
          <code>a</code> and <code>b</code> both point to the same array. <code>b.push(4)</code> mutates that single array, so <code>a</code> shows the new length and element. To keep <code>a</code> unchanged, copy the array first: <code>let b = [...a]</code> (or <code>a.slice()</code>), then <code>b.push(4)</code> only affects <code>b</code>.
        </p>
      </div>
    </div>
  );
}

export default MemoryObjectReferences;
