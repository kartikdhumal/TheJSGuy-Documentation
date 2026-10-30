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
        Redis can also carry messages between parts of your app. There are two ways.
          Pub/Sub is like a live radio show: only people listening right now hear it.
          Streams are like a message log: messages are saved. Readers (consumers) can read them later, remember what they already handled, and try again if something failed.
      </p>

      <section className="method-section">
        <h2 className="method-title">Pub/Sub</h2>
        <p className="com-text">
          A publisher sends a message to a channel. Every subscriber on that channel gets it right away. It is "send and forget": Redis does not save the message. If a subscriber is offline, it misses that message forever. Use it for live notifications, chat, or telling all your servers "clear your local cache".
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
          Remember: Pub/Sub is "at-most-once". Each message arrives once or not at all. That is fine for live UI updates, but not for important work that must not get lost.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Streams</h2>
        <p className="com-text">
          A stream is a log where you can only add to the end. Each entry gets an ID based on time, like 1730107200000-0. Consumers can start reading from any point, so nothing is lost while they are offline.
          With consumer groups, several workers share the work:
          <br />1. Each message goes to only one worker in the group.
          <br />2. The worker must say "done" (acknowledge it with XACK).
          <br />3. Messages that are not acknowledged stay in a Pending list, so they can be tried again.
          This gives "at-least-once" delivery: every message is handled at least one time. It works like a small, simple Kafka.
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
          Pub/Sub: nothing is saved. All subscribers get every message. If you are offline, you miss it. Use it for live broadcasts.
          Streams: messages are saved. You get consumer groups, acknowledgements, and you can replay old messages. Use it for event processing where no message may be lost.
          List (LPUSH + BRPOP): a simple queue. One consumer gets each item. But there is no built-in "done" message and no retry. For real job queues, use BullMQ. It adds retries, delays, priorities and much more on top of Redis.
        </p>
      </section>
    </div>
  );
}

export default RedisPubSubStreams;
