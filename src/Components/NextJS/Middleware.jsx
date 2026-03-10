import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSMiddleware() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Middleware</h1>
      <p>
        Middleware runs before a request is completed. You put it in <code>middleware.js</code> at the project root. Use it for auth checks, redirects, rewriting URLs, or setting headers.
      </p>
      <div className="method-section">
        <h2 className="method-title">Basic middleware</h2>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`// middleware.js (at root)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};`}
        </SyntaxHighlighter>
      </div>
      <div className="method-section">
        <h2 className="method-title">Matcher</h2>
        <p><code>config.matcher</code> limits which paths run the middleware. Omit it to run on every request (use with care).</p>
      </div>
    </div>
  );
}

export default NextJSMiddleware;
