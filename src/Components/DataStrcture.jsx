import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DataStructure() {

  useEffect(() => {
   window.scrollTo(0,0);
  }, []);

  return (
    <div className='debounce-container'>
      <h1 className="title">JavaScript Data Structures</h1>

      <div className="method-section">
        <h3>4.1 Set</h3>
        <p>
          Definition: A Set is a collection of unique values. It ensures that each value appears only once, making it ideal for storing distinct elements.
        </p>
        <p>
          Syntax: <CodeBlock language="javascript" style={atomDark}>new Set([iterable])</CodeBlock>
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    // Example:
    const numbers = new Set([1, 2, 3, 4, 4, 5]);

    console.log(numbers);
    // Output: Set { 1, 2, 3, 4, 5 }

    // Adding elements
    numbers.add(6);
    console.log(numbers.has(3)); // true

    // Iterating over a Set
    for (let number of numbers) {
        console.log(number);
    }
    // Output:
    // 1
    // 2
    // 3
    // 4
    // 5
    // 6

    // Methods of Set:
    // .add(value)       - Adds a new element with the given value to the Set
    // .delete(value)    - Removes the element associated with the value
    // .has(value)       - Returns a boolean asserting whether an element is present
    // .clear()          - Removes all elements from the Set
    // .size             - Returns the number of elements in the Set
    `}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>4.2 Map</h3>
        <p>
          Definition: A Map is a collection of key-value pairs where both keys and values can be of any type. It maintains the insertion order of the elements.
        </p>
        <p>
          Syntax: <CodeBlock language="javascript" style={atomDark}>new Map([iterable])</CodeBlock>
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    // Example:
    const user = new Map();

    user.set('id', 1);
    user.set('name', 'Guddu');
    user.set('age', 22);

    console.log(user.get('name')); // Guddu

    console.log(user.has('age')); // true

    // Iterating over a Map
    for (let [key, value] of user) {
        console.log(\`\${key}: \${value}\`);
    }
    // Output:
    // id: 1
    // name: Guddu
    // age: 22

    // Methods of Map:
    // .set(key, value)   - Adds or updates an element with the specified key and value
    // .get(key)          - Returns the value associated with the key
    // .has(key)          - Returns a boolean indicating whether an element with the specified key exists
    // .delete(key)       - Removes the specified element
    // .clear()           - Removes all elements from the Map
    // .size              - Returns the number of elements in the Map
    `}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>4.3 WeakSet</h3>
        <p>
          Definition: A WeakSet is similar to a Set, but it only stores objects and does not prevent garbage collection of its items. This is useful for storing objects without affecting their lifecycle.
        </p>
        <p>
          Syntax: <CodeBlock language="javascript" style={atomDark}>new WeakSet([iterable])</CodeBlock>
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    // Example:
    const obj1 = {};
    const obj2 = {};

    const weakSet = new WeakSet([obj1]);

    weakSet.add(obj2);
    console.log(weakSet.has(obj1)); // true
    console.log(weakSet.has(obj2)); // true

    // Removing references allows garbage collection
    obj1 = null;
    // Note: WeakSet does not have methods like size or clear, and cannot be iterated over

    // Methods of WeakSet:
    // .add(value)        - Adds a new object to the WeakSet
    // .delete(value)     - Removes the specified object from the WeakSet
    // .has(value)        - Checks if the object exists in the WeakSet
    `}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>4.4 WeakMap</h3>
        <p>
          Definition: A WeakMap is similar to a Map , but it only allows objects as keys and does not prevent garbage collection of its keys. This is useful for associating data with objects without interfering with their garbage collection.
        </p>
        <p>
          Syntax: <CodeBlock language="javascript" style={atomDark}>new WeakMap([iterable])</CodeBlock>
        </p>
        
          <CodeBlock language="javascript" style={atomDark}>{`
    // Example:
    const obj1 = {};
    const obj2 = {};

    const weakMap = new WeakMap([[obj1, 'Object One']]);

    weakMap.set(obj2, 'Object Two');
    console.log(weakMap.get(obj1)); // Object One
    console.log(weakMap.has(obj2)); // true

    // Removing references allows garbage collection
    obj1 = null;
    // Note: WeakMap does not have methods like size or clear, and cannot be iterated over

    // Methods of WeakMap:
    // .set(key, value)    - Adds or updates a key-value pair
    // .get(key)           - Retrieves the value associated with the key
    // .has(key)           - Checks if the key exists in the WeakMap
    // .delete(key)        - Removes the key-value pair
    `}</CodeBlock>
        
      </div>

      <div className="method-section">
        <h3>4.5 Summary of Data Structures</h3>
        <ul>
          <li>Set: Stores unique values of any type.</li>
          <li>Map: Stores key-value pairs with keys of any type.</li>
          <li>WeakSet: Stores objects with weak references, allowing garbage collection.</li>
          <li>WeakMap: Stores key-value pairs where keys are objects with weak references.</li>
        </ul>
      </div>
    </div>
  );
}

export default DataStructure;
