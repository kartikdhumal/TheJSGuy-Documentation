import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDBasics() {
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
      <h1 className="title">LLD Basics</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">LLD (Low-Level Design) is about planning the code inside one service: which classes you make, what each class does, and how they talk to each other.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>What is LLD:</strong> the classes, interfaces and methods of one feature.</li>
          <li className="com-list-item"><strong>OOP:</strong> the 4 pillars that help you write clean classes.</li>
          <li className="com-list-item"><strong>Class relationships:</strong> how classes are connected (has-a, is-a, uses).</li>
          <li className="com-list-item"><strong>Approach:</strong> the steps to follow in an LLD or machine coding round.</li>
        </ol>
      </div>

      <section id="what-is-lld" className="method-section">
        <h2 className="method-title">What is LLD?</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">In an LLD round, you get a small problem like "design a parking lot" and you write the classes and working code for it. The interviewer wants to see if your code is clean and easy to change later.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Clean classes:</strong> good names, small methods, no giant "God class" that does everything.</li>
            <li className="com-list-item"><strong>Right responsibilities:</strong> each class does one job. Payment logic lives in a payment class, not in the order class.</li>
            <li className="com-list-item"><strong>Extensibility:</strong> adding a new feature (like a new payment method) should mean adding a new class, not editing 10 old ones.</li>
            <li className="com-list-item"><strong>Working code:</strong> most companies want code that actually runs, with a small demo in main().</li>
            <li className="com-list-item"><strong>HLD vs LLD in one line:</strong> HLD decides which boxes (servers, DB, cache) you need. LLD decides what code goes inside one box.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Think of Swiggy. HLD says: we need an Order Service, a Delivery Service, a database and a queue. LLD zooms into the Order Service and says: we need an Order class, a Cart class, an OrderStatus enum, a PaymentStrategy interface, and here is how they connect.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`// A tiny taste of LLD: classes with clear jobs
enum OrderStatus { PLACED, PREPARING, DELIVERED, CANCELLED }

class OrderItem {
  constructor(public name: string, public price: number, public qty: number) {}
  total(): number { return this.price * this.qty; }
}

class Order {
  private status = OrderStatus.PLACED;
  constructor(public id: string, private items: OrderItem[]) {}

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total(), 0);
  }

  cancel(): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('Delivered order cannot be cancelled');
    }
    this.status = OrderStatus.CANCELLED;
  }
}`}
        </CodeBlock>
      </section>

      <section id="oop" className="method-section">
        <h2 className="method-title">OOP in 5 Minutes</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">OOP (Object-Oriented Programming) means you group data and the functions that work on that data into one unit called a class. It has 4 main ideas, called pillars.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Encapsulation:</strong> hide the inside data, and only allow changes through safe methods.</li>
            <li className="com-list-item"><strong>Abstraction:</strong> show only what is needed, hide how it works.</li>
            <li className="com-list-item"><strong>Inheritance:</strong> a child class gets the code of a parent class (is-a relation).</li>
            <li className="com-list-item"><strong>Polymorphism:</strong> same method name, different behaviour based on the object.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Paytm wallet: you can't directly set your balance to 1 lakh. You can only add money or pay, and the app checks the rules (encapsulation). When you tap "Pay", you don't see the bank calls happening inside (abstraction). UPI, card and wallet are all "payment methods" (inheritance), and each one pays in its own way when you call pay() (polymorphism).
          </p>
        </div>

        <h3 className="com-subtitle">1. Encapsulation</h3>
        <p className="com-text">Real life: an ATM. You can't open it and take cash. You use the buttons, and the machine checks your PIN and balance.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`class Wallet {
  private balance = 0; // nobody outside can touch this directly

  addMoney(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
  }

  pay(amount: number): void {
    if (amount > this.balance) throw new Error('Not enough balance');
    this.balance -= amount;
  }

  getBalance(): number { return this.balance; }
}`}
        </CodeBlock>

        <h3 className="com-subtitle">2. Abstraction</h3>
        <p className="com-text">Real life: you drive a car with a steering wheel and pedals. You don't need to know how the engine burns fuel.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface NotificationSender {
  send(to: string, message: string): Promise<void>;
}

// The caller only knows "send". How SMS is sent is hidden inside.
class SmsSender implements NotificationSender {
  async send(to: string, message: string): Promise<void> {
    // call SMS provider API, retry, log... all hidden
    console.log(\`SMS to \${to}: \${message}\`);
  }
}`}
        </CodeBlock>

        <h3 className="com-subtitle">3. Inheritance</h3>
        <p className="com-text">Real life: a child gets some features from parents. A Bike is a Vehicle, so it gets all common vehicle things.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`class Vehicle {
  constructor(public number: string) {}
  describe(): string { return \`Vehicle \${this.number}\`; }
}

class Bike extends Vehicle {
  wheels = 2;
}

const b = new Bike('KA01AB1234');
console.log(b.describe()); // Vehicle KA01AB1234 (came from parent)`}
        </CodeBlock>

        <h3 className="com-subtitle">4. Polymorphism</h3>
        <p className="com-text">Real life: the word "open" means different things for a door, a laptop and a bank account. Same word, different action.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface PaymentMethod { pay(amount: number): void; }

class UpiPayment implements PaymentMethod {
  pay(amount: number) { console.log(\`Paid \${amount} via UPI\`); }
}
class CardPayment implements PaymentMethod {
  pay(amount: number) { console.log(\`Paid \${amount} via Card\`); }
}

function checkout(method: PaymentMethod, amount: number) {
  method.pay(amount); // works for any payment method
}

checkout(new UpiPayment(), 250);
checkout(new CardPayment(), 499);`}
        </CodeBlock>

        <h3 className="com-subtitle">Interface vs Abstract Class</h3>
        <p className="com-text">Both say "what a class must have". The difference is small but asked a lot.</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Point</th><th>Interface</th><th>Abstract class</th></tr>
            </thead>
            <tbody>
              <tr><td>Has code inside?</td><td>No, only the shape (method names and types)</td><td>Yes, can have some ready methods and some empty (abstract) ones</td></tr>
              <tr><td>How many can a class use?</td><td>Many (implements A, B)</td><td>Only one (extends A)</td></tr>
              <tr><td>Can hold state (fields with values)?</td><td>No</td><td>Yes</td></tr>
              <tr><td>Use when</td><td>You only want a contract, like "anything that can pay"</td><td>Child classes share some real code</td></tr>
              <tr><td>In TypeScript at runtime</td><td>Gone after compile (types only)</td><td>Stays as a real JS class</td></tr>
            </tbody>
          </table>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`abstract class BaseNotifier {
  // shared code for all children
  protected log(msg: string) { console.log(\`[notify] \${msg}\`); }

  // each child must write this
  abstract send(to: string, msg: string): void;
}

class EmailNotifier extends BaseNotifier {
  send(to: string, msg: string) {
    this.log(\`email to \${to}\`);
  }
}`}
        </CodeBlock>
      </section>

      <section id="class-relationships" className="method-section">
        <h2 className="method-title">Class Relationships (UML)</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Classes are connected to each other in a few common ways. Knowing the names helps you explain your design clearly.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Association:</strong> two classes know each other, but both live on their own. A Driver and a Rider in Ola.</li>
            <li className="com-list-item"><strong>Aggregation (weak has-a):</strong> one class has others, but they can live without it. A team has players. If the team breaks up, players still exist.</li>
            <li className="com-list-item"><strong>Composition (strong has-a):</strong> one class owns the other, and the part dies with the whole. A car has an engine made for it. A house has rooms.</li>
            <li className="com-list-item"><strong>Inheritance (is-a):</strong> a Bike is a Vehicle.</li>
            <li className="com-list-item"><strong>Dependency (uses):</strong> a class uses another for a short time, like inside one method. OrderService uses a PaymentGateway to pay, then forgets it.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            In Zomato: a Restaurant has a Menu, and the Menu has no meaning without the restaurant, so that is composition. A Restaurant has Delivery Partners, but partners work for many restaurants and stay even if one restaurant closes, so that is aggregation. A Customer places an Order, and both exist separately, so that is association.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Composition: Car creates and owns its Engine
class Engine { start() { console.log('Engine on'); } }
class Car {
  private engine = new Engine(); // made inside, dies with Car
  start() { this.engine.start(); }
}

// Aggregation: Team gets players from outside
class Player { constructor(public name: string) {} }
class Team {
  constructor(private players: Player[]) {} // players live on their own
}

// Dependency: used only inside one method
interface PaymentGateway { charge(amount: number): void; }
class OrderService {
  placeOrder(amount: number, gateway: PaymentGateway) {
    gateway.charge(amount);
  }
}`}
        </CodeBlock>
        <p className="com-text">A simple text UML diagram. You can draw this on a whiteboard in an interview:</p>
        <CodeBlock language="text" style={atomDark}>
          {`        +-------------+
        |   Vehicle   |   (parent)
        +-------------+
        | number      |
        +-------------+
          ^         ^
          | is-a    | is-a          (inheritance: arrow with empty head)
     +--------+  +--------+
     |  Bike  |  |  Car   |<>----- Engine     (composition: filled diamond)
     +--------+  +--------+
                     |
                     | uses ------> PaymentGateway   (dependency: dotted arrow)

     Team <>----- Player      (aggregation: empty diamond)
     Customer ------ Order    (association: plain line)`}
        </CodeBlock>
      </section>

      <section id="approach" className="method-section">
        <h2 className="method-title">How to Solve an LLD Question</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Follow the same steps every time. Don't jump into code in the first minute.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Clarify requirements:</strong> ask what features are must-have. "Parking lot with many floors? Bikes and cars? Payment by hour?" Write them down as a short list.</li>
            <li className="com-list-item"><strong>List entities and actions:</strong> nouns in the problem become classes (ParkingLot, Floor, Spot, Vehicle, Ticket). Verbs become methods (park, unpark, pay).</li>
            <li className="com-list-item"><strong>Define classes and relationships:</strong> who has whom, who is a type of whom. Draw a quick diagram.</li>
            <li className="com-list-item"><strong>Define interfaces:</strong> put things that can change behind an interface, like PaymentStrategy or PricingStrategy.</li>
            <li className="com-list-item"><strong>Apply patterns only where needed:</strong> Strategy for pricing, Singleton for the parking lot, Factory for vehicles. Don't force a pattern just to show off.</li>
            <li className="com-list-item"><strong>Write working code:</strong> start with the main flow (park a car, get a ticket, unpark, pay). Add a small demo at the end.</li>
            <li className="com-list-item"><strong>Handle edge cases:</strong> lot is full, wrong ticket, same car parked twice, two people booking the same spot at once.</li>
            <li className="com-list-item"><strong>Talk about extensions:</strong> "To add EV charging spots, I only add a new SpotType and a new pricing class."</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Problem: "Design IRCTC seat booking." Nouns: Train, Coach, Seat, Passenger, Booking, Payment. Verbs: searchTrains, bookSeat, cancelBooking, pay. Edge case: two users clicking the same last seat at the same second. You say: "I lock the seat while payment is going on." That one line shows real thinking.
          </p>
        </div>
        <p className="com-text">Rough time split for a 60 to 90 minute round:</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Step</th><th>60 min round</th><th>90 min round</th></tr>
            </thead>
            <tbody>
              <tr><td>Requirements and questions</td><td>5 min</td><td>10 min</td></tr>
              <tr><td>Entities, relationships, diagram</td><td>10 min</td><td>15 min</td></tr>
              <tr><td>Interfaces and class skeletons</td><td>10 min</td><td>15 min</td></tr>
              <tr><td>Working code of the main flow</td><td>25 min</td><td>35 min</td></tr>
              <tr><td>Edge cases, demo, extensions talk</td><td>10 min</td><td>15 min</td></tr>
            </tbody>
          </table>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Step 4 in action: things that change go behind an interface
interface PricingStrategy {
  calculate(hours: number): number;
}

class HourlyPricing implements PricingStrategy {
  constructor(private ratePerHour: number) {}
  calculate(hours: number) { return Math.ceil(hours) * this.ratePerHour; }
}

class FlatPricing implements PricingStrategy {
  constructor(private flat: number) {}
  calculate() { return this.flat; }
}

class Ticket {
  constructor(public vehicleNo: string, public entryTime: Date) {}
}

class PaymentService {
  constructor(private pricing: PricingStrategy) {}
  getAmount(ticket: Ticket, exitTime: Date): number {
    const hours = (exitTime.getTime() - ticket.entryTime.getTime()) / 3600000;
    return this.pricing.calculate(hours);
  }
}`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default LLDBasics;
