import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSCaching() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Caching in Next.js</h1>
      <p>
        Next.js caches <code>fetch</code> requests and the Router Cache (client-side cache of server component payloads). You can control caching with <code>revalidate</code>, <code>cache: 'no-store'</code>, or <code>unstable_noStore()</code>.
      </p>
      <div className="method-section">
        <h2 className="method-title">Fetch caching</h2>
        <p>By default <code>fetch</code> is cached. Use <code>next.revalidate</code> for time-based revalidation or <code>cache: 'no-store'</code> to skip cache.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Cached indefinitely (default)
const res = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds
const res = await fetch(url, { next: { revalidate: 60 } });

// No cache (always fresh)
const res = await fetch(url, { cache: 'no-store' });`}
        </CodeBlock>
      </div>
      <div className="method-section">
        <h2 className="method-title">Opt out of static rendering</h2>
        <p>To force a dynamic render (e.g. always fresh data), use <code>export const dynamic = 'force-dynamic'</code> or call <code>unstable_noStore()</code> from <code>next/cache</code> inside the component.</p>
      </div>
    </div>
  );
}

export default NextJSCaching;
