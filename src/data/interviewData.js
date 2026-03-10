// Technical Interview Q&A: answers in simple English, JavaScript examples where needed

export const interviewSections = [
  {
    title: "JavaScript",
    questions: [
      {
        q: "What is the difference between null and undefined?",
        a: "undefined means a variable was declared but no value was given yet, or a function returned nothing. null is a value you set on purpose to mean 'no value' or 'empty'. So undefined is 'not assigned'; null is 'explicitly empty'.",
        code: `let a;\nconsole.log(a);        // undefined\nlet b = null;\nconsole.log(b);        // null`
      },
      {
        q: "Explain the difference between var, let, and const",
        a: "var is function-scoped and can be redeclared; it is also hoisted. let and const are block-scoped (only inside {}). let can be reassigned; const cannot be reassigned (but you can still change properties of an object). Prefer const by default, use let when you need to reassign, avoid var in new code.",
        code: `let y = 1;\ny = 2;       // allowed\nconst z = 1;\nconst obj = { a: 1 };\nobj.a = 2;   // allowed`
      },
      {
        q: "What is temporal dead zone in JavaScript?",
        a: "The temporal dead zone (TDZ) is the time between when a block starts and when a let or const variable is declared. In that zone you cannot use the variable—accessing it throws a ReferenceError.",
        code: `console.log(a);  // ReferenceError (TDZ)\nlet a = 10;`
      },
      {
        q: "What is hoisting in JavaScript?",
        a: "Hoisting means that variable and function declarations are moved to the top of their scope by the engine before code runs. So you can call a function before its declaration in the code. var is hoisted (and initialized with undefined); let and const are hoisted but not initialized until their line (TDZ).",
        code: `sayHi();  // works: "Hi"\nfunction sayHi() { console.log("Hi"); }`
      },
      {
        q: "Explain event bubbling and capturing",
        a: "When you click an element, the event can be handled in two phases. Capturing: the event goes from the root down to the target. Bubbling: the event goes from the target back up to the root. By default handlers run in the bubbling phase.",
        code: `divInner.addEventListener('click', (e) => {\n  e.stopPropagation(); // stop bubbling\n});`
      },
      {
        q: "What is event delegation and why is it useful?",
        a: "Event delegation means you attach one listener to a parent and handle events from children. Because events bubble, the parent sees clicks on its children. This way you don't need a listener on every child—useful for dynamic lists.",
        code: `document.getElementById('list').addEventListener('click', (e) => {\n  if (e.target.matches('li')) console.log(e.target.textContent);\n});`
      },
      {
        q: "What are closures and how do they work?",
        a: "A closure is when a function remembers the variables from where it was created, even after that outer function has finished. The inner function 'closes over' those variables.",
        code: `function makeCounter() {\n  let count = 0;\n  return function () { return ++count; };\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2`
      },
      {
        q: "Explain the 'this' keyword and its behavior",
        a: "this is the context in which a function runs. In a method it is the object. In a normal function call it is the global (or undefined in strict mode). Arrow functions don't have their own this—they use the this from the surrounding scope.",
        code: `const obj = {\n  name: 'Kartik',\n  greet() { console.log(this.name); }\n};\nobj.greet();  // Kartik\nconst g = obj.greet;\ng();  // undefined - this is lost`
      },
      {
        q: "What is function currying?",
        a: "Currying is when a function that takes multiple arguments is turned into a sequence of functions that each take one argument. So instead of f(a, b, c) you get f(a)(b)(c).",
        code: `function add(a) {\n  return function (b) { return a + b; };\n}\nconst add5 = add(5);\nadd5(3);  // 8`
      },
      {
        q: "Difference between arrow functions and regular functions",
        a: "Arrow functions don't have their own this (they use the outer this), don't have arguments, and can't be used as constructors (no new). Regular functions have their own this and arguments.",
        code: `const obj = {\n  regular: function () { console.log(this); },\n  arrow: () => console.log(this)\n};\nobj.regular();  // obj\nobj.arrow();   // outer this`
      },
      {
        q: "Difference between map, forEach, filter, and reduce",
        a: "map returns a new array by transforming each element. forEach runs a function on each element but returns undefined. filter returns a new array with only elements that pass a test. reduce turns the array into a single value.",
        code: `[1,2,3].map(x => x * 2);     // [2,4,6]\n[1,2,3].filter(x => x > 1);  // [2,3]\n[1,2,3].reduce((a,b) => a + b, 0);  // 6`
      },
      {
        q: "Explain shallow copy vs deep copy",
        a: "Shallow copy copies the top level only. Nested objects or arrays are still shared. Deep copy copies every level so nothing is shared. Use spread for shallow; use JSON.parse(JSON.stringify(obj)) or structuredClone(obj) for deep (when safe).",
        code: `const shallow = { ...original };\nconst deep = structuredClone(original);`
      },
      {
        q: "What is the difference between Promise and async/await?",
        a: "Both handle asynchronous work. Promises use .then() and .catch(). async/await lets you write async code like normal code: you await a Promise and use try/catch for errors. Under the hood async/await uses Promises.",
        code: `async function getData() {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (err) { console.error(err); }\n}`
      },
      {
        q: "Explain Promise.all(), Promise.race(), Promise.allSettled()",
        a: "Promise.all waits for all to succeed; if any fails, it rejects. Promise.race settles when the first Promise settles. Promise.allSettled waits for all and returns an array of { status, value/reason } for each.",
        code: `Promise.all([p1, p2]).then(([a,b]) => console.log(a,b));\nPromise.race([p1, p2]).then(r => r);`
      },
      {
        q: "What is callback hell and how to avoid it?",
        a: "Callback hell is when you nest many callbacks, making code hard to read. Avoid it by using Promises and async/await, or by using named functions instead of nesting.",
        code: `async function run() {\n  const a = await getData();\n  const b = await getMore(a);\n  return b;\n}`
      },
      {
        q: "How does event loop work in JavaScript?",
        a: "JavaScript runs in a single thread. When you start an async task, the browser or Node does it in the background. When it finishes, the callback is put in a queue. The event loop runs callbacks when the call stack is empty. Microtasks (Promises) run before macrotasks (setTimeout).",
        code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2`
      },
      {
        q: "What are microtasks and macrotasks?",
        a: "Macrotasks are setTimeout, setInterval, I/O. Microtasks are Promise callbacks and queueMicrotask. The event loop runs all microtasks after each macrotask before the next macrotask.",
      },
      {
        q: "How to check if an object is empty?",
        a: "Check that the object has no own keys: Object.keys(obj).length === 0.",
        code: `function isEmpty(obj) {\n  return Object.keys(obj).length === 0;\n}`
      },
      {
        q: "What is object destructuring?",
        a: "Destructuring lets you take properties from an object and assign them to variables in one line. You can rename with colon and set defaults with =.",
        code: `const { name, age } = user;\nconst { name: n, city = 'Mumbai' } = user;`
      },
      {
        q: "Implement debounce function",
        a: "Debounce returns a function that waits for a delay. If it is called again before the delay ends, the timer resets. Only after the user stops calling for that delay does the original function run.",
        code: `function debounce(fn, delay) {\n  let timerId;\n  return function (...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`
      },
      {
        q: "What is Virtual DOM?",
        a: "The Virtual DOM is a lightweight copy of the real DOM kept in memory (as plain JavaScript objects). When state changes, the library builds a new virtual DOM, compares it with the previous one (diffing), and updates only the changed parts in the real DOM. This reduces expensive DOM operations."
      },
      {
        q: "Explain createElement vs innerHTML",
        a: "createElement creates real DOM nodes step by step; it is safe from XSS because you don't inject raw HTML. innerHTML sets HTML as a string; it is faster for big chunks but dangerous if the string comes from users (XSS). Use createElement or textContent for safe content."
      },
      {
        q: "What is memoization?",
        a: "Memoization means storing the result of an expensive function for given inputs and returning that stored result when the same inputs come again. It avoids repeating the same work. Often done with a cache object keyed by arguments."
      },
      {
        q: "How to handle memory leaks?",
        a: "Avoid keeping references to DOM nodes or large data when you don't need them. Clear intervals and timeouts in cleanup. Remove event listeners when the component unmounts. In React, clear subscriptions and timers in useEffect's return function."
      },
      {
        q: "Different types of errors in JavaScript",
        a: "SyntaxError (invalid syntax), ReferenceError (variable not found), TypeError (wrong type, e.g. calling undefined), RangeError (e.g. invalid array length). You can also throw your own errors with throw new Error('message')."
      },
      {
        q: "What are template literals?",
        a: "Template literals use backticks and ${} to embed expressions in a string. They support multi-line strings and are easier to read than concatenation.",
        code: `const name = 'Kartik';\nconst msg = \`Hello, \${name}!\`;\nconst multi = \`Line 1\nLine 2\`;`
      },
      {
        q: "What are Sets and Maps?",
        a: "Set stores unique values (no duplicates). Map stores key-value pairs; keys can be any type (unlike objects where keys are strings/symbols). Both preserve insertion order.",
        code: `const set = new Set([1, 2, 2, 3]);  // Set(3) { 1, 2, 3 }\nconst map = new Map([['a', 1], ['b', 2]]);\nmap.get('a');  // 1`
      },
      {
        q: "What is the Fetch API?",
        a: "Fetch is a browser API to make HTTP requests. It returns a Promise that resolves to the Response. You call .json() or .text() on the response to get the body. Use try/catch or .catch() for errors.",
        code: `const res = await fetch(url);\nconst data = await res.json();`
      },
      {
        q: "What is CORS?",
        a: "CORS (Cross-Origin Resource Sharing) is a browser rule: a page on one origin (domain/port) can only call an API on another origin if the server sends the right headers (e.g. Access-Control-Allow-Origin). Without it, the browser blocks the response for security."
      },
      {
        q: "What are cookies? How to set/get them?",
        a: "Cookies are small pieces of data the server asks the browser to store and send back with every request to that domain. You can set them via Set-Cookie header (server) or document.cookie (client). Get with document.cookie (returns a string of all cookies)."
      },
    ],
  },
  {
    title: "React.js",
    questions: [
      { q: "Functional vs Class Components", a: "Functional components are plain functions that take props and return JSX. Class components extend React.Component and can have state and lifecycle methods. React now prefers functional components with Hooks (useState, useEffect) instead of class state and lifecycles." },
      { q: "useMemo in React", a: "useMemo lets you remember a computed value. You pass a function and a dependency array; React recomputes only when a dependency changes. Use it to avoid expensive calculations on every render." },
      { q: "React Performance Optimization", a: "Use React.memo for components that re-render often with the same props. Use useMemo for expensive computations and useCallback for callbacks passed to memoized children. Use code splitting (lazy) for big chunks." },
      { q: "Props in React", a: "Props are inputs passed from parent to child. They are read-only; the child must not change them. You pass props as attributes in JSX and receive them as the first argument in a function component." },
      { q: "Error Boundaries", a: "Error boundaries are class components that use getDerivedStateFromError and componentDidCatch to catch JavaScript errors in the tree below them. They show a fallback UI instead of crashing the whole app. They don't catch errors in event handlers or async code." },
      { q: "Server-Side Rendering", a: "SSR means the server generates HTML for each request so the user sees content sooner. In React you use a framework like Next.js or renderToString from react-dom/server. Then the client 'hydrates' the page to make it interactive." },
      { q: "React Children Props", a: "children is a special prop: whatever you put between the opening and closing tags of a component is passed as props.children. So <Card>Hello</Card> gives Card props.children === 'Hello'." },
      { q: "What is a Reference in React?", a: "A ref (useRef or createRef) holds a mutable value that persists across renders. Often ref.current is set to a DOM node so you can focus it or call imperative methods. Refs don't trigger re-renders when they change." },
      { q: "useRef in React", a: "useRef(initialValue) returns an object { current: initialValue }. Updating .current does not cause a re-render. Common uses: storing a DOM node, keeping a previous value, or holding a timer/id for cleanup." },
      { q: "What is Flux?", a: "Flux is an architecture pattern: data flows in one direction. Actions go to a Dispatcher, then to Stores, then the View updates. Redux is inspired by Flux but with a single store and reducers." },
    ],
  },
  {
    title: "Node.js & Express",
    questions: [
      { q: "Cluster in Node.js", a: "The cluster module lets you run multiple processes that share the same server port so you use more than one CPU core. The primary process forks workers; each worker runs your app. If one crashes, you can restart it." },
      { q: "Middleware in Express", a: "Middleware is a function that runs between receiving the request and sending the response. It has access to req, res, and next. It can change req/res, end the request, or call next() to pass control to the next middleware. Examples: body parser, auth check, logging." },
      { q: "Async/Await in Node.js", a: "Node supports async/await. Use it in route handlers and other async code. Always use try/catch or .catch() so Promise rejections don't crash the process." },
      { q: "Event Loop", a: "Node's event loop handles I/O without blocking. When you start an async operation, Node runs it in the background and runs your callback when it's done. So one thread can serve many requests." },
    ],
  },
  {
    title: "MongoDB & MySQL",
    questions: [
      { q: "LEFT JOIN in SQL", a: "LEFT JOIN returns all rows from the left table and matching rows from the right table. If there is no match on the right, those columns are NULL. Use it when you want to keep all records from the left table." },
      { q: "Inner Join vs Left Join", a: "INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (NULLs when no match)." },
      { q: "Indexes in MySQL", a: "An index speeds up search and sort on a column. Without an index the database scans the whole table. Create indexes on columns you filter or join on. Too many indexes slow down writes." },
      { q: "MongoDB Aggregate Functions", a: "Aggregation in MongoDB processes documents in stages (pipeline). You use $match, $group, $sort, $project. $group often uses $sum, $avg, $min, $max. So you can do 'group by category and count' or 'average price per region'." },
      { q: "ACID Properties in Database", a: "ACID means: Atomicity (transaction is all or nothing), Consistency (rules stay valid), Isolation (concurrent transactions don't see uncommitted data), Durability (once committed, data survives a crash)." },
      { q: "Difference between MongoDB and MySQL", a: "MongoDB is a NoSQL document store; data is in JSON-like documents. MySQL is a relational database with tables and rows. MongoDB is flexible for changing schemas; MySQL is good for structured data and complex queries with JOINs." },
    ],
  },
  {
    title: "DSA - Array",
    questions: [
      { q: "Reverse an array", a: "Swap elements from both ends moving inward using two pointers (left and right).", code: `function reverse(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++; right--;\n  }\n  return arr;\n}` },
      { q: "Find the maximum element in an array", a: "Loop through and keep the largest value seen. Or use Math.max(...arr).", code: `let m = arr[0];\nfor (const n of arr) if (n > m) m = n;\nreturn m;` },
      { q: "Find the minimum element in an array", a: "Same as max but keep the smallest. Or use Math.min(...arr)." },
      { q: "Find the sum of all elements in an array", a: "Use reduce to add all numbers.", code: `const sum = arr.reduce((acc, n) => acc + n, 0);` },
      { q: "Remove duplicates from an array", a: "Use a Set to keep unique values.", code: `const unique = [...new Set(arr)];` },
      { q: "Two-sum: two numbers that add up to a target", a: "Use a Map: for each number, check if (target - number) is already seen; if yes return true.", code: `function twoSum(arr, target) {\n  const seen = new Map();\n  for (const n of arr) {\n    if (seen.has(target - n)) return true;\n    seen.set(n, true);\n  }\n  return false;\n}` },
      { q: "Maximum sum of contiguous subarray (Kadane's Algorithm)", a: "Keep current sum and max sum. For each element, either add it to current or start fresh. Update max when current is larger.", code: `let maxSum = arr[0], curr = arr[0];\nfor (let i = 1; i < arr.length; i++) {\n  curr = Math.max(arr[i], curr + arr[i]);\n  maxSum = Math.max(maxSum, curr);\n}\nreturn maxSum;` },
      { q: "Binary search on a sorted array", a: "Keep left and right. Compare target with mid; if equal return mid; if target < mid search left, else search right.", code: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (target < arr[mid]) right = mid - 1;\n    else left = mid + 1;\n  }\n  return -1;\n}` },
      { q: "Rotate an array by k positions", a: "Reverse the whole array, then reverse first k elements, then reverse the rest.", code: `const reverse = (a, i, j) => { while (i < j) [a[i], a[j]] = [a[j], a[i]], i++, j--; };\nreverse(arr, 0, arr.length - 1);\nreverse(arr, 0, k - 1);\nreverse(arr, k, arr.length - 1);` },
      { q: "Find the occurrence of an integer in the array", a: "Loop and count how many times the number appears, or use reduce.", code: `arr.filter(x => x === target).length;` },
      { q: "Merge two sorted arrays", a: "Use two pointers; at each step pick the smaller of the two current elements and push to result.", code: `const merge = (a, b) => {\n  const out = []; let i = 0, j = 0;\n  while (i < a.length && j < b.length)\n    out.push(a[i] <= b[j] ? a[i++] : b[j++]);\n  return out.concat(a.slice(i), b.slice(j));\n};` },
      { q: "Sort array of 0s, 1s, and 2s (Dutch National Flag)", a: "Use three pointers: low, mid, high. Keep 0s at left, 2s at right, 1s in middle. Swap based on value at mid." },
      { q: "Find the missing number in an array of n-1 integers (1 to n)", a: "Sum of 1 to n is n*(n+1)/2. Subtract the sum of the array to get the missing number.", code: `const n = arr.length + 1;\nconst total = (n * (n + 1)) / 2;\nreturn total - arr.reduce((a, b) => a + b, 0);` },
      { q: "Check if an array is sorted", a: "Loop and check that every element is less than or equal to the next (for ascending).", code: `for (let i = 0; i < arr.length - 1; i++)\n  if (arr[i] > arr[i + 1]) return false;\nreturn true;` },
      { q: "Find the average of all elements in an array", a: "Sum all elements and divide by length.", code: `arr.reduce((a, b) => a + b, 0) / arr.length` },
      { q: "Move all negative elements to one side of the array", a: "Use two pointers or partition like in Quick Sort: keep a pointer for the position where the next negative should go; swap when you find a negative." },
      { q: "Find duplicates in an array", a: "Use a Set: if you've seen the number before, it's a duplicate. Or sort and check adjacent pairs.", code: `const seen = new Set();\nconst dupes = [];\nfor (const n of arr) {\n  if (seen.has(n)) dupes.push(n);\n  else seen.add(n);\n}` },
      { q: "Find the first repeating element", a: "Loop and keep a Set of seen elements. The first time you see an element that's already in the Set, return it." },
      { q: "Find the first non-repeating element", a: "Count frequency of each element (object or Map). Then loop again and return the first element with count 1." },
      { q: "Find Kth largest and Kth smallest", a: "Sort the array and pick the kth from the end (largest) or start (smallest). For better time, use a heap or quick-select." },
      { q: "Subarray with given sum", a: "Sliding window or prefix sum + Map. For positive numbers only, expand window when sum is less than target, shrink when more." },
      { q: "Find all pairs that sum to a specific value", a: "Use a Map: for each element, check if (target - element) exists in the Map; if yes you have a pair. Store each number in the Map as you go." },
      { q: "Flatten a nested array", a: "Use recursion or flat(). For one level: arr.flat(). For any depth: arr.flat(Infinity) or a recursive function that concatenates flattened children." },
      { q: "Shuffle an array randomly", a: "Fisher-Yates: for i from end to 1, pick a random index j from 0 to i, swap arr[i] and arr[j].", code: `for (let i = arr.length - 1; i > 0; i--) {\n  const j = Math.floor(Math.random() * (i + 1));\n  [arr[i], arr[j]] = [arr[j], arr[i]];\n}` },
    ],
  },
  {
    title: "DSA - String",
    questions: [
      { q: "Reverse a string", a: "Split into array, reverse, join.", code: `str.split('').reverse().join('');` },
      { q: "Check if a string is a palindrome", a: "Compare characters from both ends moving inward. Ignore non-alphanumeric if required.", code: `s = s.replace(/[^a-z0-9]/gi, '').toLowerCase();\nlet left = 0, right = s.length - 1;\nwhile (left < right) {\n  if (s[left] !== s[right]) return false;\n  left++; right--;\n}\nreturn true;` },
      { q: "Find the first non-repeating character", a: "Count frequency of each character, then loop and return the first with count 1.", code: `const count = {};\nfor (const c of str) count[c] = (count[c] || 0) + 1;\nfor (const c of str) if (count[c] === 1) return c;\nreturn null;` },
      { q: "Check if two strings are anagrams", a: "Count frequency of each character in both strings and compare counts.", code: `if (a.length !== b.length) return false;\nconst count = {};\nfor (const c of a) count[c] = (count[c] || 0) + 1;\nfor (const c of b) {\n  if (!count[c]) return false;\n  count[c]--;\n}\nreturn true;` },
      { q: "Count vowels and consonants in a string", a: "Loop and check each character; use a set of vowels and increment vowel or consonant counter.", code: `const vowels = new Set('aeiouAEIOU');\nlet v = 0, c = 0;\nfor (const ch of str)\n  if (ch.match(/[a-z]/i)) vowels.has(ch) ? v++ : c++;` },
      { q: "Reverse the words in a string", a: "Split by spaces, reverse the array of words, join back with space.", code: `str.split(' ').filter(Boolean).reverse().join(' ');` },
      { q: "Longest substring without repeating characters", a: "Use a sliding window and a Set. Expand right; if you see a duplicate, move left until the duplicate is removed. Track max length.", code: `let max = 0, set = new Set(), left = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (set.has(s[right])) set.delete(s[left++]);\n  set.add(s[right]);\n  max = Math.max(max, right - left + 1);\n}\nreturn max;` },
      { q: "Check if a string contains only digits", a: "Use regex or loop and check each character.", code: `const onlyDigits = /^\\d+$/.test(str);` },
      { q: "Longest common prefix of an array of strings", a: "Take the first string as initial prefix. For each next string, shorten the prefix until it matches the start of that string. Return the final prefix." },
      { q: "Find first occurrence of a substring (strstr)", a: "Loop through the main string; at each position check if the substring matches starting there. Or use indexOf.", code: `str.indexOf(substr);  // returns -1 if not found` },
      { q: "Count occurrences of a character in a string", a: "Loop and count, or split by the character and use length - 1.", code: `str.split('a').length - 1` },
      { q: "Check if two strings are rotations of each other", a: "If s2 is a rotation of s1, then s2 will be a substring of s1 + s1. So return (s1 + s1).includes(s2) && s1.length === s2.length." },
      { q: "Remove white spaces from a string", a: "Use replace with a regex that matches spaces, or split by spaces and join.", code: `str.replace(/\\s/g, '');` },
      { q: "Capitalize first letter of each word", a: "Split by space, map each word to word[0].toUpperCase() + word.slice(1).toLowerCase(), join.", code: `str.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');` },
    ],
  },
];
