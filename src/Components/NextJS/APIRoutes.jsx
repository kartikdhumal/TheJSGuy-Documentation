import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NextJSAPIRoutes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">API Routes</h1>
      <p>
        In the App Router, API routes live in <code>app/api/</code>. Each route is a <code>route.js</code> (or <code>route.ts</code>) file that exports handlers for HTTP methods: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>, etc.
      </p>
      <div className="method-section">
        <h2 className="method-title">Basic API route</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// app/api/users/route.js
export async function GET() {
  const users = await db.getUsers();
  return Response.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.createUser(body);
  return Response.json(user, { status: 201 });
}`}
        </CodeBlock>
        <p>This serves <code>GET /api/users</code> and <code>POST /api/users</code>.</p>
      </div>
      <div className="method-section">
        <h2 className="method-title">Dynamic API route</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const user = await db.getUser(params.id);
  if (!user) return new Response(null, { status: 404 });
  return Response.json(user);
}`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default NextJSAPIRoutes;
