import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function PerformanceOptimization() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Performance Optimization</h1>
      <p className="com-text">
        React performance optimization is about making your app feel fast: fewer re-renders, smaller bundles, and better Core Web Vitals. This page covers React-specific techniques (useMemo, useCallback, React.memo), Core Web Vitals (LCP, CLS, etc.), and general techniques like debouncing, lazy loading, and profiling.
      </p>

      {/* ========== CORE WEB VITALS ========== */}
      <section className="method-section">
        <h2 className="method-title">Core Web Vitals (LCP, CLS, INP)</h2>
        <p className="com-text">
          Core Web Vitals are metrics Google uses to measure user experience. They focus on loading (LCP), interactivity (INP), and visual stability (CLS). Improving them helps both users and SEO.
        </p>

        <div className="faq-item">
          <h3 className="faq-question">LCP – Largest Contentful Paint</h3>
          <p className="com-text"><strong>Full form:</strong> Largest Contentful Paint.</p>
          <p className="com-text"><strong>What it means:</strong> The time until the largest image or text block visible in the viewport is painted. It measures how quickly the main content appears.</p>
          <p className="com-text"><strong>Good:</strong> ≤ 2.5 seconds. <strong>Needs improvement:</strong> 2.5–4s. <strong>Poor:</strong> &gt; 4s.</p>
          <p className="com-text"><strong>How to improve:</strong> Optimize images (size, format, lazy load below-the-fold), reduce server response time (TTFB), use a CDN, eliminate render-blocking CSS/JS, preload critical resources, use SSR or static generation for faster first paint.</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">CLS – Cumulative Layout Shift</h3>
          <p className="com-text"><strong>Full form:</strong> Cumulative Layout Shift.</p>
          <p className="com-text"><strong>What it means:</strong> How much content shifts during loading. A high CLS means buttons or text jump around, which is bad for usability.</p>
          <p className="com-text"><strong>Good:</strong> ≤ 0.1. <strong>Needs improvement:</strong> 0.1–0.25. <strong>Poor:</strong> &gt; 0.25.</p>
          <p className="com-text"><strong>How to improve:</strong> Set size (width/height) on images and iframes so the browser reserves space; avoid inserting content above existing content; use transform for animations instead of changing layout (top/left); reserve space for ads or embeds; use font-display: optional or ensure fallback font has similar metrics.</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">INP – Interaction to Next Paint (replaces FID)</h3>
          <p className="com-text"><strong>Full form:</strong> Interaction to Next Paint.</p>
          <p className="com-text"><strong>What it means:</strong> Responsiveness: how quickly the page responds to a user interaction (click, tap, key press). INP is the successor to FID (First Input Delay).</p>
          <p className="com-text"><strong>Good:</strong> ≤ 200 ms. <strong>Needs improvement:</strong> 200–500 ms. <strong>Poor:</strong> &gt; 500 ms.</p>
          <p className="com-text"><strong>How to improve:</strong> Break up long tasks (code splitting, defer non-critical JS); reduce main-thread work (use Web Workers for heavy computation); avoid large JavaScript bundles on first load; optimize event handlers and avoid doing too much on click; use requestIdleCallback for non-urgent work.</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">Other useful metrics</h3>
          <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
            <li><strong>FCP (First Contentful Paint):</strong> When the first text or image is painted. Improves with faster TTFB, less render-blocking resources, and critical path optimization.</li>
            <li><strong>TTFB (Time to First Byte):</strong> Time until the server sends the first byte of the response. Improves with faster servers, CDNs, caching, and leaner backends.</li>
          </ul>
        </div>
      </section>

      {/* ========== REACT: useMemo, useCallback, React.memo ========== */}
      <section className="method-section">
        <h2 className="method-title">useMemo and useCallback</h2>
        <p className="com-text">
          <strong>useMemo</strong> memoizes a computed value. React recomputes it only when the dependencies in the dependency array change. Use it when a calculation is expensive and you want to avoid doing it on every render.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const sortedList = useMemo(() => {
  return items.slice().sort((a, b) => a.name.localeCompare(b.name));
}, [items]);  // only recompute when items changes`}
        </SyntaxHighlighter>
        <p className="com-text">
          <strong>useCallback</strong> memoizes a function. It returns the same function reference when dependencies do not change. Use it when you pass a callback to a child that is wrapped in React.memo, so the child does not re-render unnecessarily.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);  // same function reference unless id changes

// Pass to memoized child – child won't re-render when parent re-renders if handleClick is stable
<MemoizedChild onClick={handleClick} />`}
        </SyntaxHighlighter>
        <p className="com-text"><strong>When to use:</strong> Use useMemo for expensive computations; use useCallback for callbacks passed to memoized children or used in effect dependencies. Do not overuse: only when you measure a real performance problem.</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">React.memo</h2>
        <p className="com-text">
          <strong>React.memo</strong> is a higher-order component that memoizes a component. The component re-renders only when its props change (shallow comparison). Use it for components that render often with the same props.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
});
// Parent can re-render without re-rendering ExpensiveList if items is the same reference`}
        </SyntaxHighlighter>
        <p className="com-text">Combine with useCallback when the parent passes a function as a prop; otherwise a new function reference every render will cause the memoized child to re-render anyway.</p>
      </section>

      {/* ========== LAZY LOADING & CODE SPLITTING ========== */}
      <section className="method-section">
        <h2 className="method-title">Lazy Loading and Code Splitting (React.lazy + Suspense)</h2>
        <p className="com-text">
          Splitting code lets you load parts of the app only when needed. React.lazy and Suspense let you lazy-load component code, reducing the initial bundle size and improving LCP and TTI.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}`}
        </SyntaxHighlighter>
        <p className="com-text">Use lazy for route-level or heavy below-the-fold components. The fallback is shown until the chunk loads. This improves initial load and keeps the main bundle smaller.</p>
      </section>

      {/* ========== DEBOUNCING & THROTTLING ========== */}
      <section className="method-section">
        <h2 className="method-title">Debouncing and Throttling</h2>
        <p className="com-text">
          <strong>Debouncing</strong> runs a function only after the user has stopped doing something for a set time (e.g. after they stop typing). <strong>Throttling</strong> runs it at most once in a set time (e.g. once every 300 ms while scrolling). Both reduce how often expensive handlers run.
        </p>
        <div className="sub-section">
          <h3 className="com-subtitle">Debouncing (e.g. search input)</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
// Usage: call debounced function on every keystroke; it runs only after user stops typing for wait ms`}
          </SyntaxHighlighter>
        </div>
        <div className="sub-section">
          <h3 className="com-subtitle">Throttling (e.g. scroll handler)</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`function throttle(func, limit) {
  let lastRan;
  return function (...args) {
    if (!lastRan || Date.now() - lastRan >= limit) {
      func.apply(this, args);
      lastRan = Date.now();
    }
  };
}
// Usage: handler runs at most once every limit ms`}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* ========== LAZY LOADING IMAGES ========== */}
      <section className="method-section">
        <h2 className="method-title">Lazy Loading Images</h2>
        <p className="com-text">
          Load images only when they are near or in the viewport. This improves LCP for the main image and saves bandwidth. Use the native <code>loading="lazy"</code> attribute or IntersectionObserver for more control.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Native (simple)
<img src="photo.jpg" loading="lazy" alt="Photo" />

// With IntersectionObserver (custom)
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src || img.src;
      imageObserver.unobserve(img);
    }
  });
});
document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));`}
        </SyntaxHighlighter>
      </section>

      {/* ========== AVOID INLINE OBJECTS/FUNCTIONS IN JSX ========== */}
      <section className="method-section">
        <h2 className="method-title">Avoid Causing Extra Re-renders</h2>
        <p className="com-text">
          Passing a new object or function every render makes React think props changed, so memoized children re-render. Define objects and callbacks outside the component or with useMemo/useCallback when passing to React.memo children.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Bad: new object every render -> Child re-renders every time
<Child style={{ margin: 10 }} onClick={() => doSomething()} />

// Better: stable reference
const style = useMemo(() => ({ margin: 10 }), []);
const handleClick = useCallback(() => doSomething(), []);
<Child style={style} onClick={handleClick} />`}
        </SyntaxHighlighter>
      </section>

      {/* ========== VIRTUALIZATION ========== */}
      <section className="method-section">
        <h2 className="method-title">List Virtualization</h2>
        <p className="com-text">
          For long lists (hundreds or thousands of items), render only the items that are visible (or near the viewport). Libraries like react-window or react-virtualized do this. This reduces DOM nodes and keeps scrolling smooth.
        </p>
      </section>

      {/* ========== MEMORY MANAGEMENT ========== */}
      <section className="method-section">
        <h2 className="method-title">Memory Management in React</h2>
        <p className="com-text">
          Clean up subscriptions, timers, and listeners in useEffect’s cleanup so components do not leak memory or update after unmount.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`useEffect(() => {
  const id = setInterval(() => setCount((c) => c + 1), 1000);
  const sub = store.subscribe(handler);
  return () => {
    clearInterval(id);
    sub.unsubscribe();
  };
}, []);`}
        </SyntaxHighlighter>
      </section>

      {/* ========== PROFILING ========== */}
      <section className="method-section">
        <h2 className="method-title">Profiling and Measuring</h2>
        <p className="com-text">
          Use React DevTools Profiler to see which components re-render and how long they take. Use Chrome DevTools Performance tab for LCP, CLS, and long tasks. Measure Core Web Vitals with Lighthouse or the web-vitals library.
        </p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// Measure Web Vitals in your app
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getLCP(console.log);
getFID(console.log);  // or getINP when available`}
        </SyntaxHighlighter>
      </section>

      {/* ========== QUICK RECAP ========== */}
      <section className="method-section">
        <h2 className="method-title">Summary: Techniques at a Glance</h2>
        <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem' }}>
          <li><strong>Core Web Vitals:</strong> Optimize LCP (fast load, optimize images), CLS (reserve space, avoid layout shifts), INP (reduce main-thread work, break up long tasks).</li>
          <li><strong>React:</strong> useMemo for expensive values, useCallback for stable callbacks, React.memo for heavy components, lazy + Suspense for code splitting.</li>
          <li><strong>Events:</strong> Debouncing for search/input, throttling for scroll/resize.</li>
          <li><strong>Assets:</strong> Lazy load images and routes; use appropriate image size and format.</li>
          <li><strong>Rendering:</strong> Avoid new object/function in JSX when passing to memoized children; use virtualization for long lists.</li>
          <li><strong>Memory:</strong> Clean up in useEffect (timers, subscriptions, listeners).</li>
          <li><strong>Measure:</strong> React DevTools Profiler, Chrome Performance, Lighthouse, web-vitals.</li>
        </ul>
      </section>
    </div>
  );
}

export default PerformanceOptimization;
