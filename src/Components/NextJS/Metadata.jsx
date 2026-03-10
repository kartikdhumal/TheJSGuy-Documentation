import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSMetadata() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Metadata & SEO</h1>
      <p>
        In the App Router you export a <code>metadata</code> object (or <code>generateMetadata</code> for dynamic data) to set <code>title</code>, <code>description</code>, <code>openGraph</code>, etc. Next.js turns these into the right <code>&lt;head&gt;</code> tags.
      </p>
      <div className="method-section">
        <h2 className="method-title">Static metadata</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// app/layout.js or app/page.js
export const metadata = {
  title: 'My App',
  description: 'Welcome to my app',
  openGraph: {
    title: 'My App',
    description: 'Welcome to my app',
    images: ['/og.png'],
  },
};

export default function Page() {
  return <div>...</div>;
}`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Dynamic metadata</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSMetadata;
