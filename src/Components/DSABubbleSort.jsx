import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSABubbleSort() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Bubble Sort</h1>
      <p>
        Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass is repeated until no swaps are needed. Smaller elements "bubble" toward the start of the array.
      </p>
      <div className="method-section">
        <h2 className="method-title">Algorithm</h2>
        <ul>
          <li>Start from the beginning of the array.</li>
          <li>Compare adjacent elements; if the first is greater than the second, swap them.</li>
          <li>Move to the next pair and repeat until the end of the array.</li>
          <li>Repeat these passes until no swaps are needed.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Time & Space Complexity</h2>
        <p>Time: O(n²) in worst and average case; O(n) when the array is already sorted. Space: O(1).</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array)); // [11, 12, 22, 25, 34, 64, 90]`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default DSABubbleSort;
