import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDLRUCache() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">LLD: LRU Cache</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are building a small cache with a fixed size. When it is full, it throws out the item that was not used for the longest time (LRU = Least Recently Used).</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>get(key):</strong> return the value, or -1 if it is not there. Reading an item makes it "recently used".</li>
          <li className="com-list-item"><strong>put(key, value):</strong> add or update an item. If the cache is full, remove the least recently used item first.</li>
          <li className="com-list-item"><strong>The hard part:</strong> both get and put must be O(1). O(1) means the time does not grow with the number of items. No loops over the whole cache.</li>
          <li className="com-list-item"><strong>The trick:</strong> a HashMap to find any item fast, plus a doubly linked list to keep the "who was used last" order.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Requirements</h2>
        <p className="com-text"><strong>Functional:</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Fixed capacity:</strong> the cache is created with a size, like new LRUCache(2).</li>
          <li className="com-list-item"><strong>get(key):</strong> returns the value and marks the key as most recently used. Returns -1 if missing.</li>
          <li className="com-list-item"><strong>put(key, value):</strong> inserts or updates. Updating also marks it as most recently used.</li>
          <li className="com-list-item"><strong>Eviction:</strong> when a new key comes in and the cache is full, the least recently used key is removed.</li>
        </ol>
        <p className="com-text"><strong>Non-functional:</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Speed:</strong> get and put in O(1).</li>
          <li className="com-list-item"><strong>Memory:</strong> never store more than capacity items.</li>
          <li className="com-list-item"><strong>Simple API:</strong> the caller should not know how the order is kept inside.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Think of the "recent apps" screen on your phone. The app you opened last sits on top. If the phone runs low on memory, it closes the app you have not touched for the longest time. Redis does the same when you set maxmemory-policy to allkeys-lru: when memory is full, it removes keys that were not used for a long time. Browser caches and CDNs also use LRU-style rules to decide which files to drop.
          </p>
        </div>
      </section>

      <section id="entities" className="method-section">
        <h2 className="method-title">Entities</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Node:</strong> one item. Holds key, value, and links to the previous and next node.</li>
          <li className="com-list-item"><strong>DoublyLinkedList (inside the cache):</strong> keeps nodes in order of use. Front = most recently used. Back = least recently used. "Doubly" means each node knows both neighbours, so you can remove a node in O(1).</li>
          <li className="com-list-item"><strong>Map:</strong> key to node. Lets you jump to any node in O(1) without walking the list.</li>
          <li className="com-list-item"><strong>LRUCache:</strong> the public class with get and put. It uses the map and the list together.</li>
        </ol>
        <CodeBlock language="text" style={atomDark}>
          {`map: { 1 -> node1, 3 -> node3 }

 head <-> [3:C] <-> [1:A] <-> tail
 (dummy)   most        least    (dummy)
           recent      recent

+------------------------+       +------------------+
|       LRUCache         |       |       Node       |
| capacity: number       |  uses | key, value       |
| map: Map<key, Node>    |------>| prev: Node       |
| head, tail (dummies)   |       | next: Node       |
| get(key) / put(k, v)   |       +------------------+
+------------------------+`}
        </CodeBlock>
        <p className="com-text">
          Why the dummy head and tail? They are fake nodes that are always there. With them, the list is never "empty", so you never need special if-checks for the first or last node. This removes a lot of bugs.
        </p>
      </section>

      <section id="code" className="method-section">
        <h2 className="method-title">Code</h2>
        <p className="com-text"><strong>Part 1: the Node and the list helpers.</strong></p>
        <CodeBlock language="typescript" style={atomDark}>
          {`class Node<K, V> {
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;
  constructor(public key: K, public value: V) {}
}

class LRUCache<K, V> {
  private map = new Map<K, Node<K, V>>();
  private head: Node<K, V>; // dummy: right after it is the MOST recent
  private tail: Node<K, V>; // dummy: right before it is the LEAST recent

  constructor(private capacity: number) {
    if (capacity <= 0) throw new Error('Capacity must be positive');
    this.head = new Node<K, V>(null as K, null as V);
    this.tail = new Node<K, V>(null as K, null as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Take a node out of the list (O(1), because we know both neighbours)
  private remove(node: Node<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // Put a node right after head = mark it as most recently used
  private addToFront(node: Node<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }`}
        </CodeBlock>
        <p className="com-text"><strong>Part 2: get and put.</strong></p>
        <CodeBlock language="typescript" style={atomDark}>
          {`  get(key: K): V | -1 {
    const node = this.map.get(key);
    if (!node) return -1;
    // Used now, so move it to the front
    this.remove(node);
    this.addToFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.remove(existing);
      this.addToFront(existing);
      return;
    }

    if (this.map.size === this.capacity) {
      // Full: the node just before tail is the least recently used
      const lru = this.tail.prev!;
      this.remove(lru);
      this.map.delete(lru.key); // this is why Node stores the key too
    }

    const node = new Node(key, value);
    this.addToFront(node);
    this.map.set(key, node);
  }
}

// Usage
const cache = new LRUCache<number, string>(2);
cache.put(1, 'A');
cache.put(2, 'B');
cache.get(1);      // 'A'  (1 is now most recent)
cache.put(3, 'C'); // full, evicts 2
cache.get(2);      // -1`}
        </CodeBlock>
        <p className="com-text"><strong>Step-by-step trace</strong> (capacity 2, list shown from most recent to least recent):</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Call</th>
                <th>Returns</th>
                <th>List after (front to back)</th>
                <th>What happened</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>put(1, A)</td><td>-</td><td>1</td><td>Added to front.</td></tr>
              <tr><td>2</td><td>put(2, B)</td><td>-</td><td>2, 1</td><td>Added to front. Cache is now full.</td></tr>
              <tr><td>3</td><td>get(1)</td><td>A</td><td>1, 2</td><td>1 was used, so it moves to the front.</td></tr>
              <tr><td>4</td><td>put(3, C)</td><td>-</td><td>3, 1</td><td>Full. Back item is 2, so 2 is evicted.</td></tr>
              <tr><td>5</td><td>get(2)</td><td>-1</td><td>3, 1</td><td>2 is gone.</td></tr>
              <tr><td>6</td><td>put(4, D)</td><td>-</td><td>4, 3</td><td>Full. Back item is 1, so 1 is evicted.</td></tr>
              <tr><td>7</td><td>get(1)</td><td>-1</td><td>4, 3</td><td>1 is gone.</td></tr>
              <tr><td>8</td><td>get(3)</td><td>C</td><td>3, 4</td><td>3 moves to the front.</td></tr>
              <tr><td>9</td><td>get(4)</td><td>D</td><td>4, 3</td><td>4 moves to the front.</td></tr>
            </tbody>
          </table>
        </div>

        <p className="com-text"><strong>Part 3: the short JavaScript trick with Map.</strong></p>
        <p className="com-text">
          A JavaScript Map remembers the order in which keys were inserted. map.keys().next().value gives you the oldest key. So if you delete and re-insert a key every time it is used, the first key is always the least recently used one. Delete and set on a Map are O(1) on average.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`class LRUCacheMap<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | -1 {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key)!;
    this.map.delete(key);    // move to the end = most recent
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size === this.capacity) {
      const oldest = this.map.keys().next().value as K; // first key = least recent
      this.map.delete(oldest);
    }
    this.map.set(key, value);
  }
}`}
        </CodeBlock>
        <p className="com-text">
          In an interview, show the Map trick only after (or along with) the linked list version. Many interviewers want to see that you can build the list yourself, because the Map trick hides the real idea and does not work the same way in Java or C++.
        </p>
      </section>

      <section id="patterns" className="method-section">
        <h2 className="method-title">Patterns and ideas used</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Two data structures working together:</strong> the map gives fast lookup, the list gives fast ordering. Neither can do both alone. This is the main lesson of this problem.</li>
          <li className="com-list-item"><strong>Encapsulation:</strong> remove and addToFront are private. The user of the cache only sees get and put.</li>
          <li className="com-list-item"><strong>Sentinel (dummy) nodes:</strong> a small trick that removes edge cases for empty lists.</li>
          <li className="com-list-item"><strong>Strategy (for a bigger design):</strong> if the interviewer asks for different eviction rules, make an EvictionPolicy interface with LRUPolicy, LFUPolicy and FIFOPolicy classes. The cache takes one in its constructor (Open/Closed principle).</li>
          <li className="com-list-item"><strong>Generics:</strong> LRUCache&lt;K, V&gt; works for any key and value type, so you write it once.</li>
        </ol>
      </section>

      <section id="follow-ups" className="method-section">
        <h2 className="method-title">Follow-up questions</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>How do you add a TTL (expiry time)?</strong> Store expiresAt in each node. In get, if Date.now() is past expiresAt, delete it and return -1. This is called lazy expiry. You can also run a timer now and then to clean old items, which is what Redis does too.</li>
          <li className="com-list-item"><strong>Is this thread safe?</strong> In Node.js one cache in one process is safe, because JavaScript runs your code on a single thread and get/put have no await inside. In Java or Go you would need a lock around get and put. Across many servers, use a shared cache like Redis instead.</li>
          <li className="com-list-item"><strong>What is LFU and when is it better?</strong> LFU = Least Frequently Used. It removes the item used the fewest times. Better when some items are popular all the time, and a one-time scan of many keys should not push them out. Redis supports allkeys-lfu too.</li>
          <li className="com-list-item"><strong>Why not an array?</strong> Moving an item to the front of an array means shifting all others, which is O(n).</li>
          <li className="com-list-item"><strong>Why does Node store the key?</strong> When you evict the last node, you must also delete it from the map, and for that you need its key.</li>
          <li className="com-list-item"><strong>Does Redis use exact LRU?</strong> No. To save memory, Redis picks a few random keys and evicts the oldest of them. This is called approximated LRU, and it is close enough in practice.</li>
        </ol>
      </section>
    </div>
  );
}

export default LLDLRUCache;
