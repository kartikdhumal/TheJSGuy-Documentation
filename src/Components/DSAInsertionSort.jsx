import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAInsertionSort() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Insertion Sort</h1>
      <p>
        Insertion Sort builds the sorted array one element at a time. It takes each element, finds where it belongs in the already-sorted part (to its left), and inserts it there by shifting larger elements right.
      </p>
      <div className="method-section">
        <h2 className="method-title">Algorithm</h2>
        <ul>
          <li>Start with the second element (first is considered sorted).</li>
          <li>Compare with elements in the sorted part; shift larger ones right.</li>
          <li>Insert the current element in the correct position.</li>
          <li>Repeat for all elements.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Time & Space Complexity</h2>
        <p>Time: O(n²) worst and average; O(n) when already sorted. Space: O(1).</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`function insertionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      j--;
    }
  }
  return arr;
}

const array = [64, 25, 12, 22, 11];
console.log(insertionSort(array)); // [11, 12, 22, 25, 64]`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default DSAInsertionSort;
