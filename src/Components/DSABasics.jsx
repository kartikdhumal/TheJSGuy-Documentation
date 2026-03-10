import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';

function DSABasics() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Basics – Data Structures & Algorithms</h1>
      <p>
        This page answers common interview questions in simple English. Use it to revise definitions and ideas before going into each topic in detail (like Bubble Sort, Stack, etc.).
      </p>

      <div className="method-section">
        <h2 className="method-title">What is a Data Structure?</h2>
        <p className="faq-answer">
          A data structure is a way to store and organize data so that we can use it efficiently. Think of it like how you arrange things in a cupboard: you can keep everything in one big box (array), or in a line where each item points to the next (linked list), or in a stack like plates (last kept on top is taken first). Common examples are arrays, linked lists, stacks, queues, trees, and graphs.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is an Algorithm?</h2>
        <p className="faq-answer">
          An algorithm is a clear set of steps to solve a problem. It’s like a recipe: do step 1, then step 2, and so on, until you get the result. We can write it in plain English, pseudocode, or code. For example, “to find the smallest number in a list, go through each number and remember the smallest so far” is an algorithm.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is Time Complexity?</h2>
        <p className="faq-answer">
          Time complexity tells us how the running time of an algorithm grows when the input size grows. We use Big O notation for it, like O(n) or O(n²). For example, if we go through an array once, time is roughly proportional to the number of elements, so we say O(n). If we use two nested loops over the same array, it’s often O(n²). It helps us compare which algorithm is faster for large inputs.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is Space Complexity?</h2>
        <p className="faq-answer">
          Space complexity tells us how much extra memory an algorithm needs compared to the size of the input. We also use Big O for this. For example, if we only use a few variables no matter how big the input is, we say O(1). If we copy the whole input into another structure of the same size, we say O(n). It helps us know if an algorithm will run out of memory on big inputs.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is an Array?</h2>
        <p className="faq-answer">
          An array is a list of items stored one after another in memory. Each item has an index (position), like 0, 1, 2. So you can quickly reach any position if you know the index. Adding or removing from the end is usually fast; adding or removing in the middle can mean shifting other elements.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is a Linked List?</h2>
        <p className="faq-answer">
          A linked list is a chain of nodes. Each node holds a value and a link to the next node. So items are not stored in one block of memory; they can be anywhere, connected by these links. Adding or removing in the middle can be easy (just change links), but to reach the 5th item you have to walk from the first node step by step. There is also a doubly linked list where each node has a link to the previous one too, so you can move forward and backward.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is a Stack?</h2>
        <p className="faq-answer">
          A stack is like a pile of plates: the last plate you put on top is the first one you take off. So we say Last In, First Out (LIFO). You add with “push” and remove with “pop.” You can also “peek” to see the top without removing it. Used in undo in editors, back button in browser, and expression evaluation.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is a Queue?</h2>
        <p className="faq-answer">
          A queue is like a line at a ticket counter: the first person who joined the line is the first one served. So we say First In, First Out (FIFO). You add at the back with “enqueue” and remove from the front with “dequeue.” Used in task scheduling, printing jobs, and BFS in graphs.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is a Tree?</h2>
        <p className="faq-answer">
          A tree is a structure where we have a root node at the top and each node can have children below it. So it’s like a family tree or a folder structure on your computer. There are no cycles (you can’t go down and come back to the same node by following edges). Common types are binary tree (each node has at most two children), binary search tree (left smaller, right larger), and balanced trees for fast operations.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What is a Graph?</h2>
        <p className="faq-answer">
          A graph is a set of nodes (vertices) connected by edges. Unlike a tree, you can have cycles and any connection pattern. It can be directed (one-way like follow on social media) or undirected (two-way like friendship). We use graphs for maps, social networks, and dependency networks. We store them as adjacency list (each node has a list of neighbors) or adjacency matrix (a 2D table showing who is connected to whom).
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What are Sorting Algorithms?</h2>
        <p className="faq-answer">
          Sorting algorithms take a list of items and arrange them in order (smallest to largest or alphabetically, etc.). Examples you will often see: Bubble Sort (compare neighbors and swap), Selection Sort (pick smallest and put at front), Insertion Sort (build sorted part by inserting one by one), Merge Sort (split, sort halves, merge), and Quick Sort (pick pivot, partition, then sort left and right). They differ in speed and memory use, which we describe with time and space complexity.
        </p>
      </div>

      <div className="method-section">
        <h2 className="method-title">What are Searching Algorithms?</h2>
        <p className="faq-answer">
          Searching algorithms find whether an item is in a data structure and sometimes where it is. Linear search goes through the list one by one until you find the item or reach the end—works on any list but can be slow for large data. Binary search works only on sorted arrays: you keep checking the middle and discarding half of the remaining part, so it’s much faster, in the order of log(n) steps.
        </p>
      </div>
    </div>
  );
}

export default DSABasics;
