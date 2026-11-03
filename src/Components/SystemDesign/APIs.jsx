import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignAPIs() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">APIs &amp; Communication</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">This page is about how two programs talk to each other: the app and the server, or one server and another.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>API:</strong> the set of rules for asking a program for something.</li>
          <li className="com-list-item"><strong>API styles:</strong> REST, SOAP, GraphQL, gRPC and WebSockets. Different ways to talk, each good for different jobs.</li>
          <li className="com-list-item"><strong>SDK:</strong> a ready-made library that makes calling an API easier.</li>
        </ol>
      </div>

      <section id="what-is-api" className="method-section">
        <h2 className="method-title">What is an API</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An API (Application Programming Interface) is like a waiter in a restaurant. You don't go into the kitchen. You tell the waiter what you want, the waiter tells the kitchen, and brings back your food.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Request and response:</strong> the client sends a request, the server sends back a response (usually JSON).</li>
            <li className="com-list-item"><strong>Endpoint:</strong> the address you call, like /api/orders or /api/orders/42.</li>
            <li className="com-list-item"><strong>HTTP methods:</strong> GET = read, POST = create, PUT = replace, PATCH = update a part, DELETE = remove.</li>
            <li className="com-list-item"><strong>Status codes:</strong> 2xx = success (200 OK, 201 Created), 3xx = go somewhere else (redirect), 4xx = your mistake (400 Bad Request, 401 not logged in, 403 not allowed, 404 Not Found, 429 too many requests), 5xx = server's mistake (500, 503).</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When you tap "Place order" on Zomato, the app sends a POST request to an endpoint like /api/orders with your cart in the body. The server checks it, saves the order, and replies with 201 Created and the order id. When you open "My orders", the app sends GET /api/orders and shows the list it gets back.
          </p>
        </div>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Request
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{ "restaurantId": 12, "items": [{ "id": 5, "qty": 2 }] }

// Response
201 Created
{ "orderId": 9001, "status": "PLACED" }`}
        </CodeBlock>
      </section>

      <section id="api-styles" className="method-section">
        <h2 className="method-title">REST vs SOAP vs GraphQL vs gRPC vs WebSockets</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">These are different styles for programs to talk. REST is the most common. The others solve special problems.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>REST:</strong> URLs for things (resources) and HTTP methods for actions. Simple JSON. The default choice.</li>
            <li className="com-list-item"><strong>SOAP:</strong> an older style with strict XML messages and rules. Still found in banks and old enterprise systems.</li>
            <li className="com-list-item"><strong>GraphQL:</strong> one endpoint. The client writes a query saying exactly which fields it wants. No extra data, no extra calls.</li>
            <li className="com-list-item"><strong>gRPC:</strong> one service calls a function on another service, like a normal function call. Uses a small binary format (Protocol Buffers), so it is very fast. Mostly used between backend services.</li>
            <li className="com-list-item"><strong>WebSockets:</strong> a connection that stays open, so both client and server can send messages any time. Used for live things.</li>
          </ol>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Style</th><th>Data format</th><th>Connection</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><td>REST</td><td>JSON (mostly)</td><td>Request / response over HTTP</td><td>Most public and mobile APIs</td></tr>
              <tr><td>SOAP</td><td>XML only</td><td>Request / response</td><td>Old banking, government, enterprise systems</td></tr>
              <tr><td>GraphQL</td><td>JSON</td><td>Request / response, one endpoint</td><td>Screens that need data from many places</td></tr>
              <tr><td>gRPC</td><td>Protocol Buffers (binary)</td><td>HTTP/2, supports streaming</td><td>Fast service-to-service calls inside the backend</td></tr>
              <tr><td>WebSockets</td><td>Any (often JSON)</td><td>Stays open, two-way</td><td>Chat, live tracking, live scores</td></tr>
            </tbody>
          </table>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            In one food delivery app you can see many styles together. The app loads restaurants with REST. The home screen could use GraphQL to get banners, offers and restaurants in one call. The Order Service calls the Payment Service with gRPC because it is fast. The live rider location on the map comes through a WebSocket. And the bank behind the payment gateway may still use SOAP.
          </p>
        </div>
        <p className="com-text">A tiny example of each:</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// REST
GET /api/restaurants/12/menu

// SOAP (XML envelope)
<soap:Envelope>
  <soap:Body><GetBalance><AccountNo>1234</AccountNo></GetBalance></soap:Body>
</soap:Envelope>

// GraphQL (ask only for the fields you need)
query {
  restaurant(id: 12) { name rating menu { name price } }
}

// gRPC (.proto file)
service PaymentService {
  rpc Charge (ChargeRequest) returns (ChargeResponse);
}

// WebSocket (browser)
const ws = new WebSocket('wss://example.com/track/9001');
ws.onmessage = (e) => console.log('rider at', JSON.parse(e.data));`}
        </CodeBlock>
        <p className="com-text">When to use which:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>REST:</strong> start here for almost every API.</li>
          <li className="com-list-item"><strong>GraphQL:</strong> many different clients (web, Android, iOS) need different fields from the same data.</li>
          <li className="com-list-item"><strong>gRPC:</strong> many internal microservices calling each other a lot, where speed matters.</li>
          <li className="com-list-item"><strong>WebSockets:</strong> the server must push updates instantly, and both sides talk often.</li>
          <li className="com-list-item"><strong>SOAP:</strong> only when the other side (like an old bank system) needs it.</li>
        </ol>
        <p className="com-text">Other ways to get live updates, and how they compare to WebSockets:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Polling:</strong> the client asks "anything new?" every few seconds. Simple, but wastes many calls when nothing changed.</li>
          <li className="com-list-item"><strong>Long polling:</strong> the client asks, and the server holds the request open until there is news (or a timeout). Then the client asks again. Fewer wasted calls.</li>
          <li className="com-list-item"><strong>SSE (Server-Sent Events):</strong> one open connection where only the server sends updates. Good for one-way feeds like live cricket scores or notifications.</li>
          <li className="com-list-item"><strong>WebSockets:</strong> open connection, both sides send. Best for chat, like WhatsApp Web.</li>
        </ol>
      </section>

      <section id="api-vs-sdk" className="method-section">
        <h2 className="method-title">API vs SDK</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An API is the menu of things a service can do. An SDK (Software Development Kit) is a ready-made helper library, in your language, that calls that API for you.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>API:</strong> you build the HTTP request yourself: URL, headers, auth, body, error handling.</li>
            <li className="com-list-item"><strong>SDK:</strong> you call a normal function like razorpay.orders.create(). It builds the request for you.</li>
            <li className="com-list-item"><strong>Link between them:</strong> the SDK uses the API inside. Same work, less code for you.</li>
            <li className="com-list-item"><strong>Trade-off:</strong> the SDK is easier and safer, but adds a dependency you must keep updated.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            To take payments with Razorpay in a Node.js app, you can call their REST API directly with fetch or axios, adding your key and secret as Basic Auth yourself. Or you can install the razorpay npm package (their Node SDK) and just call orders.create(). Both create the same order on Razorpay's side.
          </p>
        </div>
        <CodeBlock language="javascript" style={atomDark}>
          {`// 1. Using the REST API directly
const auth = Buffer.from(\`\${KEY_ID}:\${KEY_SECRET}\`).toString('base64');
const res = await fetch('https://api.razorpay.com/v1/orders', {
  method: 'POST',
  headers: { Authorization: \`Basic \${auth}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 50000, currency: 'INR' }), // amount in paise
});
const order = await res.json();

// 2. Using the Node SDK
const Razorpay = require('razorpay');
const razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
const order2 = await razorpay.orders.create({ amount: 50000, currency: 'INR' });`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default SystemDesignAPIs;
