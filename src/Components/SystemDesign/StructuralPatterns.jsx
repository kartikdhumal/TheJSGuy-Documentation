import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDStructuralPatterns() {
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
      <h1 className="title">Structural Patterns</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Structural patterns are about how classes and objects are joined together, so they fit and work well as one bigger piece.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Adapter:</strong> makes two things with different shapes fit together.</li>
          <li className="com-list-item"><strong>Decorator:</strong> wraps an object to add extra features, without changing it.</li>
          <li className="com-list-item"><strong>Facade:</strong> one simple front door that hides many complex parts.</li>
          <li className="com-list-item"><strong>Proxy:</strong> a stand-in object that controls access to the real one.</li>
        </ol>
      </div>

      <section id="adapter" className="method-section">
        <h2 className="method-title">Adapter</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An adapter is a small wrapper that changes one interface (the methods and inputs a class offers) into the interface your code expects.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> two libraries do the same job but have different method names and inputs. You don't want your whole app to know about both.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a travel plug adapter. Your Indian charger does not fit a UK socket, so you put an adapter in between. The charger and the socket don't change.</li>
            <li className="com-list-item"><strong>When to use:</strong> third-party SDKs, old legacy code, or switching providers (SMS, email, payment) without touching business code.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when you control both sides and can just make them use the same interface directly.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your app sends OTPs. You use Twilio, but for Indian numbers you also use MSG91 because it is cheaper. Twilio wants messages.create with to and body. MSG91 wants a different call with mobile and message. You make one SmsSender interface, and write one adapter for each provider. The OTP code only knows SmsSender.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`// What our app expects
interface SmsSender {
  send(phone: string, text: string): Promise<void>;
}

// Two outside SDKs with different shapes (simplified)
class TwilioClient {
  async createMessage(opts: { to: string; body: string }) { /* calls Twilio */ }
}
class Msg91Client {
  async sendSms(mobile: string, message: string, route: number) { /* calls MSG91 */ }
}

// Adapters: change their shape into ours
class TwilioAdapter implements SmsSender {
  constructor(private client: TwilioClient) {}
  send(phone: string, text: string) {
    return this.client.createMessage({ to: phone, body: text });
  }
}
class Msg91Adapter implements SmsSender {
  constructor(private client: Msg91Client) {}
  send(phone: string, text: string) {
    return this.client.sendSms(phone.replace('+91', ''), text, 4);
  }
}

// Usage: OTP code does not care which provider is behind
async function sendOtp(sms: SmsSender, phone: string, otp: string) {
  await sms.send(phone, 'Your OTP is ' + otp);
}

const phone = '+919876543210';
const sender: SmsSender = phone.startsWith('+91')
  ? new Msg91Adapter(new Msg91Client())
  : new TwilioAdapter(new TwilioClient());
await sendOtp(sender, phone, '482910');`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: Passport.js strategies adapt Google, GitHub and local login into one req.user shape. NestJS lets you switch the HTTP layer between Express and Fastify using an adapter (FastifyAdapter). Socket.IO uses adapters (like the Redis adapter) to plug in different backends.
        </p>
      </section>

      <section id="decorator" className="method-section">
        <h2 className="method-title">Decorator</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A decorator wraps an object and adds extra work before or after its methods, without changing the original class.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> you want logging, caching or retry on a service. Putting all that inside the service makes it messy, and you can't turn it on or off easily.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a plain coffee. Add milk, then sugar, then whipped cream. Each one wraps the coffee and adds something. It is still coffee.</li>
            <li className="com-list-item"><strong>When to use:</strong> cross-cutting things (work that many services need, like logging, caching, retry, timing) that you want to stack in any mix.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when there is only one fixed extra step. Too many layers of wrappers also make debugging and stack traces hard.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You call a weather API that is sometimes slow or fails. You want to log each call, retry when it fails, and cache the result for a few minutes. Each of these is its own small wrapper. The real WeatherService stays clean and only does the API call.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface WeatherService {
  getTemp(city: string): Promise<number>;
}

class ApiWeatherService implements WeatherService {
  async getTemp(city: string) { return 31; /* real API call here */ }
}

class LoggingDecorator implements WeatherService {
  constructor(private inner: WeatherService) {}
  async getTemp(city: string) {
    console.log('getTemp called for', city);
    return this.inner.getTemp(city);
  }
}

class RetryDecorator implements WeatherService {
  constructor(private inner: WeatherService, private times = 3) {}
  async getTemp(city: string) {
    for (let i = 1; ; i++) {
      try { return await this.inner.getTemp(city); }
      catch (err) { if (i >= this.times) throw err; }
    }
  }
}

class CacheDecorator implements WeatherService {
  private cache = new Map<string, number>();
  constructor(private inner: WeatherService) {}
  async getTemp(city: string) {
    if (this.cache.has(city)) return this.cache.get(city)!;
    const temp = await this.inner.getTemp(city);
    this.cache.set(city, temp);
    return temp;
  }
}

// Usage: stack them like layers
const weather = new CacheDecorator(new LoggingDecorator(new RetryDecorator(new ApiWeatherService())));
await weather.getTemp('Pune'); // logs, calls API
await weather.getTemp('Pune'); // from cache, no log`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: NestJS interceptors do the same job. A LoggingInterceptor or CacheInterceptor wraps your route handler and runs code before and after it. Express middleware like compression() wraps the response in a similar way. TypeScript decorators like @Get() or @Injectable() share the name and the idea of "adding something on top", but most of them mainly attach metadata (extra info that Nest reads later), so they are related but not exactly this pattern. React higher-order components like withRouter(Component) are also decorators.
        </p>
      </section>

      <section id="facade" className="method-section">
        <h2 className="method-title">Facade</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A facade is one simple method or class that hides many complex steps behind it.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> to place an order, the controller has to call inventory, payment, order DB and notification in the right order. Every caller repeats this, and it is easy to miss a step.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a hotel reception desk. You ask for a room. Reception talks to housekeeping, billing and room service for you.</li>
            <li className="com-list-item"><strong>When to use:</strong> when a task needs many services working together and callers should not know the details.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when it turns into a "god class" that does everything. Keep the facade thin. It should call other services, not hold all the logic itself.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On an e-commerce app like Myntra, clicking "Place Order" means: check stock, reserve it, charge the user, save the order, and send a confirmation. The controller just calls orderFacade.placeOrder(). All the steps live in one place.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`class InventoryService {
  async reserve(itemId: string, qty: number) { return true; }
}
class PaymentService {
  async charge(userId: string, amount: number) { return 'pay_123'; }
}
class OrderRepository {
  async save(order: object) { return 'order_789'; }
}
class NotificationService {
  async send(userId: string, msg: string) { /* SMS / email */ }
}

class OrderFacade {
  constructor(
    private inventory = new InventoryService(),
    private payment = new PaymentService(),
    private orders = new OrderRepository(),
    private notify = new NotificationService(),
  ) {}

  async placeOrder(userId: string, itemId: string, qty: number, amount: number) {
    const inStock = await this.inventory.reserve(itemId, qty);
    if (!inStock) throw new Error('Out of stock');

    const paymentId = await this.payment.charge(userId, amount);
    const orderId = await this.orders.save({ userId, itemId, qty, paymentId });
    await this.notify.send(userId, 'Order ' + orderId + ' placed!');
    return orderId;
  }
}

// Usage: the controller only sees one method
const orderId = await new OrderFacade().placeOrder('u1', 'shoe_42', 1, 2499);`}
        </CodeBlock>
        <p className="com-text">
          Where you already used it: an axios instance made with axios.create() is a facade over Node's http module. You call api.get('/users') and it handles headers, JSON parsing and errors for you. jQuery's $.ajax() is a classic facade over the old XMLHttpRequest. In NestJS, a service method that calls three other services and the controller only calls that one method is a facade.
        </p>
      </section>

      <section id="proxy" className="method-section">
        <h2 className="method-title">Proxy</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A proxy is an object that stands in front of the real object, has the same methods, and decides when and how to call the real one.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem it solves:</strong> the real object is slow, costly or needs protection. You want caching, lazy loading (create it only when first needed) or access checks, without changing it.</li>
            <li className="com-list-item"><strong>Real-life analogy:</strong> a personal assistant. You want to meet the CEO, but you talk to the assistant first. The assistant may answer you directly, ask you to wait, or say no.</li>
            <li className="com-list-item"><strong>When to use:</strong> caching slow calls, lazy loading heavy things, access control, rate limiting.</li>
            <li className="com-list-item"><strong>When NOT to use:</strong> when the real object is cheap and open. The extra layer only adds confusion.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Your product page calls a slow product API that takes 800 ms. A caching proxy has the same getProduct() method. If it already has the product, it returns it at once. If not, it calls the real API and keeps a copy for next time. The page code doesn't know it is talking to a proxy.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface ProductApi {
  getProduct(id: string): Promise<{ id: string; name: string; price: number }>;
}

class RealProductApi implements ProductApi {
  async getProduct(id: string) {
    console.log('Slow API call for', id);
    return { id, name: 'Running Shoes', price: 2499 };
  }
}

class CachingProductProxy implements ProductApi {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  constructor(private real: ProductApi, private ttlMs = 60_000) {}

  async getProduct(id: string) {
    const hit = this.cache.get(id);
    if (hit && hit.expiresAt > Date.now()) return hit.data; // cache hit

    const data = await this.real.getProduct(id);            // cache miss
    this.cache.set(id, { data, expiresAt: Date.now() + this.ttlMs });
    return data;
  }
}

// Usage: same methods, so the caller can't tell the difference
const api: ProductApi = new CachingProductProxy(new RealProductApi());
await api.getProduct('42'); // "Slow API call for 42"
await api.getProduct('42'); // from cache, no log`}
        </CodeBlock>
        <p className="com-text">
          Proxy vs Decorator: the code looks almost the same. The difference is the goal. A decorator adds new behavior (logging, retry). A proxy controls access to the real object (cache, lazy load, permission). Where you already used it: JavaScript has a built-in Proxy object, and Vue 3 uses it for reactivity. React.lazy() with Suspense is lazy loading: the component code loads only when it is first shown. An image with loading="lazy" works the same way. Nginx as a reverse proxy is the same idea at the server level.
        </p>
      </section>
    </div>
  );
}

export default LLDStructuralPatterns;
