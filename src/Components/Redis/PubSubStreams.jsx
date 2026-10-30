import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisPubSubStreams() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Pub/Sub &amp; Streams</h1>
      <p className="com-text">
        Redis can also move messages between parts of your system. Pub/Sub is "live broadcast": whoever is listening right now gets the message. Streams are "a message log": messages are stored, and consumers can read them later, track what they processed, and retry.
      </p>

      <section className="method-section">
        <h2 className="method-title">Pub/Sub</h2>
        <p className="com-text">
          A publisher sends a message to a channel. Every subscriber connected to that channel gets it instantly. It is fire-and-forget: Redis does not store the message. If a subscriber is offline, it misses the message forever. Use it for live notifications, chat, or telling all servers "clear your local cache".
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import Redis from 'ioredis';

// A connection in subscribe mode can only subscribe, so use a separate one
const sub = new Redis();
const pub = new Redis();

await sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  console.log(\`[\${channel}]\`, JSON.parse(message));
});

await pub.publish('notifications', JSON.stringify({ userId: 101, text: 'Hi!' }));

// Pattern subscribe: all channels starting with "order:"
await sub.psubscribe('order:*');`}
        </CodeBlock>
        <p className="com-text">
          Key point: Pub/Sub has at-most-once delivery. Good for real-time UI updates, not for important work that must not be lost.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Streams</h2>
        <p className="com-text">
          A stream is an append-only log. Each entry gets an ID (time-based, like 1730107200000-0). Consumers can read from any point, so nothing is lost when they are offline. With consumer groups, several workers share the work: each message goes to only one worker in the group, the worker must acknowledge it (XACK), and unacknowledged messages stay in a Pending list so they can be retried. This gives at-least-once delivery, like a simple Kafka.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# Producer: add events (* = auto ID)
XADD orders * orderId 501 amount 1200

# Create a consumer group that starts from new messages
XGROUP CREATE orders billing $ MKSTREAM

# Worker "w1" in group "billing" reads new messages (">" = never delivered)
XREADGROUP GROUP billing w1 COUNT 10 BLOCK 5000 STREAMS orders >

# After processing, acknowledge so it is not delivered again
XACK orders billing 1730107200000-0

# See messages delivered but not yet acknowledged (crashed worker?)
XPENDING orders billing`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Pub/Sub vs Streams vs List</h2>
        <p className="com-text">
          Pub/Sub: no storage, all subscribers get every message, lost if offline. Use for live broadcasts.
          Streams: stored, consumer groups, acknowledgements, replay history. Use for event processing that must not lose messages.
          List (LPUSH + BRPOP): a simple queue, one consumer gets each item, but no built-in acknowledgement or retry. For real job queues, use BullMQ, which adds retries, delays, priorities and much more on top of Redis.
        </p>
      </section>
    </div>
  );
}

export default RedisPubSubStreams;
