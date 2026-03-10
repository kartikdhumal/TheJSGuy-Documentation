import React, { useEffect } from 'react';

import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ArrayMethods() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">JavaScript Array Methods</h1>

      <section className="method-section">
        <h2 className="method-title">1. Length</h2>
        <p>The length property returns or sets the number of elements in an array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let length = array.length;
console.log(length);`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">2. push()</h2>
        <p>The push() method adds one or more elements to the end of an array and returns the new length of the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let array = [1, 2, 3];
array.push(4);
console.log(array); // [1, 2, 3, 4]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">3. pop()</h2>
        <p>The pop() method removes the last element from an array and returns that element.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let last = array.pop();
console.log(last); // 4`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">4. shift()</h2>
        <p>The shift() method removes the first element from an array and returns that element.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let first = array.shift();
console.log(first); // 1`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">5. unshift()</h2>
        <p>The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.unshift(0);
console.log(array); // [0, 2, 3]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">6. slice()</h2>
        <p>The slice() method returns a shallow copy of a portion of an array into a new array object selected from start to end.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let slicedArray = array.slice(1, 3);
console.log(slicedArray); // [2, 3]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">7. splice()</h2>
        <p>The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.splice(1, 1, 'newItem');
console.log(array); // [0, 'newItem', 3]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">8. forEach()</h2>
        <p>The forEach() method executes a provided function once for each array element.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.forEach(item => {
  console.log(item);
});`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">9. map()</h2>
        <p>The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let doubled = array.map(item => item * 2);
console.log(doubled); // [0, 4, 6]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">10. filter()</h2>
        <p>The filter() method creates a new array with all elements that pass the test implemented by the provided function.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let evens = array.filter(item => item % 2 === 0);
console.log(evens); // [0, 2]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">11. reduce()</h2>
        <p>The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let sum = array.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum);`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">12. find()</h2>
        <p>The find() method returns the value of the first element in the provided array that satisfies the provided testing function.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let found = array.find(item => item > 1);
console.log(found); // 2`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">13. indexOf()</h2>
        <p>The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let index = array.indexOf(2);
console.log(index); // 1`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">14. includes()</h2>
        <p>The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let hasTwo = array.includes(2);
console.log(hasTwo); // true`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">15. concat()</h2>
        <p>The concat() method is used to merge two or more arrays.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let newArray = array.concat([5, 6]);
console.log(newArray); // [0, 2, 3, 5, 6]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">16. join()</h2>
        <p>The join() method joins all elements of an array into a string.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let joined = array.join(', ');
console.log(joined); // "0, 2, 3"`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">17. every()</h2>
        <p>The every() method tests whether all elements in the array pass the test implemented by the provided function.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let allPositive = array.every(item => item > 0);
console.log(allPositive); // false`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">18. some()</h2>
        <p>The some() method tests whether at least one element in the array passes the test implemented by the provided function.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let hasNegative = array.some(item => item < 0);
console.log(hasNegative); // false`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">19. reverse()</h2>
        <p>The reverse() method reverses the elements of an array in place.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.reverse();
console.log(array); // [3, 2, 0]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">20. sort()</h2>
        <p>The sort() method sorts the elements of an array in place and returns the sorted array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.sort((a, b) => a - b);
console.log(array); // [0, 2, 3]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">21. flat()</h2>
        <p>The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let nestedArray = [1, [2, [3, 4]]];
let flatArray = nestedArray.flat(2);
console.log(flatArray); // [1, 2, 3, 4]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">22. findIndex()</h2>
        <p>The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let index = array.findIndex(item => item > 1);
console.log(index); // 1`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">23. fill()</h2>
        <p>The fill() method fills all the elements of an array from a start index to an end index with a static value.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.fill(0);
console.log(array); // [0, 0, 0]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">24. copyWithin()</h2>
        <p>The copyWithin() method shallow copies part of an array to another location in the same array and returns it without modifying its length.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`array.copyWithin(1, 0);
console.log(array); // [0, 0, 3]`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">25. toString()</h2>
        <p>The toString() method returns a string representing the specified array and its elements.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let stringArray = array.toString();
console.log(stringArray); // "0,0,3"`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">26. entries()</h2>
        <p>The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let iterator = array.entries();
for (let entry of iterator) {
  console.log(entry); // [index, value]
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">27. keys()</h2>
        <p>The keys() method returns a new Array Iterator object that contains the keys for each index in the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let keysIterator = array.keys();
for (let key of keysIterator) {
  console.log(key); // index
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">28. values()</h2>
        <p>The values() method returns a new Array Iterator object that contains the values for each index in the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let valuesIterator = array.values();
for (let value of valuesIterator) {
  console.log(value); // value
}`}
          </CodeBlock>
        
      </section>
      <section className="method-section">
        <h2 className="method-title">29. keys()</h2>
        <p>The keys() method returns a new Array Iterator object that contains the keys for each element in the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let keysIterator = array.keys();
for (let key of keysIterator) {
  console.log(key); // key
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">30. values()</h2>
        <p>The values() method returns a new Array Iterator object that contains the values for each index in the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let valuesIterator = array.values();
for (let value of valuesIterator) {
  console.log(value); // value
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">31. Array.from()</h2>
        <p>The Array.from() method creates a new array from any array-like or iterable object.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let newArray = Array.from("Sweety");
console.log(newArray); // ["S", "h", "r", "a", "d", "d", "h", "a"]
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">32. constructor</h2>
        <p>The constructor property returns the constructor function for the array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let constructorFunc = array.constructor;
console.log(constructorFunc); // function Array() { [native code] }
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">33. copyWithin()</h2>
        <p>The copyWithin() method copies array elements from one position to another in the given array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`console.log(array);
array.copyWithin(0, 2);
console.log(array); // modifies array by copying elements
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">34. toLocaleString()</h2>
        <p>The Array.toLocaleString() method returns a string representing the elements of the array in a particular locale.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let localeString = array.toLocaleString();
console.log(localeString); // returns string representation of array
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">35. flat()</h2>
        <p>The flat() method creates a new array by flattening a nested array up to the specified depth.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let nestedArray = [10, [20, 30, [40, 50, 60]]];
let flattenedArray = nestedArray.flat(2);
console.log(flattenedArray); // [10, 20, 30, 40, 50, 60]
}`}
          </CodeBlock>
        
      </section>

      <section className="method-section">
        <h2 className="method-title">36. flatMap()</h2>
        <p>The flatMap() method first maps each element of an array using a mapping function, then flattens it into a new array.</p>
        
          <CodeBlock language="javascript" style={atomDark}>
            {`let crushes = ["Alice", "Bob"];
let beautifulCrushes = crushes.flatMap(crush => {
  return "Beautiful " + crush.toUpperCase() + " ❤️";
});
console.log(beautifulCrushes); // ["Beautiful ALICE ❤️", "Beautiful BOB ❤️"]
}`}
          </CodeBlock>
        
      </section>

    </div>
  );
}

export default ArrayMethods;
