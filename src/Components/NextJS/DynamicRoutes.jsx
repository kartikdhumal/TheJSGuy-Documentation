import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSDynamicRoutes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Dynamic Routes</h1>
      <p>
        Use a folder named <code>[param]</code> for a dynamic segment. You can have multiple segments like <code>[category]/[id]</code>. The page receives <code>params</code> (and in pages with search params, <code>searchParams</code>).
      </p>
      <div className="method-section">
        <h2 className="method-title">Single dynamic segment</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`);
  const post = await res.json();
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">generateStaticParams (optional)</h2>
        <p>For static generation of dynamic routes, export <code>generateStaticParams</code> to tell Next which values to pre-render at build time.</p>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map(p => ({ slug: p.slug }));
}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSDynamicRoutes;
