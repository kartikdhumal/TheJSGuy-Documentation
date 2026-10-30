import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisScaling() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Replication, Sentinel &amp; Cluster</h1>
      <p className="com-text">
        One Redis server has two limits:
          <br />1. If it dies, everything stops. (This is about availability.)
          <br />2. It can only hold as much data as its RAM. (This is about capacity.)
          Replication and Sentinel fix the first problem. Cluster fixes the second.
      </p>

      <section className="method-section">
        <h2 className="method-title">Replication (master - replica)</h2>
        <p className="com-text">
          One server, the master, takes all the writes. One or more replicas (copies) keep a copy of the master's data, and they can answer reads. Copying happens in the background: the master does not wait for the replicas. So a replica can be a little behind, and the last few writes can be lost if the master dies suddenly. Use replicas to handle more reads, and as spare copies ready to take over.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# On the replica (redis.conf)
replicaof 10.0.0.1 6379

INFO replication     # check role, connected replicas, lag`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Sentinel (automatic failover)</h2>
        <p className="com-text">
          Replication alone does not switch to a replica when the master dies. You would have to do it by hand. Sentinel is a group of watcher processes (run at least 3). They keep an eye on the master. If enough of them (the quorum) agree it is down, they make a replica the new master and tell clients the new address. It is like a team picking a new captain when the old one gets hurt. Your app connects to Sentinel, not straight to an IP.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const redis = new Redis({
  sentinels: [
    { host: '10.0.0.11', port: 26379 },
    { host: '10.0.0.12', port: 26379 },
    { host: '10.0.0.13', port: 26379 },
  ],
  name: 'mymaster', // the master group name Sentinel watches
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Cluster (sharding)</h2>
        <p className="com-text">
          Redis Cluster splits your data across several masters. All keys are divided into 16,384 hash slots (buckets). Each key goes to slot CRC16(key) mod 16384, and each master owns a range of slots. Each master can have replicas, and the cluster switches to a replica by itself when a master dies (no Sentinel needed). This way you can store more than one machine's RAM, and the load is spread out.
        </p>
        <p className="com-text">
          The catch: a command that uses several keys (MGET, transactions, Lua scripts) only works if all those keys are in the same slot. You make that happen with hash tags. Only the part inside {'{}'} is used to pick the slot. So user:{'{101}'}:cart and user:{'{101}'}:profile end up in the same slot. This is also why BullMQ asks for a queue prefix with braces in a cluster, like {'{bull}'}.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const cluster = new Redis.Cluster([
  { host: '10.0.0.1', port: 7000 },
  { host: '10.0.0.2', port: 7000 },
]);

// Same hash tag {101} -> same slot -> multi-key commands work
await cluster.mget('user:{101}:cart', 'user:{101}:profile');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Which one do I need?</h2>
        <p className="com-text">
          Small app or just a cache: one Redis (plus persistence, or a managed service).
          It must keep running even if a server dies, and the data fits on one machine: master + replicas + Sentinel. Or a managed service that switches over by itself, like AWS ElastiCache.
          Data too big for one machine, or a very high number of writes: Redis Cluster.
        </p>
      </section>
    </div>
  );
}

export default RedisScaling;
