import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisTransactionsLua() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Transactions, Pipelining &amp; Lua</h1>
      <p className="com-text">
        One Redis command is always atomic (it happens fully, and nothing can sneak in between). But real work often needs a few commands together. For example: "decrease the stock and add the item to the order". Redis gives you three tools for this:
          <br />1. Pipelining: for speed.
          <br />2. Transactions: to run commands together.
          <br />3. Lua scripts: for logic that must be fully atomic.
      </p>

      <section className="method-section">
        <h2 className="method-title">Pipelining (speed)</h2>
        <p className="com-text">
          Normally each command waits for its reply before the next one is sent. That is one trip over the network for every command. A pipeline sends many commands at once and reads all the replies together. So 100 commands need one trip instead of 100. Think of buying 10 things in one trip to the shop instead of 10 trips. Pipelining is only about speed. Commands from other clients can still run in between yours.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const pipeline = redis.pipeline();
pipeline.set('a', 1);
pipeline.incr('counter');
pipeline.get('a');
const results = await pipeline.exec();
// [[null, 'OK'], [null, 5], [null, '1']]  -> [error, result] per command`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Transactions: MULTI / EXEC</h2>
        <p className="com-text">
          MULTI starts a transaction. The commands after it wait in a line. EXEC runs them all together, and nothing from other clients can run in between.
          This is not the same as a SQL transaction:
          <br />1. There is no rollback (no undo). If one command fails while running (for example INCR on a text value), the others still run.
          <br />2. Inside the transaction, you can't use the result of one command to decide the next one.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`MULTI
DECR stock:5
RPUSH orders:101 "product:5"
EXEC        # both run together, no other client in between

DISCARD     # cancel a transaction instead of EXEC`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">WATCH (optimistic locking)</h2>
        <p className="com-text">
          Call WATCH on a key before MULTI. If another client changes that key before your EXEC, your whole transaction is cancelled (EXEC returns null), and you try again. This is called "check-and-set": save your changes only if nobody touched the data in the meantime.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`async function buyOne(productId) {
  const key = \`stock:\${productId}\`;
  await redis.watch(key);
  const stock = Number(await redis.get(key));
  if (stock <= 0) { await redis.unwatch(); return false; }

  const result = await redis.multi().decr(key).exec();
  if (result === null) return buyOne(productId);   // someone changed stock: retry
  return true;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Lua scripts (best for safe read-and-write logic)</h2>
        <p className="com-text">
          Lua is a small programming language. Redis can run a Lua script inside itself as one atomic step. The script can read, decide and write, and no other command can run in between. It is simpler than WATCH (no retry loop), and it needs only one network trip. Keep scripts short. While a script runs, Redis serves nobody else. BullMQ uses a lot of Lua scripts to move jobs between states safely.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`// Decrease stock only if enough is left (atomic)
const script = \`
  local stock = tonumber(redis.call('GET', KEYS[1]) or '0')
  if stock >= tonumber(ARGV[1]) then
    return redis.call('DECRBY', KEYS[1], ARGV[1])
  end
  return -1
\`;

const left = await redis.eval(script, 1, 'stock:5', 2); // 1 key, then args
if (left === -1) console.log('Out of stock');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Which one to use?</h2>
        <p className="com-text">
          Many separate commands, and you want speed: Pipeline.
          A few commands that must run together, with no decisions: MULTI/EXEC.
          Read first, then write based on what you read: Lua script (or WATCH + MULTI with retries).
        </p>
      </section>
    </div>
  );
}

export default RedisTransactionsLua;
