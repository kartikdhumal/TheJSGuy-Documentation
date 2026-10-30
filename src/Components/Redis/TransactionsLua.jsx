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
        One Redis command is always atomic. But real work often needs several commands together, for example "decrease stock and add to the order". Redis has three tools for this: pipelining (for speed), transactions (for running commands together), and Lua scripts (for real atomic logic).
      </p>

      <section className="method-section">
        <h2 className="method-title">Pipelining (speed)</h2>
        <p className="com-text">
          Normally every command waits for its reply before the next is sent, which is one network round trip each. A pipeline sends many commands in one go and reads all replies together. 100 commands in one round trip instead of 100. It is about speed only: other clients' commands can still run in between.
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
          MULTI starts a transaction; commands are queued; EXEC runs them all together with nothing from other clients in between. Important differences from SQL transactions: there is no rollback. If one command fails at run time (for example INCR on a text value), the others still run. And you cannot use the result of one command to decide the next inside the transaction.
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
          WATCH a key before MULTI. If any other client changes that key before your EXEC, the whole transaction is cancelled (EXEC returns null) and you retry. This is "check-and-set": only commit if nobody touched the data meanwhile.
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
        <h2 className="method-title">Lua scripts (best for atomic logic)</h2>
        <p className="com-text">
          A Lua script runs inside Redis as one atomic step: read, decide and write, with no other command in between. It is simpler than WATCH (no retry loop) and needs only one round trip. Keep scripts short, because while a script runs, Redis serves nobody else. BullMQ uses Lua scripts heavily to move jobs between states safely.
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
          Many independent commands, need speed: Pipeline. A few commands that must run together, no decisions: MULTI/EXEC. Read-then-write where the decision depends on current data: Lua script (or WATCH + MULTI with retries).
        </p>
      </section>
    </div>
  );
}

export default RedisTransactionsLua;
