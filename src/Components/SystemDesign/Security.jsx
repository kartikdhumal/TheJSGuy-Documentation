import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignSecurity() {
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
      <h1 className="title">Security &amp; Authentication</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Security means keeping bad people out and keeping user data safe. Authentication means checking who the user is.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Security layers:</strong> many walls, one behind another, so if one fails the next one still protects you.</li>
          <li className="com-list-item"><strong>JWT:</strong> a signed token that proves who the user is.</li>
          <li className="com-list-item"><strong>Session vs JWT:</strong> two ways to remember a logged-in user.</li>
        </ol>
      </div>

      <section id="security-layers" className="method-section">
        <h2 className="method-title">Security Layers</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Good security is not one lock. It is many locks, from the outside of your system to the inside. This idea is called defense in depth.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>DDoS protection and WAF:</strong> a DDoS attack floods you with fake traffic to bring you down. Services like Cloudflare or AWS Shield absorb it. A WAF (Web Application Firewall) blocks known bad request patterns before they reach you.</li>
            <li className="com-list-item"><strong>HTTPS:</strong> encrypts data on the way, so nobody on the network can read or change it.</li>
            <li className="com-list-item"><strong>API gateway and rate limits:</strong> one front door that checks tokens and stops clients that send too many requests.</li>
            <li className="com-list-item"><strong>Authentication vs authorization:</strong> authentication asks "who are you?" (login). Authorization asks "what are you allowed to do?" (a normal user can't open the admin page).</li>
            <li className="com-list-item"><strong>Input validation:</strong> never trust what the user sends. Use parameterized queries to stop SQL injection (the user sneaks SQL into a form field). Escape output to stop XSS (the user sneaks a script into a page that runs in other users' browsers).</li>
            <li className="com-list-item"><strong>Encryption at rest:</strong> data saved on disk (database, backups, files) is encrypted, so a stolen disk is useless. Passwords are never stored as is: hash them with bcrypt or argon2.</li>
            <li className="com-list-item"><strong>Secrets management:</strong> keep API keys and DB passwords out of your code and Git. Use environment variables or a tool like AWS Secrets Manager or HashiCorp Vault.</li>
            <li className="com-list-item"><strong>Least privilege:</strong> give each user, service and DB account only the access it really needs. A reporting service only needs read access.</li>
            <li className="com-list-item"><strong>Logging and monitoring:</strong> record logins, failures and odd behaviour, and send alerts, so you notice an attack early. Never log passwords or full card numbers.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Think of a payment app like PhonePe. Cloudflare-style protection stops floods of fake traffic. HTTPS hides your data on public Wi-Fi. Login with OTP proves it is you (authentication). You can only see your own transactions, not someone else's (authorization). Your UPI PIN is never stored as plain text. And if someone tries hundreds of PINs, rate limits and alerts stop them.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Internet
  |-- DDoS protection / WAF
  |-- HTTPS (TLS)
  |-- API Gateway: auth check + rate limit
  |-- App: authorization + input validation
  |-- Database: least privilege + encryption at rest
  |-- Secrets in a vault, logs + alerts everywhere`}
        </CodeBlock>
      </section>

      <section id="jwt" className="method-section">
        <h2 className="method-title">JWT (JSON Web Token)</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A JWT is a small signed token the server gives you after login. You send it with every request, and the server checks the signature to know who you are, without looking anything up in a database.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Structure:</strong> three parts joined by dots: header.payload.signature.</li>
            <li className="com-list-item"><strong>Header:</strong> which signing algorithm is used, like HS256.</li>
            <li className="com-list-item"><strong>Payload:</strong> the data (called claims), like userId, role and exp (expiry time).</li>
            <li className="com-list-item"><strong>Signature:</strong> made from the header + payload + a secret key that only the server knows. If anyone changes even one letter of the payload, the signature will not match.</li>
            <li className="com-list-item"><strong>Not encrypted:</strong> the header and payload are only Base64 encoded. Anyone can decode and read them. So never put passwords or private data in the payload.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> the jsonwebtoken library signs with HS256 if you don't pass an algorithm. A token has no expiry unless you set expiresIn (or exp), so always set it.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            A JWT is like a movie ticket from BookMyShow with a stamp on it. The gate staff don't call the office to check it. They just look at the stamp and the show time. If someone changes the seat number with a pen, the stamp no longer matches. In the same way, after you log in to the Swiggy app, every API call carries your token, and any server can check it on its own.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`1. App  --- POST /login (email, password) --->  Server
2. Server checks password, signs a JWT with its secret
3. App  <--- access token (15 min) + refresh token (7 days) ---
4. App  --- GET /orders  + "Authorization: Bearer <token>" --->
5. Server verifies signature + expiry -> userId -> returns orders
6. Access token expired? App sends the refresh token
   to POST /refresh and gets a new access token`}
        </CodeBlock>
        <p className="com-text">Access and refresh tokens:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Access token:</strong> short life (like 15 minutes). Sent with every request. If it is stolen, it works only for a short time.</li>
          <li className="com-list-item"><strong>Refresh token:</strong> long life (like 7 days). Used only to get a new access token. Saved on the server too, so you can cancel it on logout.</li>
        </ol>
        <p className="com-text">Where to store the token in the browser:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>httpOnly cookie (better):</strong> JavaScript can't read it, so an XSS attack can't steal it. Add Secure and SameSite flags to help against CSRF (another site making requests using your cookie).</li>
          <li className="com-list-item"><strong>localStorage (risky):</strong> easy to use, but any script on the page can read it. One XSS bug and the token is stolen.</li>
        </ol>
        <CodeBlock language="javascript" style={atomDark}>
          {`const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; // never hard-code it

// On login: create the token
const token = jwt.sign(
  { userId: user.id, role: user.role },  // payload: no passwords here
  SECRET,
  { expiresIn: '15m' }
);

// Middleware: check the token on every request
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, SECRET); // throws if changed or expired
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}`}
        </CodeBlock>
      </section>

      <section id="session-vs-jwt" className="method-section">
        <h2 className="method-title">Session vs JWT</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Both remember that you are logged in. With a session, the server keeps your login info and gives you only an id. With a JWT, the server gives you a signed token that holds the info itself.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Session:</strong> the server saves "session abc123 = user 42" in memory, Redis or the database, and sends abc123 in a cookie. On every request, it looks up abc123.</li>
            <li className="com-list-item"><strong>JWT:</strong> the server saves nothing. It just checks the signature on the token. This is called stateless.</li>
            <li className="com-list-item"><strong>The logout problem:</strong> to log out a session, just delete it on the server. A JWT stays valid until it expires, even after logout. To cancel it early, you need a blocklist (a list of cancelled tokens, often in Redis) or short-lived access tokens with refresh tokens you can delete.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> express-session stores sessions in server memory (MemoryStore) by default, which is meant only for development. In production, use a store like Redis.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Net banking sites often use sessions, because when you click "logout" or the bank sees something odd, it must kill your login right now. Apps like Swiggy or Zomato, with a mobile app and many servers, often use JWT access tokens with refresh tokens, so any server can check the user without a shared lookup on every request.
          </p>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>Session</th>
                <th>JWT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Where login info lives</td>
                <td>On the server (Redis, DB)</td>
                <td>Inside the token, with the client</td>
              </tr>
              <tr>
                <td>Check on each request</td>
                <td>Look up the session id</td>
                <td>Verify the signature, no lookup</td>
              </tr>
              <tr>
                <td>Logout / cancel access</td>
                <td>Easy, delete the session</td>
                <td>Hard, need a blocklist or short expiry</td>
              </tr>
              <tr>
                <td>Many servers</td>
                <td>Need a shared store like Redis</td>
                <td>Works out of the box</td>
              </tr>
              <tr>
                <td>Size sent each time</td>
                <td>Small id</td>
                <td>Bigger token</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Classic websites, banking, admin panels</td>
                <td>Mobile apps, APIs, microservices</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          Simple rule: for a normal website on one domain, sessions are simple and safe. For mobile apps, public APIs or many services, use JWT with short access tokens and refresh tokens. Many real apps mix both.
        </p>
      </section>
    </div>
  );
}

export default SystemDesignSecurity;
