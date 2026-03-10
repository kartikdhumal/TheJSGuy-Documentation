import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DSAMergeSort() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Merge Sort</h1>
      <p>
        Merge Sort divides the array into halves, recursively sorts each half, then merges the two sorted halves into one sorted array.
      </p>
      <div className="method-section">
        <h2 className="method-title">Algorithm</h2>
        <ul>
          <li>Divide the array into two halves.</li>
          <li>Recursively merge-sort each half (until length is 1).</li>
          <li>Merge the two sorted halves by comparing and picking the smaller element each time.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Time & Space Complexity</h2>
        <p>Time: O(n log n) in all cases. Space: O(n) for the temporary arrays used while merging.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Implementation</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

const array = [64, 34, 25, 12, 22, 11, 90];
console.log(mergeSort(array)); // [11, 12, 22, 25, 34, 64, 90]`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DSAMergeSort;
