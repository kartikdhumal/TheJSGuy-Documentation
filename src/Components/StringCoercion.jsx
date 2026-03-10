import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function StringCoercion() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">String Coercion in JavaScript</h1>
      <p>
        String coercion is the process of converting a value of any type into a string. JavaScript does this implicitly in many contexts (e.g. concatenation with <code>+</code>, template literals) or you can do it explicitly with <code>String()</code> or <code>.toString()</code>. Understanding when and how values become strings helps you avoid bugs and write predictable code.
      </p>

      <div className="method-section">
        <h2 className="method-title">1. What is String Coercion?</h2>
        <p>
          When JavaScript needs a string (for example when you use <code>+</code> with a string, or pass a value to something that expects a string), it converts the value to a string using the abstract operation <strong>ToString</strong>. This conversion is called <strong>string coercion</strong>.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Implicit string coercion: number + string
const num = 42;
const result = num + " apples";  // 42 is coerced to "42"
console.log(result);             // "42 apples"

// Another example: boolean in string context
const flag = true;
console.log("Value is " + flag); // "Value is true"`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">2. Implicit vs Explicit String Coercion</h2>
        <h3>Implicit coercion</h3>
        <p>
          JavaScript automatically converts a value to string when the context requires it. Common triggers:
        </p>
        <ul>
          <li>Binary <code>+</code> when one operand is already a string (string concatenation).</li>
          <li>Template literals: <code>{`\`\${value}\``}`</code>.</li>
          <li>Some built-ins that expect strings (e.g. <code>alert()</code>, <code>document.write()</code>).</li>
        </ul>
        <CodeBlock language="javascript" style={atomDark}>
          {`const a = 10;
const b = "20";
const sum = a + b;        // "10" + "20" → "1020" (number 10 is coerced to "10")
console.log(sum);         // "1020"

const obj = { x: 1 };
console.log("obj: " + obj);  // "obj: [object Object]" (object coerced to string)

const arr = [1, 2, 3];
console.log("arr: " + arr);  // "arr: 1,2,3" (array coerced via .join())`}
        </CodeBlock>

        <h3>Explicit coercion</h3>
        <p>
          You intentionally convert to string using <code>String(value)</code> or <code>value.toString()</code>.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const n = 100;
String(n);        // "100"
n.toString();     // "100"

const isActive = true;
String(isActive); // "true"

const empty = null;
String(empty);    // "null" (the literal string "null")`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">3. How Different Types Coerce to String</h2>
        <p>
          The ToString abstract operation defines how each type becomes a string:
        </p>

        <h3>Primitives</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`String(42);           // "42"
String(3.14);        // "3.14"
String(NaN);         // "NaN"
String(Infinity);    // "Infinity"

String(true);        // "true"
String(false);      // "false"

String("hello");    // "hello" (already a string)
String(undefined);  // "undefined" (the word "undefined")
String(null);       // "null" (the word "null")

const sym = Symbol("id");
String(sym);         // "Symbol(id)" (or throws in older envs without Symbol.toStringTag)`}
        </CodeBlock>

        <h3>Objects and Arrays</h3>
        <p>
          For objects, JavaScript uses the internal <code>[[ToString]]</code> which typically calls <code>toString()</code>. Plain objects default to <code>"[object Object]"</code>. Arrays override <code>toString()</code> to behave like <code>join(",")</code>.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`String({});                    // "[object Object]"
String({ name: "Kartik" });     // "[object Object]"

String([1, 2, 3]);              // "1,2,3"
String([1, null, "a"]);         // "1,,a"
String([]);                     // ""`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">4. The + Operator and String Coercion</h2>
        <p>
          <code>+</code> is both addition (numbers) and concatenation (strings). If either operand is a string, the other is coerced to string and the result is a string. Order matters only for which value gets coerced first.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`"5" + 3;        // "53" (3 → "3", then concatenate)
5 + "3";        // "53" (5 → "5", then concatenate)
5 + 3;          // 8 (both numbers, numeric addition)

"10" + true;    // "10true"
"10" + null;    // "10null"
"10" + undefined; // "10undefined"

// Be careful: multiple + can change behavior left to right
1 + 2 + "3";    // "33"  (1+2=3, then 3+"3" → "33")
"1" + 2 + 3;    // "123" ("1"+2 → "12", then "12"+3 → "123")`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">5. Template Literals and String Coercion</h2>
        <p>
          In template literals, each expression inside <code>${}</code> is converted to string using the same ToString rules. This is explicit and readable.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const count = 5;
const item = "apples";
console.log(\`I have \${count} \${item}\`);  // "I have 5 apples"

const user = { name: "Kartik", age: 22 };
console.log(\`User: \${user}\`);             // "User: [object Object]"

// For objects you usually want a specific property or JSON
console.log(\`User: \${user.name}, Age: \${user.age}\`);
console.log(\`Data: \${JSON.stringify(user)}\`);`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">6. .toString() Method</h2>
        <p>
          Most values have a <code>.toString()</code> method. <code>null</code> and <code>undefined</code> do not—calling <code>null.toString()</code> or <code>undefined.toString()</code> throws. Use <code>String(x)</code> when the value might be <code>null</code> or <code>undefined</code>.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`(42).toString();      // "42"
true.toString();     // "true"
[1, 2].toString();   // "1,2"

// These throw!
// null.toString();     // TypeError
// undefined.toString(); // TypeError

// Safe: String() works for null and undefined
String(null);         // "null"
String(undefined);    // "undefined"`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">7. Practical Examples</h2>
        <h3>Building URLs or messages</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`const userId = 101;
const baseUrl = "https://api.example.com/users/";
const url = baseUrl + userId;  // "https://api.example.com/users/101"

const name = "Kartik";
const score = 95;
const message = name + " scored " + score + " out of 100.";
// "Kartik scored 95 out of 100."`}
        </CodeBlock>

        <h3>Debugging and logging</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`const data = { id: 1, name: "Test" };
console.log("Received: " + data);           // "Received: [object Object]"
console.log("Received: " + JSON.stringify(data)); // "Received: {\"id\":1,\"name\":\"Test\"}"`}
        </CodeBlock>

        <h3>Avoiding accidental string concatenation</h3>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Form inputs often give strings
const input1 = "10";  // from <input>
const input2 = "20";
const wrong = input1 + input2;   // "1020" (string concat)
const correct = Number(input1) + Number(input2);  // 30

// When you need numbers, convert explicitly
const sum = +input1 + +input2;   // 30 (unary + coerces to number)`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">8. Best Practices</h2>
        <ul>
          <li>Use <code>String(value)</code> when you want a string and the value might be <code>null</code> or <code>undefined</code>—it never throws.</li>
          <li>Use template literals for building strings—they make coercion explicit and readable.</li>
          <li>Be careful with <code>+</code>: if any operand is a string, you get concatenation, not addition. Convert to number first when you need math (<code>Number(x)</code>, <code>+x</code>, or <code>parseInt</code>/<code>parseFloat</code>).</li>
          <li>For objects, don't rely on default <code>[object Object]</code>—use specific properties or <code>JSON.stringify()</code> when you need a meaningful string.</li>
        </ul>
      </div>
    </div>
  );
}

export default StringCoercion;
