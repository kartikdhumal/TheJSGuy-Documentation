import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">System Design: Start Here</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">System design means planning how to build an app so it works well for many users: fast, safe, and without falling down.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>HLD (High-Level Design):</strong> the big picture. Which boxes (servers, database, cache, queue) you need and how they connect.</li>
          <li className="com-list-item"><strong>LLD (Low-Level Design):</strong> the inside of one box. Classes, functions, design patterns and database tables.</li>
          <li className="com-list-item"><strong>Simple way to remember:</strong> HLD is the map of a city. LLD is the plan of one house in that city.</li>
        </ol>
      </div>

      <section className="method-section">
        <h2 className="method-title">How much system design does a 3-year developer need?</h2>
        <p className="com-text">
          You are not expected to design Google. You are expected to show that you understand the common building blocks and can write clean, well-structured code. Interviews at 2 to 4 years usually check these things:
        </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>LLD (very important at your level):</strong> OOP, SOLID, a few common design patterns, clean API design, a good database schema, and solving one machine coding problem like a Parking Lot in about 60 minutes.</li>
          <li className="com-list-item"><strong>HLD basics (must know):</strong> load balancer, cache, CDN, SQL vs NoSQL, replication and sharding, message queues, rate limiting, CAP theorem. You should explain each in 2 minutes with an example.</li>
          <li className="com-list-item"><strong>One small HLD design:</strong> be able to draw a simple design like a URL shortener, a chat app or an Instagram feed, and explain why you picked each part.</li>
          <li className="com-list-item"><strong>Not expected yet:</strong> deep topics like consensus algorithms (Raft, Paxos), designing your own database, or multi-region failover in detail. Knowing the names is enough.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Rough split for your preparation</p>
          <p className="com-text">
            About 50% LLD, 35% HLD basics, 15% practicing 2 or 3 real designs out loud. At 5+ years the HLD part grows bigger.
          </p>
        </div>
      </section>

      <section className="method-section">
        <h2 className="method-title">Order to study</h2>
        <ol className="com-list">
          <li className="com-list-item"><Link to="/system-design-foundations">Foundations</Link>: what happens when you open a website, scaling.</li>
          <li className="com-list-item"><Link to="/system-design-web-infrastructure">Web Infrastructure</Link>: load balancer, CDN, proxy, caching.</li>
          <li className="com-list-item"><Link to="/system-design-apis">APIs</Link> and <Link to="/system-design-databases">Databases</Link>.</li>
          <li className="com-list-item"><Link to="/system-design-distributed">Distributed Systems</Link>, <Link to="/system-design-architecture">Architecture</Link> and <Link to="/system-design-security">Security</Link>.</li>
          <li className="com-list-item"><Link to="/lld-basics">LLD Basics</Link>, <Link to="/lld-solid">SOLID</Link>, then the design patterns.</li>
          <li className="com-list-item">Practice: <Link to="/lld-parking-lot">Parking Lot</Link>, <Link to="/lld-lru-cache">LRU Cache</Link>, then <Link to="/system-design-instagram">Instagram</Link>, <Link to="/system-design-irctc-tatkal">IRCTC Tatkal</Link> and <Link to="/system-design-upi">UPI</Link>.</li>
        </ol>
      </section>

      <section className="method-section">
        <h2 className="method-title">How to answer an HLD question (45 minutes)</h2>
        <p className="com-text">Use the same steps every time. Interviewers care more about your steps and reasons than the final picture.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Ask questions (5 min):</strong> what features are needed? How many users? Is reading more common than writing?</li>
          <li className="com-list-item"><strong>Rough numbers (5 min):</strong> requests per second and storage per year. Just round numbers.</li>
          <li className="com-list-item"><strong>APIs (5 min):</strong> list the main endpoints, like POST /posts and GET /feed.</li>
          <li className="com-list-item"><strong>Database (5 min):</strong> the main tables or collections, and SQL or NoSQL with a reason.</li>
          <li className="com-list-item"><strong>Draw the boxes (10 min):</strong> client, load balancer, services, cache, database, queue.</li>
          <li className="com-list-item"><strong>Make it scale (10 min):</strong> where will it break first? Add cache, replicas, sharding, queues.</li>
          <li className="com-list-item"><strong>Wrap up (5 min):</strong> say the trade-offs you made and what you would do next.</li>
        </ol>
        <CodeBlock language="text" style={atomDark}>
          {`Client -> CDN (static files)
       -> Load Balancer -> API servers -> Cache (Redis)
                                       -> Database (+ replicas)
                                       -> Queue -> Workers (emails, notifications)`}
        </CodeBlock>
        <p className="com-text">Almost every design you will draw is some version of this picture.</p>
      </section>
    </div>
  );
}

export default SystemDesignIntroduction;
