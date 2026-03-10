import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Variables() {
  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>Variable Declaration in JavaScript</h1>

      <h2>1. let</h2>
      <div>
        <CodeBlock language="javascript" style={atomDark}>
          {`// let keyword in JavaScript
// ---------------------------
// 1. Block-scoped: Only accessible within the block where it's defined.
// 2. Not hoisted to the top of the block like var (Temporal Dead Zone applies).
// 3. Can be reassigned after declaration.
// 4. Cannot be redeclared in the same scope.

let x = 10;
x = 20; // ✅ Reassignment allowed

let x = 30; // ❌ SyntaxError: Identifier 'x' has already been declared (in same scope)
`}
        </CodeBlock>

      </div>

      <h2>2. const</h2>
      <div>
        <CodeBlock language="javascript" style={atomDark}>
          {`// const keyword in JavaScript
// ----------------------------
// 1. Block-scoped: Accessible only within the block it is declared in.
// 2. Not hoisted like var (it has Temporal Dead Zone).
// 3. Must be initialized during declaration.
// 4. Cannot be reassigned after initial assignment.
// 5. If assigned to an object or array, its contents (properties/elements) can still be modified.

const name = "Kartik";
name = "Dhumal"; // ❌ TypeError: Assignment to constant variable.

const user = { age: 22 };
user.age = 23; // ✅ Allowed (modifying object properties)

user = { age: 30 }; // ❌ TypeError: Assignment to constant variable.
`}
        </CodeBlock>

      </div>

      <h2>3. var</h2>
      <div>
        <CodeBlock language="javascript" style={atomDark}>
          {`// var keyword in JavaScript
// ---------------------------
// 1. Function-scoped: Accessible anywhere within the function.
// 2. Hoisted to the top of its function scope (declared but undefined).
// 3. Can be redeclared and reassigned.
// 4. Avoid using var in modern JavaScript — prefer let or const.

function testVar() {
  console.log(x); // undefined (due to hoisting)
  var x = 10;
  console.log(x); // 10

  if (true) {
    var x = 20; // Affects the same x (function-scoped)
    console.log(x); // 20
  }

  console.log(x); // 20
}
testVar();

var y = 5;
var y = 10; // Redeclaration allowed
`}
        </CodeBlock>

      </div>

      <h2>Block Scope (let and const)</h2>
      <div>
        <CodeBlock language="javascript" style={atomDark}>
          {`function blockScopeExample() {
  if (true) {
    let blockScopedVar = 'I am block scoped';
    const anotherBlockScopedVar = 'I am also block scoped';
    console.log(blockScopedVar); // Output: 'I am block scoped'
    console.log(anotherBlockScopedVar); // Output: 'I am also block scoped'
  }

  // Trying to access the block-scoped variables outside their block
  console.log(blockScopedVar); // ReferenceError: blockScopedVar is not defined
  console.log(anotherBlockScopedVar); // ReferenceError: anotherBlockScopedVar is not defined
}

blockScopeExample();`}
        </CodeBlock>

      </div>

      <h2>Function Scope (var)</h2>
      <div>
        <CodeBlock language="javascript" style={atomDark}>
          {`function functionScopeExample() {
  if (true) {
    var functionScopedVar = 'I am function scoped';
    console.log(functionScopedVar); // Output: 'I am function scoped'
  }
  // Accessing the function-scoped variable outside the block
  console.log(functionScopedVar); // Output: 'I am function scoped'
}
functionScopeExample();`}
        </CodeBlock>

      </div>
    </div>
  );
}

export default Variables;
