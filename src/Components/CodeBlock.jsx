import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy } from 'react-icons/fa';
import '../styles/debouncing.css';

function CodeBlock({
  children,
  language = 'javascript',
  style = atomDark,
  customStyle,
  showLineNumbers,
  ...rest
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : String(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block-wrapper">
      <button
        type="button"
        className="code-block-copy-btn"
        onClick={handleCopy}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <span className="code-block-copied">Copied!</span>
        ) : (
          <FaCopy className="code-block-copy-icon" />
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={customStyle}
        showLineNumbers={showLineNumbers}
        {...rest}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
