import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function LLDApiDbDesign() {
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
      <h1 className="title">API &amp; Database Design</h1>
      <div className="definition-box">
        <p className="definition-label">In simple words</p>
        <p className="definition-text">In many LLD rounds you are asked: "Design the APIs and the tables for this app." This page shows you how to do both in a clean way.</p>
        <ol className="com-list">
          <li className="com-list-item"><strong>REST API design:</strong> how to name URLs, pick HTTP methods, return status codes and errors.</li>
          <li className="com-list-item"><strong>Idempotency:</strong> making sure a retry does not charge the user twice.</li>
          <li className="com-list-item"><strong>Schema design:</strong> turning your classes into database tables with the right keys and indexes.</li>
        </ol>
      </div>

      <section id="rest-api-design" className="method-section">
        <h2 className="method-title">REST API Design</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">A REST API is a set of URLs that let the app read and change data. Good APIs are easy to guess: if you know one endpoint, you can guess the others.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Use nouns, not verbs:</strong> /orders, not /getOrders or /createOrder. The HTTP method already says the action.</li>
            <li className="com-list-item"><strong>Use plurals:</strong> /restaurants and /restaurants/42, not /restaurant.</li>
            <li className="com-list-item"><strong>Nested resources:</strong> when one thing belongs to another, nest it: /restaurants/42/menu-items. Don't go deeper than 2 levels.</li>
            <li className="com-list-item"><strong>Versioning:</strong> put the version in the URL like /v1/orders, so you can change things later in /v2 without breaking old apps.</li>
            <li className="com-list-item"><strong>Same error format everywhere:</strong> every error should look the same, so the frontend can handle it in one place.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            Zomato's mobile app on an old phone may not update for months. If Zomato changes the response of /orders, those old apps break. So they keep /v1 working and add the new shape in /v2. That is why versioning matters.
          </p>
        </div>

        <h3 className="com-subtitle">HTTP methods</h3>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Method</th><th>What it does</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr><td>GET</td><td>Read data. Never changes anything.</td><td>GET /v1/orders/101</td></tr>
              <tr><td>POST</td><td>Create something new.</td><td>POST /v1/orders</td></tr>
              <tr><td>PUT</td><td>Replace the whole thing.</td><td>PUT /v1/users/7/address</td></tr>
              <tr><td>PATCH</td><td>Change only some fields.</td><td>PATCH /v1/orders/101 with status</td></tr>
              <tr><td>DELETE</td><td>Remove it.</td><td>DELETE /v1/cart/items/5</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="com-subtitle">Status codes you must know</h3>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Code</th><th>Meaning</th><th>When to use</th></tr>
            </thead>
            <tbody>
              <tr><td>200 OK</td><td>All good</td><td>Successful GET, PATCH, PUT</td></tr>
              <tr><td>201 Created</td><td>New thing made</td><td>Successful POST</td></tr>
              <tr><td>204 No Content</td><td>Done, nothing to send back</td><td>Successful DELETE</td></tr>
              <tr><td>400 Bad Request</td><td>Your input is wrong</td><td>Missing field, bad format</td></tr>
              <tr><td>401 Unauthorized</td><td>Who are you?</td><td>No token or expired token</td></tr>
              <tr><td>403 Forbidden</td><td>I know you, but you can't do this</td><td>User tries to see another user's order</td></tr>
              <tr><td>404 Not Found</td><td>It doesn't exist</td><td>Wrong order id</td></tr>
              <tr><td>409 Conflict</td><td>Clash with current state</td><td>Seat already booked, email already used</td></tr>
              <tr><td>422 Unprocessable Entity</td><td>Format is fine but data fails rules</td><td>Quantity is -2</td></tr>
              <tr><td>429 Too Many Requests</td><td>Slow down</td><td>Rate limit hit</td></tr>
              <tr><td>500 Internal Server Error</td><td>Our bug</td><td>Something crashed on the server</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="com-subtitle">Pagination: offset vs cursor</h3>
        <p className="com-text">Pagination means sending data in small pages instead of all 10,000 rows at once.</p>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr><th>Point</th><th>Offset</th><th>Cursor</th></tr>
            </thead>
            <tbody>
              <tr><td>URL looks like</td><td>?page=3&amp;limit=20 or ?offset=40&amp;limit=20</td><td>?cursor=abc123&amp;limit=20</td></tr>
              <tr><td>How it works</td><td>Skip N rows, take the next 20</td><td>Start after the last item you saw (by id or time)</td></tr>
              <tr><td>Jump to page 50?</td><td>Yes, easy</td><td>No, only next / previous</td></tr>
              <tr><td>Speed on big tables</td><td>Slow on deep pages (DB still reads skipped rows)</td><td>Fast, uses an index</td></tr>
              <tr><td>New rows added while scrolling</td><td>You may see duplicates or miss items</td><td>Stable, no duplicates</td></tr>
              <tr><td>Good for</td><td>Admin tables with page numbers</td><td>Infinite scroll feeds, order history</td></tr>
            </tbody>
          </table>
        </div>
        <p className="com-text">
          Filtering and sorting go in query params too: GET /v1/restaurants?city=pune&amp;cuisine=biryani&amp;sort=-rating&amp;limit=20. A minus sign before a field often means "descending".
        </p>

        <h3 className="com-subtitle">Example endpoints for a food-ordering app</h3>
        <CodeBlock language="text" style={atomDark}>
          {`GET    /v1/restaurants?city=pune&cuisine=biryani&cursor=xyz&limit=20
GET    /v1/restaurants/42
GET    /v1/restaurants/42/menu-items
POST   /v1/cart/items                 { "menuItemId": 9, "qty": 2 }
PATCH  /v1/cart/items/9               { "qty": 3 }
DELETE /v1/cart/items/9
POST   /v1/orders                     (header: Idempotency-Key)
GET    /v1/orders?status=delivered&cursor=abc
GET    /v1/orders/101
PATCH  /v1/orders/101                 { "status": "CANCELLED" }
POST   /v1/orders/101/payments        (header: Idempotency-Key)`}
        </CodeBlock>

        <h3 className="com-subtitle">One error format for everything</h3>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Every error response has the same shape
interface ApiError {
  error: {
    code: string;        // machine-friendly, e.g. "ITEM_OUT_OF_STOCK"
    message: string;     // human-friendly
    details?: Record<string, string>; // field-level problems
  };
}

// Example: 409 Conflict
const body: ApiError = {
  error: {
    code: 'ITEM_OUT_OF_STOCK',
    message: 'Paneer Tikka is not available right now',
    details: { menuItemId: '9' },
  },
};

// Cursor-paginated list response
interface Page<T> {
  data: T[];
  nextCursor: string | null; // null means no more pages
}`}
        </CodeBlock>
      </section>

      <section id="idempotency" className="method-section">
        <h2 className="method-title">Idempotency</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">An API is idempotent if calling it once or calling it 5 times gives the same final result. Retrying is safe.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Why it matters:</strong> networks fail. The app sends "pay 500", the server pays, but the reply is lost. The app retries. Without idempotency, the user pays twice.</li>
            <li className="com-list-item"><strong>Idempotent by design:</strong> GET, PUT, DELETE (and HEAD, OPTIONS). Deleting order 101 twice still leaves it deleted. Setting the address twice gives the same address.</li>
            <li className="com-list-item"><strong>Not idempotent:</strong> POST. Each call creates a new thing. PATCH can go either way: "set qty to 3" is safe, "add 1 to qty" is not.</li>
            <li className="com-list-item"><strong>Fix for POST:</strong> the client sends a unique Idempotency-Key header (like a UUID) with the request. The server saves the result against that key. If the same key comes again, it returns the saved result and does not do the work again.</li>
            <li className="com-list-item"><strong>Keep keys for a while:</strong> usually 24 hours is enough, then let them expire.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            You book an IRCTC Tatkal ticket, the screen freezes, and you press "Pay" again. Or your Paytm UPI payment shows "pending" and the app retries in the background. Payment systems like Razorpay and Stripe accept an idempotency key so that the second click does not take money again. The user is charged only once.
          </p>
        </div>
        <CodeBlock language="typescript" style={atomDark}>
          {`import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());
const redis = createClient();
await redis.connect();

app.post('/v1/orders/:id/payments', async (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) {
    return res.status(400).json({
      error: { code: 'KEY_REQUIRED', message: 'Idempotency-Key header is required' },
    });
  }

  const redisKey = \`idem:\${key}\`;

  // 1. Seen this key before? Return the saved response.
  const saved = await redis.get(redisKey);
  if (saved) {
    const { status, body } = JSON.parse(saved);
    return res.status(status).json(body);
  }

  // 2. Lock the key so two parallel retries don't both run (NX = only if not exists)
  const inProgress = { error: { code: 'IN_PROGRESS', message: 'Payment is in progress' } };
  const locked = await redis.set(
    redisKey,
    JSON.stringify({ status: 409, body: inProgress }),
    { NX: true, EX: 86400 },   // keep the key for 24 hours
  );
  if (!locked) return res.status(409).json(inProgress);

  // 3. Do the real work once
  const payment = await chargeCustomer(req.params.id, req.body.amount);
  const body = { paymentId: payment.id, status: 'SUCCESS' };

  // 4. Save the final response for 24 hours
  await redis.set(redisKey, JSON.stringify({ status: 201, body }), { EX: 86400 });
  res.status(201).json(body);
});`}
        </CodeBlock>
        <p className="com-text">
          In a real system you also save the key in the payments table with a UNIQUE constraint, so even if Redis loses data, the database will refuse a second payment with the same key. If the charge fails, delete the key so the user can try again.
        </p>
      </section>

      <section id="schema-design" className="method-section">
        <h2 className="method-title">Database Schema Design</h2>
        <div className="definition-box">
          <p className="definition-label">In simple words</p>
          <p className="definition-text">Schema design means deciding which tables you need, what columns each has, and how tables link to each other.</p>
          <ol className="com-list">
            <li className="com-list-item"><strong>Entities to tables:</strong> each main noun (User, Restaurant, Order) becomes a table. Each row is one record.</li>
            <li className="com-list-item"><strong>Primary key (PK):</strong> a column that is unique for every row, like id. It identifies the row.</li>
            <li className="com-list-item"><strong>Foreign key (FK):</strong> a column that points to the PK of another table, like orders.user_id pointing to users.id. The DB stops you from pointing to a user who doesn't exist.</li>
            <li className="com-list-item"><strong>One-to-one:</strong> one user has one profile. Put user_id with a UNIQUE rule in the profile table.</li>
            <li className="com-list-item"><strong>One-to-many:</strong> one restaurant has many menu items. Put restaurant_id in the menu_items table (the "many" side).</li>
            <li className="com-list-item"><strong>Many-to-many:</strong> one order has many menu items, and one menu item is in many orders. Make a middle table (join table) order_items with order_id and menu_item_id.</li>
            <li className="com-list-item"><strong>Normalization:</strong> store each fact in only one place. Don't copy the restaurant name into every order row; store restaurant_id and join. This avoids data going out of sync.</li>
            <li className="com-list-item"><strong>When to denormalize (copy data on purpose):</strong> when reads are very heavy and joins are slow, or when you need a snapshot. Example: save the item price inside order_items, because the menu price may change tomorrow but the old bill must not.</li>
            <li className="com-list-item"><strong>Indexes:</strong> an index is like the index at the back of a book. It makes search fast. Add indexes on columns you search, filter, join or sort by (user_id, status, created_at). Don't add them everywhere, because each index slows down inserts and updates.</li>
            <li className="com-list-item definition-default"><strong>Defaults:</strong> a column allows NULL unless you write NOT NULL, and its default value is NULL unless you write DEFAULT. PRIMARY KEY and UNIQUE columns get an index automatically in both PostgreSQL and MySQL. In PostgreSQL, a FOREIGN KEY column does NOT get an index automatically, so add one yourself (MySQL InnoDB creates one if it is missing). If you don't write ON DELETE, the default is NO ACTION, which means deleting a parent row that still has child rows fails with an error.</li>
          </ol>
        </div>
        <div className="example-box">
          <p className="example-label">Real-world example</p>
          <p className="com-text">
            On Swiggy, a restaurant changes the price of Chicken Biryani from 250 to 280. Your order from last week must still show 250. That is why order_items stores price_at_order, a copy of the price at that moment. And when you open "My Orders", the app searches orders by user_id, so orders.user_id must have an index, or the page becomes slow when there are crores of orders.
          </p>
        </div>
        <p className="com-text">Simple diagram of the tables:</p>
        <CodeBlock language="text" style={atomDark}>
          {`users 1 ---- * orders * ---- 1 restaurants
                  |                   |
                  1                   1
                  |                   |
                  * order_items * ---- 1 menu_items * (belongs to restaurant)

orders 1 ---- * payments
(1 = one, * = many)`}
        </CodeBlock>
        <p className="com-text">Full small schema for a food-ordering app (PostgreSQL):</p>
        <CodeBlock language="sql" style={atomDark}>
          {`CREATE TABLE users (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(15)  NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE restaurants (
  id     BIGSERIAL PRIMARY KEY,
  name   VARCHAR(150) NOT NULL,
  city   VARCHAR(50)  NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0
);
CREATE INDEX idx_restaurants_city ON restaurants(city);

CREATE TABLE menu_items (
  id            BIGSERIAL PRIMARY KEY,
  restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          VARCHAR(150) NOT NULL,
  price_paise   INT NOT NULL CHECK (price_paise > 0),
  is_available  BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);

CREATE TABLE orders (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id),
  restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
  status        VARCHAR(20) NOT NULL DEFAULT 'PLACED',
  total_paise   INT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Join table: many-to-many between orders and menu_items
CREATE TABLE order_items (
  order_id       BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id   BIGINT NOT NULL REFERENCES menu_items(id),
  qty            INT NOT NULL CHECK (qty > 0),
  price_at_order INT NOT NULL,          -- denormalized snapshot of the price
  PRIMARY KEY (order_id, menu_item_id)
);

CREATE TABLE payments (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES orders(id),
  amount_paise    INT NOT NULL,
  status          VARCHAR(20) NOT NULL,
  idempotency_key VARCHAR(64) NOT NULL UNIQUE  -- stops double payment
);
CREATE INDEX idx_payments_order ON payments(order_id);`}
        </CodeBlock>
        <ol className="com-list">
          <li className="com-list-item"><strong>Money in paise (INT):</strong> never store money as FLOAT. 0.1 + 0.2 is not exactly 0.3 in floats. Store 25000 paise instead of 250.00 rupees, or use NUMERIC.</li>
          <li className="com-list-item"><strong>Composite PK in order_items:</strong> (order_id, menu_item_id) means the same item can't appear twice in one order. Increase qty instead.</li>
          <li className="com-list-item"><strong>ON DELETE CASCADE:</strong> used only where children have no meaning alone (menu items of a deleted restaurant, items of a deleted order). Orders are not cascaded from users, because you usually must keep order history.</li>
        </ol>
      </section>
    </div>
  );
}

export default LLDApiDbDesign;
