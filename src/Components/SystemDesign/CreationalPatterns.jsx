import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDCreationalPatterns() {
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
      <h1 className="title">Creational Patterns</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">A design pattern is a ready-made solution to a code problem that many developers face again and again. You don't copy it like a library. You copy the idea.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Creational patterns:</strong> they are about how objects get created. Instead of writing new SomeClass() everywhere, you put the "making" part in one clean place.</li>
          <li className="com-list-item"><strong>Singleton:</strong> make only one object, and share it everywhere.</li>
          <li className="com-list-item"><strong>Factory:</strong> ask one function for an object, and it decides which class to create.</li>
          <li className="com-list-item"><strong>Builder:</strong> build a big object step by step, instead of one huge constructor.</li>
        </ol>
      </div>

      <section id="singleton" className="method-section">
        <h2 className="method-title">Singleton</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Singleton means a class has only one object (one instance) in the whole app, and everyone uses that same object.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> some things are costly or must be shared, like a database connection pool or a logger. If every file creates its own, you waste memory and connections.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a country has only one Prime Minister at a time. Everyone talks to the same person.</li>
            <li className="com-list-item"><strong>When to use:</strong> DB connection pool, logger, app config, a cache client like Redis.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> for normal business objects (User, Order) or anything that keeps per-user data. Then all users would share the same data.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your Node.js API talks to PostgreSQL. A connection pool (a group of ready, open DB connections) is costly to create. If the users service, orders service and payments service each made their own pool, you could hit the database connection limit fast. So you make one pool, and all services share it.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`import { Pool } from 'pg';

class Database {
  private static instance: Database;
  public readonly pool: Pool;

  // private: nobody outside can call "new Database()"
  private constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
    console.log('DB pool created');
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Usage
const db1 = Database.getInstance(); // logs "DB pool created"
const db2 = Database.getInstance(); // no log, same object
console.log(db1 === db2);           // true

await db1.pool.query('SELECT * FROM users WHERE id = $1', [42]);`}
        </CodeBlock>
        <p className="com-text">The downsides you should say in an interview:</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Global state:</strong> any file can use it and change it, so bugs are hard to trace.</li>
          <li className="com-list-item"><strong>Hard to test:</strong> you can't easily swap the real DB with a fake one in tests, and the object keeps its state between tests.</li>
          <li className="com-list-item"><strong>Hidden dependency:</strong> a class that calls Database.getInstance() inside does not show in its constructor that it needs a DB.</li>
        </ol>
        <p className="com-text">
          Where you already used it: in Node.js, a module is loaded once and then cached. So if db.ts does export const pool = new Pool(), every file that imports it gets the same pool. A module export is already a singleton per process (but each process, like each PM2 or cluster worker, gets its own copy). In NestJS, providers (services marked with @Injectable()) are singletons by default. Nest creates one UsersService and injects the same object everywhere. This is the better way, because you can still swap it with a mock in tests.
        </p>
      </section>

      <section id="factory" className="method-section">
        <h2 className="method-title">Factory</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A factory is one function or class whose only job is to create the right object for you, based on some input.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> without it, you write if/else with new UpiProcessor(), new CardProcessor() in many files. When you add a new type, you must change all those files.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> at a restaurant you say "one paneer tikka". You don't go into the kitchen. The kitchen decides how to make it and gives you the dish.</li>
            <li className="com-list-item"><strong>When to use:</strong> when you have many classes with the same shape (same interface) and the choice depends on input, like payment method, file type or notification channel.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when there is only one class and no plan for more. A plain new is simpler.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            At a Razorpay-like checkout, the user picks UPI, Card or NetBanking. Each one talks to a different bank system, but your order code just wants to call pay(). The factory looks at the method the user picked and gives back the right processor. Tomorrow you add Wallet, and only the factory changes.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface PaymentProcessor {
  pay(amount: number): Promise<string>;
}

class UpiProcessor implements PaymentProcessor {
  async pay(amount: number) { return 'UPI paid ' + amount; }
}
class CardProcessor implements PaymentProcessor {
  async pay(amount: number) { return 'Card paid ' + amount; }
}
class NetBankingProcessor implements PaymentProcessor {
  async pay(amount: number) { return 'NetBanking paid ' + amount; }
}

type Method = 'upi' | 'card' | 'netbanking';

class PaymentFactory {
  static create(method: Method): PaymentProcessor {
    switch (method) {
      case 'upi': return new UpiProcessor();
      case 'card': return new CardProcessor();
      case 'netbanking': return new NetBankingProcessor();
      default: throw new Error('Unknown payment method: ' + method);
    }
  }
}

// Usage: checkout code does not know which class it gets
async function checkout(method: Method, amount: number) {
  const processor = PaymentFactory.create(method);
  return processor.pay(amount);
}

checkout('upi', 499).then(console.log); // "UPI paid 499"`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: React.createElement('div') creates the right element from a type name. In NestJS, a provider with useFactory (for example, creating a DB connection based on config) is a factory. Libraries like winston.createLogger() and axios.create() are also factory functions: you pass options, they give you a ready object.
        </p>
      </section>

      <section id="builder" className="method-section">
        <h2 className="method-title">Builder</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A builder lets you create a big object step by step, with clear method names, and then call build() at the end.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> a constructor with 8 parameters like new Request('POST', url, null, 5000, true, ...) is hard to read. You forget the order, and you pass undefined for things you don't need.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> ordering at Subway. Pick the bread, then the filling, then the sauces, then "done". Each step is clear, and you skip what you don't want.</li>
            <li className="com-list-item"><strong>When to use:</strong> objects with many optional parts, like HTTP requests, SQL queries, emails or reports.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> small objects with 2 or 3 fields. A plain object literal is enough.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your app calls many outside APIs. Some need auth headers, some need a timeout, some need a JSON body, some need retries. A request builder lets each caller add only the parts it needs, in any order, and the code reads like plain English.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface HttpRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  timeoutMs: number;
}

class RequestBuilder {
  private req: HttpRequest = { method: 'GET', url: '', headers: {}, timeoutMs: 5000 };

  setUrl(url: string) { this.req.url = url; return this; } // "return this" allows chaining
  setMethod(method: string) { this.req.method = method; return this; }
  addHeader(key: string, value: string) { this.req.headers[key] = value; return this; }
  setJsonBody(body: unknown) {
    this.req.body = body;
    this.req.headers['Content-Type'] = 'application/json';
    return this;
  }
  setTimeout(ms: number) { this.req.timeoutMs = ms; return this; }

  build(): HttpRequest {
    if (!this.req.url) throw new Error('URL is required');
    return { ...this.req };
  }
}

// Usage
const request = new RequestBuilder()
  .setUrl('https://api.example.com/orders')
  .setMethod('POST')
  .addHeader('Authorization', 'Bearer abc123')
  .setJsonBody({ itemId: 7, qty: 2 })
  .setTimeout(3000)
  .build();`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: query builders like TypeORM's createQueryBuilder().select().where().orderBy().getMany() and Knex. In NestJS, new DocumentBuilder().setTitle().setVersion().build() for Swagger is a builder. Mongoose queries like User.find().sort().limit() work the same way.
        </p>
      </section>
    </div>
  );
}

export default LLDCreationalPatterns;
