import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDParkingLot() {
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
      <h1 className="title">LLD: Parking Lot</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">We are building the code for a parking lot with many floors: a vehicle comes in, gets a ticket and a spot, and when it leaves it pays and the spot becomes free again.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Why it is asked:</strong> it is the most common machine coding question. It checks if you can turn a real thing into clean classes.</li>
          <li className="com-list-item"><strong>Main idea:</strong> each vehicle needs a spot of the right size. A bike fits a small spot, a car a medium spot, a truck a large spot.</li>
          <li className="com-list-item"><strong>Key patterns:</strong> Strategy for pricing and for finding a spot, Singleton for the one ParkingLot, Factory to create vehicles.</li>
          <li className="com-list-item"><strong>Time:</strong> in an interview you get about 45 to 60 minutes. Keep it simple and working first, then improve.</li>
        </ol>
      </div>

      <section id="requirements" className="method-section">
        <h2 className="method-title">Requirements</h2>
        <p className="com-text">Always start by asking questions and writing down what the system must do. Do not jump into code.</p>
        <p className="com-text"><strong>Functional (what it does):</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Many floors:</strong> the lot has many floors, and each floor has many spots.</li>
          <li className="com-list-item"><strong>Vehicle types:</strong> bike, car and truck.</li>
          <li className="com-list-item"><strong>Spot sizes:</strong> small (bike), medium (car), large (truck).</li>
          <li className="com-list-item"><strong>Entry gate:</strong> finds a free spot of the right size, marks it taken and gives a ticket.</li>
          <li className="com-list-item"><strong>Exit gate:</strong> takes the ticket, calculates the fee based on time, and frees the spot.</li>
          <li className="com-list-item"><strong>Show free spots:</strong> a display shows how many spots are free per floor and per size.</li>
        </ol>
        <p className="com-text"><strong>Non-functional (how well it does it):</strong></p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Easy to change:</strong> new pricing rules (weekend price, monthly pass) should not need changes in old code.</li>
          <li className="com-list-item"><strong>Safe with many gates:</strong> two entry gates must never give the same spot to two vehicles.</li>
          <li className="com-list-item"><strong>Fast:</strong> finding a spot should feel instant, even with thousands of spots.</li>
        </ol>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Think of a mall parking in Bengaluru. At the entry, the machine prints a ticket with the time. The board at each floor shows "Floor 2: 14 car spots free". When you leave, you give the ticket at the exit, it shows "2 hours = 60 rupees", you pay, and the barrier opens. That is exactly what we are coding.
          </p>
        </div>
      </section>

      <section id="entities" className="method-section">
        <h2 className="method-title">Entities (classes)</h2>
        <p className="com-text">A simple trick: the nouns in the requirements become your classes. The verbs become their methods.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Vehicle:</strong> has a number plate and a type (bike, car, truck).</li>
          <li className="com-list-item"><strong>ParkingSpot:</strong> has an id, a size and knows if it is free. It can park and remove a vehicle.</li>
          <li className="com-list-item"><strong>ParkingFloor:</strong> holds a list of spots and can count free spots.</li>
          <li className="com-list-item"><strong>Ticket:</strong> remembers which vehicle, which spot and the entry time.</li>
          <li className="com-list-item"><strong>ParkingLot:</strong> the main class. Holds the floors and has park() and unpark(). Only one exists (Singleton).</li>
          <li className="com-list-item"><strong>SpotFinder (strategy):</strong> decides which free spot to give.</li>
          <li className="com-list-item"><strong>PricingStrategy:</strong> decides how much to charge.</li>
        </ol>
        <CodeBlock language="text" style={atomDark}>
          {`+-------------------+        +------------------+
|    ParkingLot     |1      * |   ParkingFloor   |
| (Singleton)       |-------->| spots[]          |
| park(vehicle)     |         | freeCount(size)  |
| unpark(ticketId)  |         +--------+---------+
+---+-----------+---+                  |1
    |           |                      |*
    | uses      | uses        +--------v---------+
    v           v             |   ParkingSpot    |
+-----------+ +-------------+ | id, size         |
|SpotFinder | |PricingStrat.| | vehicle?         |
|findSpot() | |calculate()  | | park() / free()  |
+-----------+ +-------------+ +------------------+

+-----------+        +---------------------+
|  Vehicle  |<-------|       Ticket        |
| plate     |        | vehicle, spot,      |
| type      |        | entryTime           |
+-----------+        +---------------------+`}
        </CodeBlock>
      </section>

      <section id="code" className="method-section">
        <h2 className="method-title">Code</h2>
        <p className="com-text"><strong>Part 1: enums, vehicle and spot.</strong> An enum is just a fixed list of allowed values.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`enum VehicleType { BIKE = 'BIKE', CAR = 'CAR', TRUCK = 'TRUCK' }
enum SpotSize { SMALL = 'SMALL', MEDIUM = 'MEDIUM', LARGE = 'LARGE' }

// Which spot size each vehicle needs
const SIZE_FOR: Record<VehicleType, SpotSize> = {
  [VehicleType.BIKE]: SpotSize.SMALL,
  [VehicleType.CAR]: SpotSize.MEDIUM,
  [VehicleType.TRUCK]: SpotSize.LARGE,
};

class Vehicle {
  constructor(public readonly plate: string, public readonly type: VehicleType) {}
}

// Factory: one place that creates vehicles
class VehicleFactory {
  static create(plate: string, type: VehicleType): Vehicle {
    return new Vehicle(plate, type);
  }
}

class ParkingSpot {
  private vehicle: Vehicle | null = null;
  constructor(public readonly id: string, public readonly size: SpotSize) {}

  isFree(): boolean { return this.vehicle === null; }
  park(v: Vehicle): void {
    if (!this.isFree()) throw new Error(\`Spot \${this.id} is taken\`);
    this.vehicle = v;
  }
  free(): void { this.vehicle = null; }
}

class ParkingFloor {
  constructor(public readonly number: number, public readonly spots: ParkingSpot[]) {}

  freeCount(size: SpotSize): number {
    return this.spots.filter((s) => s.isFree() && s.size === size).length;
  }
}`}
        </CodeBlock>
        <p className="com-text"><strong>Part 2: the two strategies.</strong> Each one is an interface with small classes behind it, so you can swap them.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface SpotFinder {
  findSpot(floors: ParkingFloor[], size: SpotSize): ParkingSpot | null;
}

// Fill the lowest floor first (closest to the entry)
class NearestFirstFinder implements SpotFinder {
  findSpot(floors: ParkingFloor[], size: SpotSize): ParkingSpot | null {
    for (const floor of floors) {
      const spot = floor.spots.find((s) => s.isFree() && s.size === size);
      if (spot) return spot;
    }
    return null;
  }
}

interface PricingStrategy {
  calculate(type: VehicleType, hours: number): number;
}

// Simple rate per hour, by vehicle type
class HourlyPricing implements PricingStrategy {
  private rates: Record<VehicleType, number> = {
    [VehicleType.BIKE]: 10,
    [VehicleType.CAR]: 30,
    [VehicleType.TRUCK]: 60,
  };
  calculate(type: VehicleType, hours: number): number {
    return Math.max(1, Math.ceil(hours)) * this.rates[type]; // minimum 1 hour
  }
}`}
        </CodeBlock>
        <p className="com-text"><strong>Part 3: ticket and the main ParkingLot class.</strong></p>
        <CodeBlock language="typescript" style={atomDark}>
          {`interface Ticket {
  id: string;
  vehicle: Vehicle;
  spot: ParkingSpot;
  entryTime: Date;
}

class ParkingLot {
  private static instance: ParkingLot | null = null;
  private tickets = new Map<string, Ticket>();
  private counter = 0;

  private constructor(
    private floors: ParkingFloor[],
    private finder: SpotFinder,
    private pricing: PricingStrategy,
  ) {}

  // Singleton: only one parking lot object in the app
  static getInstance(floors: ParkingFloor[], finder: SpotFinder, pricing: PricingStrategy): ParkingLot {
    if (!ParkingLot.instance) ParkingLot.instance = new ParkingLot(floors, finder, pricing);
    return ParkingLot.instance;
  }

  // Entry gate
  park(vehicle: Vehicle): Ticket {
    const spot = this.finder.findSpot(this.floors, SIZE_FOR[vehicle.type]);
    if (!spot) throw new Error('Parking full for this vehicle type');
    spot.park(vehicle);
    const ticket: Ticket = { id: \`T\${++this.counter}\`, vehicle, spot, entryTime: new Date() };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  // Exit gate
  unpark(ticketId: string, exitTime = new Date()): number {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error('Invalid ticket');
    const hours = (exitTime.getTime() - ticket.entryTime.getTime()) / 3_600_000;
    const fee = this.pricing.calculate(ticket.vehicle.type, hours);
    ticket.spot.free();
    this.tickets.delete(ticketId);
    return fee;
  }

  // Display board
  freeSpots(): string[] {
    return this.floors.map((f) =>
      \`Floor \${f.number}: \` +
      \`bike \${f.freeCount(SpotSize.SMALL)}, \` +
      \`car \${f.freeCount(SpotSize.MEDIUM)}, \` +
      \`truck \${f.freeCount(SpotSize.LARGE)}\`,
    );
  }
}`}
        </CodeBlock>
        <p className="com-text"><strong>Part 4: using it.</strong></p>
        <CodeBlock language="typescript" style={atomDark}>
          {`const floor0 = new ParkingFloor(0, [
  new ParkingSpot('0-S1', SpotSize.SMALL),
  new ParkingSpot('0-M1', SpotSize.MEDIUM),
  new ParkingSpot('0-L1', SpotSize.LARGE),
]);
const lot = ParkingLot.getInstance([floor0], new NearestFirstFinder(), new HourlyPricing());

const car = VehicleFactory.create('KA-01-AB-1234', VehicleType.CAR);
const ticket = lot.park(car);          // gets spot 0-M1
console.log(lot.freeSpots());          // ['Floor 0: bike 1, car 0, truck 1']
const later = new Date(ticket.entryTime.getTime() + 2.5 * 3_600_000);
console.log(lot.unpark(ticket.id, later)); // 3 hours x 30 = 90`}
        </CodeBlock>
      </section>

      <section id="patterns" className="method-section">
        <h2 className="method-title">Patterns and SOLID used</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Strategy (pricing):</strong> the fee rule lives in its own class. Want a weekend price? Write a WeekendPricing class and pass it in. ParkingLot does not change.</li>
          <li className="com-list-item"><strong>Strategy (spot finding):</strong> today it is "nearest floor first". Tomorrow it could be "spot closest to the lift" or "spread cars evenly". Again, just a new class.</li>
          <li className="com-list-item"><strong>Singleton:</strong> there is only one real parking lot, so the app keeps only one ParkingLot object. In NestJS you get this for free, because providers are singletons by default.</li>
          <li className="com-list-item"><strong>Factory:</strong> VehicleFactory is the single place that creates vehicles. If you later add ElectricCar with extra fields, you change only the factory.</li>
          <li className="com-list-item"><strong>Single Responsibility (S):</strong> spot knows if it is free, floor counts spots, pricing calculates money. Each class has one job.</li>
          <li className="com-list-item"><strong>Open/Closed (O):</strong> you add new behaviour by adding classes, not by editing old ones.</li>
          <li className="com-list-item"><strong>Dependency Inversion (D):</strong> ParkingLot depends on the SpotFinder and PricingStrategy interfaces, not on the real classes. This also makes testing easy, because you can pass a fake.</li>
        </ol>
      </section>

      <section id="follow-ups" className="method-section">
        <h2 className="method-title">Follow-up questions</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Two gates pick the same spot at the same time. What now?</strong> In one process, use a lock (mutex) around find + park. With many servers, keep spots in a database and use SELECT ... FOR UPDATE, or an atomic update like UPDATE spots SET vehicle = ? WHERE id = ? AND vehicle IS NULL and check that 1 row changed.</li>
          <li className="com-list-item"><strong>Can a bike park in a car spot if small spots are full?</strong> Yes, add a fallback list: SMALL, then MEDIUM, then LARGE. Put this logic inside the SpotFinder, so nothing else changes.</li>
          <li className="com-list-item"><strong>How do you make finding a spot faster?</strong> Keep a queue (or set) of free spots per size per floor. Then finding is O(1) instead of looping over every spot.</li>
          <li className="com-list-item"><strong>How do you add an electric charging spot?</strong> Add a new SpotSize or a flag on ParkingSpot, and a finder that prefers charging spots for electric vehicles.</li>
          <li className="com-list-item"><strong>How do you update the display board live?</strong> Use the Observer pattern: when a spot changes, it tells the board. Over the network, you can push updates with WebSockets.</li>
          <li className="com-list-item"><strong>What about payment?</strong> Add a Payment class with a status (PENDING, PAID, FAILED) and a PaymentMethod strategy (cash, card, UPI). Free the spot only after payment succeeds.</li>
        </ol>
      </section>
    </div>
  );
}

export default LLDParkingLot;
