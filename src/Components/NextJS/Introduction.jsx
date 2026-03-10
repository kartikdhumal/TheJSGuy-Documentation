import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSIntroduction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to Next.js</h1>
      <p>
        Next.js is a React framework for building full-stack web apps. It gives you server-side rendering, static generation, file-based routing, API routes, and built-in optimizations so you can ship fast, SEO-friendly sites.
      </p>
      <div className="method-section">
        <h2 className="method-title">Why use Next.js?</h2>
        <ul>
          <li><strong>SSR & SSG:</strong> Render pages on the server or at build time for better SEO and performance.</li>
          <li><strong>File-based routing:</strong> Create pages by adding files under <code>app/</code> or <code>pages/</code>.</li>
          <li><strong>API routes:</strong> Write backend endpoints inside the same project.</li>
          <li><strong>Optimizations:</strong> Automatic code splitting, image optimization, and font optimization.</li>
        </ul>
      </div>
      <div className="method-section">
        <h2 className="method-title">Create a new project</h2>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`npx create-next-app@latest my-app
cd my-app
npm run dev`}
        </SyntaxHighlighter>
        <p>You get a dev server at <code>http://localhost:3000</code>. The app uses the App Router by default (Next.js 13+).</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Project structure (App Router)</h2>
        <SyntaxHighlighter language="text" style={atomDark}>
          {`app/
  layout.js    # Root layout (wraps all pages)
  page.js      # Home page (/)
  globals.css
app/dashboard/
  page.js      # /dashboard
  layout.js    # Layout for dashboard
public/       # Static files`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default NextJSIntroduction;
