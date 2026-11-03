import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignWebInfrastructure() {
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
      <h1 className="title">Web Infrastructure</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Web infrastructure is all the things that sit between the user and your code, so your app stays fast, safe and online.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Load balancer:</strong> shares the traffic between many servers.</li>
          <li className="com-list-item"><strong>CDN:</strong> keeps copies of images and files close to the user.</li>
          <li className="com-list-item"><strong>Proxy:</strong> a middle man between two sides.</li>
          <li className="com-list-item"><strong>SSL:</strong> locks the data while it travels (the https padlock).</li>
          <li className="com-list-item"><strong>Cache:</strong> keeps hot data in fast memory.</li>
        </ol>
      </div>

      <section id="load-balancer" className="method-section">
        <h2 className="method-title">Load Balancer</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A load balancer is a traffic police for your servers. Requests come to it first, and it sends each one to a server that is free.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why:</strong> one server can handle only so many users. With 5 servers behind a load balancer, you can handle about 5 times more.</li>
            <li className="com-list-item"><strong>Health checks:</strong> it keeps checking each server (like GET /health). If a server is dead, it stops sending traffic there.</li>
            <li className="com-list-item"><strong>Examples:</strong> Nginx, HAProxy, AWS ALB / NLB.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            During the Flipkart Big Billion Days sale, lakhs of people open the app at 12 AM. One server would crash. So Flipkart runs hundreds of servers, and a load balancer spreads the users across them. If one server dies, users don't even notice, because the load balancer sends them to another one.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`            Users
              |
       [ Load Balancer ]
        /     |      \\
  Server1  Server2  Server3`}
        </CodeBlock>
        <p className="com-text">How does it pick a server? These are called algorithms:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Round robin:</strong> one by one in turn: 1, 2, 3, 1, 2, 3. Simple and the most common.</li>
          <li className="com-list-item"><strong>Least connections:</strong> send to the server that is busy with the fewest users right now.</li>
          <li className="com-list-item"><strong>IP hash:</strong> the same user always goes to the same server. Useful when the server keeps the user's session in memory (sticky sessions).</li>
          <li className="com-list-item"><strong>Weighted:</strong> a bigger server gets more traffic than a small one.</li>
        </ol>
        <p className="com-text">
          L4 vs L7: an L4 load balancer only looks at IP and port, so it is very fast. An L7 load balancer reads the HTTP request, so it can send /api to one group of servers and /images to another.
        </p>
      </section>

      <section id="cdn" className="method-section">
        <h2 className="method-title">CDN (Content Delivery Network)</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A CDN is a group of servers spread across many cities that keep copies of your files, so users download them from a server near them.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>What it stores:</strong> images, videos, CSS, JS, fonts. Things that don't change per user.</li>
            <li className="com-list-item"><strong>Why:</strong> data travels a shorter distance, so pages load faster, and your main server gets less load.</li>
            <li className="com-list-item"><strong>Edge server:</strong> the CDN server close to the user.</li>
            <li className="com-list-item"><strong>Examples:</strong> Cloudflare, AWS CloudFront, Akamai.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your server is in Mumbai. A user in Delhi opens your site. Without a CDN, every image comes from Mumbai. With a CDN, the first Delhi user's request fetches the image from Mumbai, the Delhi edge server keeps a copy, and every next Delhi user gets it from Delhi. Hotstar does the same with video during an IPL match, so crores of people can watch at once.
          </p>
        </div>
        <p className="com-text">
          Cache hit means the CDN already has the file. Cache miss means it must fetch it from your server (called the origin) first. When you deploy a new version of a file, give it a new name (app.3f9a.js) or purge the CDN cache, or users keep seeing the old file.
        </p>
      </section>

      <section id="proxy" className="method-section">
        <h2 className="method-title">Forward Proxy vs Reverse Proxy</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A proxy is a middle man. A forward proxy works for the user. A reverse proxy works for the server.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Forward proxy:</strong> sits in front of users. Websites see the proxy, not the real user. Used for office internet filters, VPNs, hiding your IP.</li>
            <li className="com-list-item"><strong>Reverse proxy:</strong> sits in front of servers. Users see the proxy, not the real servers. Used for load balancing, SSL, caching, hiding your servers.</li>
            <li className="com-list-item"><strong>Example tool:</strong> Nginx is the most common reverse proxy.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Forward proxy: your college Wi-Fi blocks Instagram. Your request goes to the college proxy first, and it says no. Reverse proxy: when you open swiggy.com you talk to their Nginx, which passes your request to one of many hidden servers behind it.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Forward:  You --> [Proxy] --> Internet --> website
Reverse:  You --> Internet --> [Nginx] --> server1 / server2`}
        </CodeBlock>
      </section>

      <section id="ssl" className="method-section">
        <h2 className="method-title">SSL Certificates (HTTPS)</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An SSL certificate is an ID card for your website. It proves the site is real, and it lets the browser lock (encrypt) all data sent between you and the site.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>HTTP vs HTTPS:</strong> HTTP sends plain text that anyone on the Wi-Fi can read. HTTPS sends locked data.</li>
            <li className="com-list-item"><strong>Who gives it:</strong> a Certificate Authority (CA), like Let's Encrypt (free) or DigiCert.</li>
            <li className="com-list-item"><strong>Name today:</strong> the real protocol is now TLS, but people still say SSL.</li>
            <li className="com-list-item"><strong>SSL termination:</strong> the load balancer or Nginx unlocks HTTPS once, and talks to the servers inside the private network. So each server doesn't do this extra work.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When you log in to your bank on cafe Wi-Fi, HTTPS makes sure the person next to you can't read your password, even if they capture the Wi-Fi traffic. The padlock in the address bar means the certificate is valid.
          </p>
        </div>
        <p className="com-text">
          The handshake in short: the browser says hello, the server sends its certificate, the browser checks it with the CA, both agree on a secret key, and from then on all data is encrypted with that key.
        </p>
      </section>

      <section id="caching" className="method-section">
        <h2 className="method-title">Caching</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Caching means keeping a copy of data in a fast place, so you don't do the slow work again and again.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Where caches live:</strong> browser, CDN, server memory, Redis, and even inside the database.</li>
            <li className="com-list-item"><strong>Cache hit / miss:</strong> hit = found in cache (fast). Miss = not there, go to the database (slow).</li>
            <li className="com-list-item"><strong>TTL:</strong> how long the copy stays before it is thrown away, like 10 minutes.</li>
            <li className="com-list-item"><strong>Eviction:</strong> when the cache is full, it removes something. LRU removes the item not used for the longest time.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> Redis keeps a key forever unless you set a TTL. Its default eviction policy is noeviction (when full, new writes fail), so set allkeys-lru for a pure cache.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On Zomato, the menu of a popular restaurant is read thousands of times a minute but changes maybe once a day. So the app keeps the menu in Redis. The database is asked only once, and everyone else gets the copy from Redis in about 1 ms.
          </p>
        </div>
        <p className="com-text">The most used pattern is cache-aside:</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function getMenu(restaurantId) {
  const key = \`menu:\${restaurantId}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);          // cache hit

  const menu = await db.menus.find(restaurantId);  // cache miss
  await redis.set(key, JSON.stringify(menu), 'EX', 600); // keep 10 min
  return menu;
}`}
        </CodeBlock>
        <p className="com-text">
          The hard part is stale data: when the menu changes, delete the key so the next read gets the fresh one. Also see Write-Through vs Write-Back in Distributed Systems.
        </p>
      </section>

      <section id="request-flow" className="method-section">
        <h2 className="method-title">Complete Request Flow</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">This is the full trip of one request, from the user's phone to the database and back, using everything on this page.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>DNS:</strong> turns amazon.in into an IP address.</li>
            <li className="com-list-item"><strong>CDN:</strong> serves images, CSS and JS from a nearby city.</li>
            <li className="com-list-item"><strong>Load balancer:</strong> receives the API call, handles HTTPS, picks a server.</li>
            <li className="com-list-item"><strong>API server:</strong> runs your code.</li>
            <li className="com-list-item"><strong>Cache:</strong> checked first for the data.</li>
            <li className="com-list-item"><strong>Database:</strong> asked only when the cache does not have it.</li>
          </ol>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`User opens amazon.in
  |
  |-- 1. DNS: amazon.in -> 13.x.x.x
  |-- 2. Static files (logo, JS, CSS) -> CDN edge (nearby city)
  |
  |-- 3. API call: GET /api/products/42 (HTTPS)
          |
     [ Load Balancer ]  -- SSL ends here
          |
     [ API Server ]
          |-- 4. Redis: product:42 ?  -- hit -> return
          |-- 5. miss -> Database -> save in Redis -> return
          |
  <-- 6. JSON response back to the user`}
        </CodeBlock>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You open a product on Amazon. The page design and photos come from the CDN in your city. The price and stock come from the API. The API checks Redis first, and only goes to the database if the product is not cached. All this happens in a few hundred milliseconds.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SystemDesignWebInfrastructure;
