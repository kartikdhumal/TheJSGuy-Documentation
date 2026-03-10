import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAQuickSort() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Quick Sort</h1>
      <p>
        Quick Sort picks a pivot (e.g. last element), partitions the array into elements less than and greater than the pivot, then recursively sorts the two parts.
      </p>
      <div className="method-section">
        <h2 className="method-title">Algorithm</h2>
        <ul>
          <li>Choose a pivot (here we use the last element).</li>
          <li>Partition: put smaller elements to the left, larger to the right of the pivot.</li>
          <li>Recursively quick-sort the left and right parts.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Time & Space Complexity</h2>
        <p>Time: O(n log n) on average; O(n²) in the worst case. Space: O(log n) for the recursion stack.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array)); // [11, 12, 22, 25, 34, 64, 90]`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSAQuickSort;
