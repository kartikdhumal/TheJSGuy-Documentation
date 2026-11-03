import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDBehavioralPatterns() {
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
      <h1 className="title">Behavioral Patterns</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Behavioral patterns are about how objects talk to each other and share work, so no single class has to do everything.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Observer:</strong> when something happens, tell everyone who signed up for it.</li>
          <li className="com-list-item"><strong>Strategy:</strong> keep many ways of doing one task, and pick one at runtime (while the app is running).</li>
          <li className="com-list-item"><strong>Chain of Responsibility:</strong> pass a request through a line of handlers, one after another.</li>
        </ol>
      </div>

      <section id="observer" className="method-section">
        <h2 className="method-title">Observer</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Observer means one object (the subject) keeps a list of listeners (observers), and tells all of them when something changes.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> when an order status changes, you need to send SMS, email and push. If the order code calls all three directly, it must change every time you add a new channel.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a YouTube channel. You subscribe once. When a new video comes, every subscriber gets a notification. The creator doesn't call each person.</li>
            <li className="com-list-item"><strong>When to use:</strong> one event, many reactions. Notifications, live UI updates, audit logs, analytics.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when the order of steps matters a lot, or you need the result back right away. Also, too many listeners make it hard to see "what happens when X changes". Forgetting to unsubscribe causes memory leaks.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On Swiggy, your order goes from "Placed" to "Picked up" to "Delivered". Each time, you get a push message, an SMS and maybe an email. The order service just says "status changed". The SMS, email and push senders are listening and each one does its own job.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`type OrderStatus = 'PLACED' | 'PICKED_UP' | 'DELIVERED';

interface OrderObserver {
  update(orderId: string, status: OrderStatus): void;
}

class SmsNotifier implements OrderObserver {
  update(orderId: string, status: OrderStatus) { console.log('SMS:', orderId, status); }
}
class EmailNotifier implements OrderObserver {
  update(orderId: string, status: OrderStatus) { console.log('Email:', orderId, status); }
}
class PushNotifier implements OrderObserver {
  update(orderId: string, status: OrderStatus) { console.log('Push:', orderId, status); }
}

class Order {
  private observers: OrderObserver[] = [];
  constructor(public id: string) {}

  subscribe(o: OrderObserver) { this.observers.push(o); }
  unsubscribe(o: OrderObserver) { this.observers = this.observers.filter(x => x !== o); }

  setStatus(status: OrderStatus) {
    // the order does not know who is listening, it just tells everyone
    this.observers.forEach(o => o.update(this.id, status));
  }
}

// Usage
const order = new Order('ORD-101');
order.subscribe(new SmsNotifier());
order.subscribe(new EmailNotifier());
order.subscribe(new PushNotifier());
order.setStatus('PICKED_UP'); // all three get the update`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: Node.js EventEmitter is this pattern. emitter.on('order:updated', fn) subscribes, and emitter.emit('order:updated', data) tells everyone. In NestJS, @nestjs/event-emitter with @OnEvent() works the same way. RxJS Observables (used a lot in Angular and in NestJS microservices) are built on this idea: you call subscribe() to listen. In the browser, addEventListener('click', fn) is an observer too. At a bigger scale, Kafka or Redis Pub/Sub is the same idea across services.
        </p>
      </section>

      <section id="strategy" className="method-section">
        <h2 className="method-title">Strategy</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Strategy means you write each way of doing a task as its own class with the same method, and swap them when needed.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> a big if/else or switch that grows every time a new rule comes. One function becomes 200 lines and every change can break another case.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> Google Maps. Same trip, but you choose car, bike, bus or walk. Each one finds the route in its own way. The app just says "find route".</li>
            <li className="com-list-item"><strong>When to use:</strong> pricing rules, discount rules, sorting options, payment or shipping rules, where the rule is picked at runtime.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when there are only two simple cases that will never grow. A small if/else is easier to read.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On Uber or Ola, the fare for the same trip is different for Auto, Mini and Sedan. Each ride type is one strategy. The booking code just calls calculate(). When the company adds "Bike taxi", you add one new class and touch nothing else.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface FareStrategy {
  calculate(km: number, minutes: number): number;
}

class AutoFare implements FareStrategy {
  calculate(km: number) { return 30 + km * 12; }
}
class MiniFare implements FareStrategy {
  calculate(km: number, minutes: number) { return 50 + km * 15 + minutes * 1; }
}
class SedanFare implements FareStrategy {
  calculate(km: number, minutes: number) { return 80 + km * 20 + minutes * 2; }
}

class FareCalculator {
  constructor(private strategy: FareStrategy) {}

  setStrategy(strategy: FareStrategy) { this.strategy = strategy; }

  getFare(km: number, minutes: number, surge = 1) {
    return Math.round(this.strategy.calculate(km, minutes) * surge);
  }
}

// Usage: same trip, different strategies
const calc = new FareCalculator(new AutoFare());
console.log(calc.getFare(10, 25));      // 150

calc.setStrategy(new SedanFare());
console.log(calc.getFare(10, 25, 1.5)); // 495 (rainy day surge)`}
        </CodeBlock>
        <p className="com-text">
          Factory vs Strategy: a factory is about creating the right object. A strategy is about swapping how a task is done. They are often used together: a factory picks the right fare strategy based on the ride type. Where you already used it: Passport.js literally calls each login method a "strategy" (JwtStrategy, GoogleStrategy in NestJS). Array.sort(compareFn) takes the sorting strategy as a function. In JavaScript, a strategy can just be a function, you don't always need a class.
        </p>
      </section>

      <section id="chain-of-responsibility" className="method-section">
        <h2 className="method-title">Chain of Responsibility</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Chain of Responsibility means a request passes through a line of handlers. Each handler checks it and either stops it or passes it to the next one.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> one big function that checks auth, then rate limit, then input, then runs the logic. It is hard to reuse, reorder or test each check alone.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> airport entry. Ticket check, then ID check, then security, then boarding gate. If one fails, you stop there and don't reach the next.</li>
            <li className="com-list-item"><strong>When to use:</strong> request pipelines, approval flows (manager, then director, then CFO), support ticket levels, form validation steps.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when there is just one or two fixed checks. Long chains can also be hard to debug, because you don't know which handler stopped the request.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            A "create order" API request first checks the login token, then checks if the user sent too many requests in the last minute (rate limit), then checks the body is valid. Only if all pass does it reach the real order code. You can add a new check, like "is the user blocked?", by adding one handler to the chain.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface Req { token?: string; userId?: string; body: any }

abstract class Handler {
  private next?: Handler;
  setNext(h: Handler): Handler { this.next = h; return h; }

  handle(req: Req): string {
    return this.next ? this.next.handle(req) : 'OK: order created';
  }
}

class AuthHandler extends Handler {
  handle(req: Req) {
    if (req.token !== 'valid-token') return '401 Unauthorized';
    req.userId = 'u1';
    return super.handle(req);
  }
}

class RateLimitHandler extends Handler {
  private counts = new Map<string, number>();
  handle(req: Req) {
    const count = (this.counts.get(req.userId!) ?? 0) + 1;
    this.counts.set(req.userId!, count);
    if (count > 5) return '429 Too Many Requests';
    return super.handle(req);
  }
}

class ValidationHandler extends Handler {
  handle(req: Req) {
    if (!req.body?.itemId) return '400 itemId is required';
    return super.handle(req);
  }
}

// Usage: build the chain auth -> rate limit -> validation
const chain = new AuthHandler();
chain.setNext(new RateLimitHandler()).setNext(new ValidationHandler());

console.log(chain.handle({ token: 'bad', body: {} }));                     // 401 Unauthorized
console.log(chain.handle({ token: 'valid-token', body: {} }));             // 400 itemId is required
console.log(chain.handle({ token: 'valid-token', body: { itemId: 7 } }));  // OK: order created`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: Express and NestJS middleware are a chain of responsibility. Each middleware gets (req, res, next). It can send a response and stop, or call next() to pass the request on. NestJS runs a request through middleware, then guards, then interceptors, then pipes, before your controller. That is a chain too. Axios interceptors and DOM event bubbling (a click goes from the button up to its parents) follow the same idea.
        </p>
      </section>
    </div>
  );
}

export default LLDBehavioralPatterns;
