import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDSolid() {
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
      <h1 className="title">SOLID &amp; Design Principles</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">Design principles are simple rules that keep your code easy to read, easy to test and easy to change. They are not laws. They are good habits.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>SOLID:</strong> 5 rules for writing good classes.</li>
          <li className="com-list-item"><strong>DRY, KISS, YAGNI:</strong> 3 short rules about not repeating, keeping it simple and not building things early.</li>
          <li className="com-list-item"><strong>Composition over inheritance:</strong> build objects from small parts instead of deep parent-child chains.</li>
        </ol>
      </div>

      <section id="solid" className="method-section">
        <h2 className="method-title">SOLID Principles</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">SOLID is 5 rules, one per letter.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>S - Single Responsibility:</strong> one class, one job.</li>
            <li className="com-list-item"><strong>O - Open/Closed:</strong> add new features by adding code, not by editing old code.</li>
            <li className="com-list-item"><strong>L - Liskov Substitution:</strong> a child class must work anywhere the parent works.</li>
            <li className="com-list-item"><strong>I - Interface Segregation:</strong> many small interfaces are better than one big one.</li>
            <li className="com-list-item"><strong>D - Dependency Inversion:</strong> depend on interfaces, not on exact classes.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Paytm started with a few payment methods and later added UPI, Postpaid, EMI and more. If the payment code was one huge class with if-else for each method, every new method would risk breaking the old ones. SOLID code lets the team add "Paytm Postpaid" as a new class and leave UPI code untouched.
          </p>
        </div>

        <div id="srp">
          <h3 className="com-subtitle">S - Single Responsibility Principle (SRP)</h3>
          <p className="com-text"><strong>Rule:</strong> a class should have only one reason to change. One class, one job.</p>
          <p className="com-text"><strong>Real life:</strong> in a restaurant, the chef cooks and the cashier takes money. If the chef also did billing, a change in GST rules would disturb the kitchen.</p>
          <p className="com-text">Bad: one class saves the order, sends the email and prints the invoice.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`class OrderService {
  placeOrder(order: Order) {
    // 1. save to DB
    db.query('INSERT INTO orders ...', [order.id]);
    // 2. send email
    smtp.send(order.userEmail, 'Order placed!');
    // 3. build invoice PDF
    pdf.create(\`Invoice for \${order.id}\`);
  }
}
// Email template changes? Edit OrderService.
// Invoice format changes? Edit OrderService again.`}
          </CodeBlock>
          <p className="com-text">Good: each job in its own class. OrderService only coordinates.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`class OrderRepository {
  save(order: Order) { /* DB code only */ }
}
class EmailService {
  sendOrderPlaced(email: string) { /* email code only */ }
}
class InvoiceService {
  generate(order: Order) { /* PDF code only */ }
}

class OrderService {
  constructor(
    private repo: OrderRepository,
    private email: EmailService,
    private invoice: InvoiceService,
  ) {}

  placeOrder(order: Order) {
    this.repo.save(order);
    this.email.sendOrderPlaced(order.userEmail);
    this.invoice.generate(order);
  }
}`}
          </CodeBlock>
        </div>

        <div id="ocp">
          <h3 className="com-subtitle">O - Open/Closed Principle (OCP)</h3>
          <p className="com-text"><strong>Rule:</strong> code should be open for adding new things, but closed for editing old, tested code.</p>
          <p className="com-text"><strong>Real life:</strong> a phone charger. You can plug in a new phone without opening the wall socket and rewiring it.</p>
          <p className="com-text">Bad: every new payment method means editing this if-else chain.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`class PaymentService {
  pay(type: string, amount: number) {
    if (type === 'upi') {
      // UPI logic
    } else if (type === 'card') {
      // card logic
    } else if (type === 'wallet') {
      // wallet logic
    }
    // Adding "netbanking" = editing this tested function again
  }
}`}
          </CodeBlock>
          <p className="com-text">Good: each method is a new class. Old code is not touched.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`interface PaymentMethod {
  pay(amount: number): void;
}

class UpiPayment implements PaymentMethod {
  pay(amount: number) { /* UPI logic */ }
}
class CardPayment implements PaymentMethod {
  pay(amount: number) { /* card logic */ }
}
// New method? Just add a class. Nothing else changes.
class NetBankingPayment implements PaymentMethod {
  pay(amount: number) { /* netbanking logic */ }
}

class PaymentService {
  pay(method: PaymentMethod, amount: number) {
    method.pay(amount);
  }
}`}
          </CodeBlock>
        </div>

        <div id="lsp">
          <h3 className="com-subtitle">L - Liskov Substitution Principle (LSP)</h3>
          <p className="com-text"><strong>Rule:</strong> if B is a child of A, you should be able to use B anywhere A is used, and nothing should break or surprise you.</p>
          <p className="com-text"><strong>Real life:</strong> if a shop says "any charger with a Type-C pin works", then every Type-C charger must actually charge. A fake one that sparks breaks the promise.</p>
          <p className="com-text">Bad: the child class throws an error for a method the parent promised.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`class Payment {
  pay(amount: number) { /* ... */ }
  refund(amount: number) { /* ... */ }
}

class GiftCardPayment extends Payment {
  refund(amount: number) {
    throw new Error('Gift cards cannot be refunded!');
  }
}

function cancelOrder(p: Payment, amount: number) {
  p.refund(amount); // crashes for GiftCardPayment
}`}
          </CodeBlock>
          <p className="com-text">Good: only promise what every child can really do. Split the ability out.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`interface Payment {
  pay(amount: number): void;
}
interface Refundable {
  refund(amount: number): void;
}

class CardPayment implements Payment, Refundable {
  pay(amount: number) { /* ... */ }
  refund(amount: number) { /* ... */ }
}
class GiftCardPayment implements Payment {
  pay(amount: number) { /* ... */ }
}

function cancelOrder(p: Refundable, amount: number) {
  p.refund(amount); // only refundable payments can come here
}`}
          </CodeBlock>
        </div>

        <div id="isp">
          <h3 className="com-subtitle">I - Interface Segregation Principle (ISP)</h3>
          <p className="com-text"><strong>Rule:</strong> don't force a class to write methods it does not need. Make small, focused interfaces.</p>
          <p className="com-text"><strong>Real life:</strong> a restaurant menu card. A veg customer should not have to read through 10 pages of non-veg items. Separate menus are easier.</p>
          <p className="com-text">Bad: one big interface. SMS has no subject or attachment, but it is forced to write them.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`interface Notifier {
  send(to: string, msg: string): void;
  setSubject(subject: string): void;
  attachFile(path: string): void;
}

class SmsNotifier implements Notifier {
  send(to: string, msg: string) { /* ok */ }
  setSubject() { throw new Error('SMS has no subject'); }
  attachFile() { throw new Error('SMS has no attachment'); }
}`}
          </CodeBlock>
          <p className="com-text">Good: small interfaces. Each class picks only what it needs.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`interface Sender {
  send(to: string, msg: string): void;
}
interface HasAttachments {
  attachFile(path: string): void;
}

class SmsNotifier implements Sender {
  send(to: string, msg: string) { /* ... */ }
}

class EmailNotifier implements Sender, HasAttachments {
  send(to: string, msg: string) { /* ... */ }
  attachFile(path: string) { /* ... */ }
}`}
          </CodeBlock>
        </div>

        <div id="dip">
          <h3 className="com-subtitle">D - Dependency Inversion Principle (DIP)</h3>
          <p className="com-text"><strong>Rule:</strong> your main business code should depend on an interface, not on one exact tool. The exact tool is passed in from outside (this is called dependency injection).</p>
          <p className="com-text"><strong>Real life:</strong> your phone has a SIM slot, not a SIM soldered inside. You can switch from Jio to Airtel without buying a new phone.</p>
          <p className="com-text">Bad: OrderService creates Razorpay itself. Switching to another gateway or testing it is painful.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`class RazorpayGateway {
  charge(amount: number) { /* real API call */ }
}

class OrderService {
  private gateway = new RazorpayGateway(); // tightly stuck

  checkout(amount: number) {
    this.gateway.charge(amount);
  }
}
// In tests, this will hit the real Razorpay API.`}
          </CodeBlock>
          <p className="com-text">Good: depend on an interface and pass the real thing in.</p>
          <CodeBlock language="typescript" style={atomDark}>
            {`interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

class RazorpayGateway implements PaymentGateway {
  async charge(amount: number) { /* real API */ }
}
class FakeGateway implements PaymentGateway {
  async charge(amount: number) { /* do nothing, for tests */ }
}

class OrderService {
  constructor(private gateway: PaymentGateway) {}
  async checkout(amount: number) {
    await this.gateway.charge(amount);
  }
}

const prod = new OrderService(new RazorpayGateway());
const test = new OrderService(new FakeGateway());`}
          </CodeBlock>
          <p className="com-text">NestJS does this for you: when you add a class in the constructor, Nest creates and passes it in automatically.</p>
        </div>
      </section>

      <section id="dry-kiss-yagni" className="method-section">
        <h2 className="method-title">DRY, KISS, YAGNI</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Three short rules that stop you from writing messy or extra code.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>DRY (Don't Repeat Yourself):</strong> if the same logic is copy-pasted in many places, put it in one function. Then a bug fix happens in one place.</li>
            <li className="com-list-item"><strong>KISS (Keep It Simple, Stupid):</strong> pick the simplest code that works. Clever code is hard for the next person to read.</li>
            <li className="com-list-item"><strong>YAGNI (You Aren't Gonna Need It):</strong> don't build features "for the future" that nobody asked for. Build them when they are really needed.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            DRY: Flipkart shows the delivery charge on the cart page, the checkout page and the order page. If each page calculates it with its own copy of the code, one day they will show different numbers. One shared function fixes that. YAGNI: building a "multi-currency" system for a small Indian food app on day one is wasted effort if you only sell in rupees.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`// DRY: one place for the rule
function deliveryCharge(cartTotal: number): number {
  return cartTotal >= 499 ? 0 : 40;
}

// KISS: simple and clear
const isAdult = (age: number) => age >= 18;
// not: const isAdult = (a: number) => !!(~~(a / 18));

// YAGNI: build what is asked
class Price {
  constructor(public amountInPaise: number) {}
}
// not: class Price with currency, exchangeRate, taxRegion, locale...
// when only INR is used today`}
        </CodeBlock>
        <h3 className="com-subtitle">When DRY goes too far</h3>
        <p className="com-text">
          Two pieces of code can look the same today but change for different reasons. If you force them into one shared function, it soon fills with if-else flags for each caller. That is worse than a little repetition.
        </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Sign of overdone DRY:</strong> a helper with many boolean flags like formatPrice(x, true, false, true).</li>
          <li className="com-list-item"><strong>Simple rule:</strong> repeat it once or twice. On the third time, if the reason is the same, then extract it (called the "rule of three").</li>
        </ol>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Overdone DRY: one function trying to serve everyone
function validate(input: any, isOrder: boolean, isUser: boolean, skipPhone?: boolean) {
  if (isOrder) { /* order rules */ }
  if (isUser && !skipPhone) { /* user rules */ }
  // ...grows forever
}

// Better: two small, clear functions
function validateOrder(order: OrderInput) { /* order rules */ }
function validateUser(user: UserInput) { /* user rules */ }`}
        </CodeBlock>
      </section>

      <section id="composition" className="method-section">
        <h2 className="method-title">Composition over Inheritance</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Instead of making a long chain of parent and child classes, build an object by giving it small parts (objects) that each do one job. "Has-a" is often better than "is-a".</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Problem with inheritance:</strong> a child gets everything from the parent, even what it doesn't want. Deep chains become hard to change.</li>
            <li className="com-list-item"><strong>Composition:</strong> the class holds other objects and calls them. You can mix and swap parts easily, even at runtime.</li>
            <li className="com-list-item"><strong>Still use inheritance when:</strong> it is a true, simple "is-a" relation and the chain is short (1 level).</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Swiggy sends order updates. Some users want SMS + push, some want only WhatsApp, some want email + push. With inheritance you would need classes like SmsAndPushNotifier, EmailAndPushNotifier... one for every combination. With composition, a Notifier just holds a list of channels, and you pick any mix.
          </p>
        </div>
        <p className="com-text">Bad: inheritance explodes into many classes.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`class Notifier { send(msg: string) {} }
class SmsNotifier extends Notifier {}
class SmsAndPushNotifier extends SmsNotifier {}
class SmsPushAndEmailNotifier extends SmsAndPushNotifier {}
// one class for every combination... this never ends`}
        </CodeBlock>
        <p className="com-text">Good: composition. Small channels, mixed as needed.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface Channel {
  send(userId: string, msg: string): void;
}

class SmsChannel implements Channel {
  send(userId: string, msg: string) { console.log(\`SMS -> \${userId}: \${msg}\`); }
}
class PushChannel implements Channel {
  send(userId: string, msg: string) { console.log(\`Push -> \${userId}: \${msg}\`); }
}
class WhatsAppChannel implements Channel {
  send(userId: string, msg: string) { console.log(\`WA -> \${userId}: \${msg}\`); }
}

class Notifier {
  constructor(private channels: Channel[]) {}
  notify(userId: string, msg: string) {
    this.channels.forEach((c) => c.send(userId, msg));
  }
}

const n = new Notifier([new SmsChannel(), new PushChannel()]);
n.notify('u42', 'Your order is out for delivery');`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default LLDSolid;
