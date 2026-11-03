import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignFoundations() {
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
      <h1 className="title">System Design Foundations</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">These are the basics you need before any design question: how a request travels, what HLD and LLD mean, how apps grow, and how to do quick rough maths.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Request flow:</strong> what really happens between typing a URL and seeing the page.</li>
          <li className="com-list-item"><strong>HLD vs LLD:</strong> the big picture vs the small details.</li>
          <li className="com-list-item"><strong>Scaling:</strong> bigger server vs more servers.</li>
          <li className="com-list-item"><strong>Estimation:</strong> rough numbers for users, requests and storage.</li>
        </ol>
      </div>

      <section id="open-website" className="method-section">
        <h2 className="method-title">What Happens When You Open a Website or App</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">When you type a URL and press Enter, your browser finds the server, opens a safe line to it, asks for the page, and then draws what it gets back.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>DNS:</strong> the phone book of the internet. It turns swiggy.com into an IP address (the server's number).</li>
            <li className="com-list-item"><strong>TCP connection:</strong> the browser and server shake hands so they can send data reliably (nothing lost, right order).</li>
            <li className="com-list-item"><strong>TLS handshake:</strong> for https, they agree on a secret key, so all data after this is locked.</li>
            <li className="com-list-item"><strong>HTTP request:</strong> the browser asks, for example GET / or GET /api/restaurants.</li>
            <li className="com-list-item"><strong>Server and DB:</strong> the server runs your code, reads from the cache or database, and builds a response.</li>
            <li className="com-list-item"><strong>Response:</strong> the server sends back HTML or JSON with a status code like 200.</li>
            <li className="com-list-item"><strong>Render:</strong> the browser reads the HTML, downloads CSS, JS and images (often from a CDN), and paints the page.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You open the Swiggy app on your phone. The app itself is already installed, so there is no HTML to download. Instead, the app calls APIs like GET /api/restaurants?lat=..&amp;lng=.. and gets JSON back. The app then shows that JSON as restaurant cards. The same DNS, TCP and TLS steps still happen under the hood for each API call.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`You type swiggy.com
  |
  |-- 1. DNS: swiggy.com -> 52.x.x.x
  |-- 2. TCP handshake with 52.x.x.x
  |-- 3. TLS handshake (https lock)
  |-- 4. HTTP: GET /
          |
     [ Load Balancer ] -> [ Web Server ] -> [ Cache / DB ]
          |
  <-- 5. Response: 200 OK + HTML
  |
  |-- 6. Browser downloads CSS, JS, images (CDN)
  |-- 7. Browser paints the page`}
        </CodeBlock>
        <p className="com-text">
          DNS answers are cached at many levels (browser, OS, your internet provider), so the lookup is usually very fast after the first time. In interviews, just walk through these steps in order. You don't need deep details of each one.
        </p>
      </section>

      <section id="hld-vs-lld" className="method-section">
        <h2 className="method-title">HLD vs LLD</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">HLD (High-Level Design) is the map of the whole system. LLD (Low-Level Design) is the detailed plan of one part of it.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>HLD:</strong> which boxes you need (servers, database, cache, queue) and how they talk to each other.</li>
            <li className="com-list-item"><strong>LLD:</strong> classes, functions, design patterns, API request and response shape, and database tables.</li>
            <li className="com-list-item"><strong>Order:</strong> HLD first, then LLD for each important box.</li>
          </ol>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Point</th><th>HLD</th><th>LLD</th></tr>
            </thead>
            <tbody>
              <tr><td>Focus</td><td>Whole system</td><td>One service or module</td></tr>
              <tr><td>Talks about</td><td>Load balancer, cache, DB choice, queues, CDN</td><td>Classes, interfaces, methods, table columns</td></tr>
              <tr><td>Output</td><td>Box-and-arrow diagram</td><td>Class diagram, code, schema</td></tr>
              <tr><td>Main question</td><td>Will it handle the load and stay up?</td><td>Is the code clean and easy to change?</td></tr>
              <tr><td>Who usually does it</td><td>Senior devs, architects</td><td>Developers building the feature</td></tr>
              <tr><td>Interview example</td><td>Design WhatsApp</td><td>Design a Parking Lot (classes)</td></tr>
            </tbody>
          </table>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Building Zomato's order feature. HLD: the app calls an Order Service, which saves to a database and puts a message in a queue so the Restaurant Service and Delivery Service hear about it. LLD: inside the Order Service, you have an Order class with a status (PLACED, ACCEPTED, DELIVERED), a PaymentProcessor interface, and an orders table with columns like id, user_id, restaurant_id, total, status.
          </p>
        </div>
      </section>

      <section id="scaling" className="method-section">
        <h2 className="method-title">Horizontal vs Vertical Scaling</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Scaling means making your app handle more users. Vertical scaling = buy a bigger machine. Horizontal scaling = add more machines.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Vertical (scale up):</strong> more CPU, RAM, disk on the same server. Easy, no code change. But there is a top limit, it gets costly, and if that one server dies, everything is down.</li>
            <li className="com-list-item"><strong>Horizontal (scale out):</strong> run many servers behind a load balancer. Almost no limit, and one server dying is fine. But it is more complex to run.</li>
            <li className="com-list-item"><strong>Stateless servers:</strong> to scale out, a server should not keep user data (like sessions) in its own memory. Keep it in Redis or the DB, or use a JWT. Then any server can handle any request.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            A small startup runs on one server. As users grow, they first upgrade from 4 GB to 32 GB RAM (vertical). It is the quickest fix. When IRCTC-style spikes come, like Tatkal booking at 10 AM, one machine is never enough, so they run many servers and add more during the rush (horizontal). Databases are usually scaled vertically first, because splitting a database is much harder.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Vertical:                 Horizontal:
                                  [ Load Balancer ]
 [ Small Server ]                /       |        \\
       |                    Server1  Server2  Server3
       v                          \\      |       /
 [ BIG Server ]                    [ Redis (sessions) ]`}
        </CodeBlock>
        <p className="com-text">
          Bad: saving a logged-in user in a variable on server 1. The next request goes to server 2, which doesn't know the user, so they get logged out. Good: save the session in Redis, which all servers share.
        </p>
      </section>

      <section id="estimation" className="method-section">
        <h2 className="method-title">Back-of-the-Envelope Estimation</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Estimation is quick rough maths to know how big your system must be. Round numbers are fine. The goal is to know if you need 1 server or 100.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>DAU:</strong> Daily Active Users, the number of people who use the app on a day.</li>
            <li className="com-list-item"><strong>Requests per second (RPS):</strong> total requests in a day divided by seconds in a day.</li>
            <li className="com-list-item"><strong>1 day:</strong> 86,400 seconds. Round it to 1 lakh (100,000) to make maths easy.</li>
            <li className="com-list-item"><strong>Peak:</strong> traffic is not even. Take peak as about 2 to 3 times the average.</li>
            <li className="com-list-item"><strong>Storage per year:</strong> data per day x 365. Round 365 to 400 if you like.</li>
          </ol>
        </div>
        <p className="com-text">Handy numbers to remember:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Counting:</strong> 10 lakh = 1 million. 1 crore = 10 million. 100 crore = 1 billion.</li>
          <li className="com-list-item"><strong>Size:</strong> 1,000 KB ≈ 1 MB, 1,000 MB ≈ 1 GB, 1,000 GB ≈ 1 TB.</li>
          <li className="com-list-item"><strong>Typical sizes:</strong> a text message or DB row is a few hundred bytes to 1 KB. A photo is about 1 to 2 MB. A minute of HD video is tens of MB.</li>
          <li className="com-list-item"><strong>Speed order:</strong> memory (RAM) is fastest, then SSD, then network calls inside a data center, then calls across countries (around a few hundred ms).</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Say you are designing a photo app like Instagram with 1 crore (10 million) DAU. Each user opens the feed 10 times a day, and 1 in 10 users uploads one photo a day. Let's find the read RPS and yearly storage.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Reads (feed):
  1 crore users x 10 opens  = 10 crore requests / day
  10 crore / 1 lakh seconds = ~1,000 requests / second (average)
  Peak (x3)                 = ~3,000 requests / second

Writes (uploads):
  10% of 1 crore            = 10 lakh photos / day
  10 lakh / 1 lakh seconds  = ~10 uploads / second

Storage:
  10 lakh photos x 1 MB     = ~1 TB / day
  1 TB x 365                = ~365 TB / year (before copies/backups)

Result: reads are ~100x more than writes -> use cache + CDN,
        and object storage (like S3) for photos.`}
        </CodeBlock>
        <p className="com-text">
          Say your steps out loud in the interview. A small mistake in maths is fine. What matters is that you reach a sensible size and use it to make choices, like "this is read-heavy, so I'll add a cache".
        </p>
      </section>
    </div>
  );
}

export default SystemDesignFoundations;
