import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSImage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Image Optimization</h1>
      <p>
        The <code>next/image</code> component optimizes images: lazy loading, responsive sizes, and modern formats (WebP/AVIF) when supported. It also prevents layout shift by requiring width/height or fill.
      </p>
      <div className="method-section">
        <h2 className="method-title">Basic usage</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={800}
      height={400}
      priority
    />
  );
}`}
        </CodeBlock>
        <p>Use <code>priority</code> for above-the-fold images so they load immediately. For responsive images use <code>fill</code> with a positioned parent.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">External images</h2>
        <p>Add the domain to <code>next.config.js</code> under <code>images.domains</code> (or <code>remotePatterns</code>).</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'example.com', pathname: '/**' }],
  },
};`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default NextJSImage;
