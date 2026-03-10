import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSDataFetching() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Data Fetching in Next.js</h1>
      <p>
        In the App Router you fetch data in Server Components with async/await. Next extends <code>fetch</code> with caching. You can also use a data cache or pass data from parent to client components via props.
      </p>
      <div className="method-section">
        <h2 className="method-title">Fetch in Server Component</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// app/posts/page.js
async function PostsPage() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }  // revalidate every 60 seconds
  });
  const posts = await res.json();
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Caching options</h2>
        <p><code>fetch</code> is cached by default. Use <code>cache: 'no-store'</code> for always fresh, or <code>next: { '{ revalidate: 60 }' }</code> for time-based revalidation (ISR).</p>
      </div>
    </div>
  );
}

export default NextJSDataFetching;
