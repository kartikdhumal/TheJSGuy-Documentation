import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSASelectionSort() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Selection Sort</h1>
      <p>
        Selection Sort splits the list into a sorted part (built from the left) and an unsorted part. In each step it finds the smallest element in the unsorted part and swaps it to the end of the sorted part.
      </p>
      <div className="method-section">
        <h2 className="method-title">Algorithm</h2>
        <ul>
          <li>Assume the first element is the minimum; compare with the rest.</li>
          <li>If a smaller element is found, update the minimum.</li>
          <li>After one pass, swap the minimum with the first position of the unsorted part.</li>
          <li>Repeat until the whole array is sorted.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Time & Space Complexity</h2>
        <p>Time: O(n²) in all cases. Space: O(1).</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

const array = [64, 25, 12, 22, 11];
console.log(selectionSort(array)); // [11, 12, 22, 25, 64]`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default DSASelectionSort;
