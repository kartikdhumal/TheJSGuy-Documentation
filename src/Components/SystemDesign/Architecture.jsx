import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SystemDesignArchitecture() {
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
      <h1 className="title">Architecture</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Architecture is how you split your app into parts and how those parts talk to each other.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Monolith:</strong> the whole app is one codebase and one deployment.</li>
          <li className="com-list-item"><strong>Microservices:</strong> the app is many small services, each doing one job.</li>
          <li className="com-list-item"><strong>API gateway:</strong> one front door that all requests pass through before reaching the services.</li>
        </ol>
      </div>

      <section id="monolith-vs-microservices" className="method-section">
        <h2 className="method-title">Monolith vs Microservices</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A monolith is one big app that does everything. Microservices break that app into many small apps that work together over the network.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Monolith:</strong> users, orders, payments and notifications all live in one project, share one database, and are deployed together.</li>
            <li className="com-list-item"><strong>Microservices:</strong> a User service, an Order service, a Payment service and so on. Each one is deployed on its own.</li>
            <li className="com-list-item"><strong>Modular monolith:</strong> one app and one deployment, but the code is split into clean modules (users, orders, payments) with clear boundaries. Later, a module can be pulled out into its own service easily.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Most big apps like Swiggy, Flipkart and Amazon started small and moved to microservices as their teams and traffic grew. With hundreds of developers, one codebase becomes slow to build and risky to deploy. Splitting it lets the payments team release changes without waiting for the search team.
          </p>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Point</th>
                <th>Monolith</th>
                <th>Microservices</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Codebase</td>
                <td>One</td>
                <td>Many, one per service</td>
              </tr>
              <tr>
                <td>Deployment</td>
                <td>Deploy everything together</td>
                <td>Deploy each service on its own</td>
              </tr>
              <tr>
                <td>Scaling</td>
                <td>Scale the whole app</td>
                <td>Scale only the busy service</td>
              </tr>
              <tr>
                <td>Database</td>
                <td>Usually one shared database</td>
                <td>Each service owns its own database</td>
              </tr>
              <tr>
                <td>Calls between parts</td>
                <td>Normal function calls (fast, no network)</td>
                <td>Network calls (slower, can fail)</td>
              </tr>
              <tr>
                <td>Debugging</td>
                <td>Easy, one place to look</td>
                <td>Hard, a request travels through many services</td>
              </tr>
              <tr>
                <td>Good for</td>
                <td>Small teams, new products, early startups</td>
                <td>Big teams, big traffic, parts that grow at different speeds</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">A monolith is the better choice when:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Small team:</strong> 2 to 10 developers can work well in one codebase.</li>
          <li className="com-list-item"><strong>New product:</strong> you don't yet know where the boundaries between parts should be. Splitting too early often splits in the wrong place.</li>
          <li className="com-list-item"><strong>No DevOps setup yet:</strong> microservices need CI/CD, monitoring, logging and tracing for every service.</li>
        </ol>
        <p className="com-text">
          A good answer in interviews: "Start with a modular monolith. Move a module to its own service only when there is a clear reason, like it needs to scale on its own or a separate team owns it."
        </p>
      </section>

      <section id="microservices" className="method-section">
        <h2 className="method-title">Microservices</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Microservices is a way to build an app as many small services. Each service does one business job, has its own code and its own database, and talks to others over the network.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Own database:</strong> the Order service never reads the Payment database directly. It asks the Payment service through its API. This keeps services independent.</li>
            <li className="com-list-item"><strong>Sync communication:</strong> one service calls another and waits for the answer, using REST (HTTP + JSON) or gRPC (a faster binary format). Simple, but if the other service is down, you are stuck too.</li>
            <li className="com-list-item"><strong>Async communication:</strong> one service drops a message or event in a queue (Kafka, RabbitMQ) and moves on. Others react to it later. More reliable, but harder to follow.</li>
            <li className="com-list-item"><strong>Service discovery:</strong> services start and stop all the time, so their IP addresses change. A service registry (like Consul, or Kubernetes DNS) keeps an up-to-date list, so a service can find another by its name.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            When you book an Ola ride, different services handle different jobs: one finds nearby drivers, one calculates the fare, one handles the payment, one sends notifications. During peak office hours, the driver-matching service gets the most load, so only that service is given more servers.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`        [ API Gateway ]
        /       |       \\
  [User Svc] [Order Svc] [Payment Svc]
      |          |            |
   [User DB]  [Order DB]  [Payment DB]

  Order Svc --(event: order_placed)--> [ Queue ] --> Notification Svc`}
        </CodeBlock>
        <p className="com-text">Two patterns you should know:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Circuit breaker:</strong> like the fuse in your house. If the Payment service keeps failing, the Order service stops calling it for a short time and fails fast (or shows a fallback) instead of waiting and piling up requests. After a while, it tries again with a few requests. If they work, normal calls start again.</li>
          <li className="com-list-item"><strong>Saga pattern:</strong> you can't run one database transaction across many services, because each has its own database. So a saga runs a chain of small local steps. If a step fails, it runs "undo" steps (called compensating actions) for the steps already done. For example: create order, take payment, reserve stock. If stock fails, refund the payment and cancel the order.</li>
        </ol>
        <p className="com-text">Problems microservices bring:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Network failures:</strong> calls can be slow or fail, so you need timeouts, retries and circuit breakers.</li>
          <li className="com-list-item"><strong>Data consistency:</strong> no simple transactions across services, so you need sagas and accept eventual consistency.</li>
          <li className="com-list-item"><strong>Debugging:</strong> one request passes through many services. You need central logs and distributed tracing (a request id that follows the request everywhere).</li>
          <li className="com-list-item"><strong>More DevOps work:</strong> many deployments, many pipelines, many things to monitor.</li>
        </ol>
      </section>

      <section id="api-gateway" className="method-section">
        <h2 className="method-title">API Gateway</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An API gateway is the single front door to your backend. The app sends every request to the gateway, and the gateway sends it to the right service.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Routing:</strong> /orders goes to the Order service, /users goes to the User service.</li>
            <li className="com-list-item"><strong>Auth:</strong> checks the token once at the door, so each service doesn't have to repeat it.</li>
            <li className="com-list-item"><strong>Rate limiting:</strong> blocks clients that send too many requests.</li>
            <li className="com-list-item"><strong>Logging and monitoring:</strong> one place to record every request, its time and its status.</li>
            <li className="com-list-item"><strong>Examples:</strong> Kong, AWS API Gateway, Nginx.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            The Flipkart app does not know about the dozens of services behind it. It just calls one domain. The gateway checks your login, makes sure you are not spamming, and then passes "show my cart" to the Cart service and "search shoes" to the Search service. If the Search service moves to new servers, the app does not need to change at all.
          </p>
        </div>
        <CodeBlock language="text" style={atomDark}>
          {`Mobile app / Website
        |
  [ API Gateway ]  -- check token, rate limit, log
    |      |      \\
 /users  /cart   /search
    |      |        |
 User    Cart    Search
 Svc     Svc      Svc`}
        </CodeBlock>
        <p className="com-text">
          Keep the gateway thin. It should handle common work like auth and routing, not business logic. Also run more than one copy of it, because if the only gateway goes down, the whole app goes down.
        </p>
      </section>

      <p className="com-text">
        Looking for SOLID principles? They are part of Low-Level Design. See <Link to="/lld-solid">SOLID Principles</Link>.
      </p>
    </div>
  );
}

export default SystemDesignArchitecture;
