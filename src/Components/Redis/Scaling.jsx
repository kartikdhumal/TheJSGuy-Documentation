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
        One Redis server has two limits: if it dies, everything stops (availability), and it can only hold as much data as its RAM (capacity). Replication and Sentinel solve availability. Cluster solves capacity.
      </p>

      <section className="method-section">
        <h2 className="method-title">Replication (master - replica)</h2>
        <p className="com-text">
          One master accepts writes. One or more replicas keep a copy of the master's data and can serve reads. Replication is asynchronous: the master does not wait for replicas, so a replica can be slightly behind, and the last few writes can be lost if the master dies suddenly. Use replicas for read scaling and as standby copies.
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
          Replication alone does not switch to a replica when the master dies; you would have to do it by hand. Sentinel is a set of watcher processes (run at least 3). They monitor the master; if a majority (the quorum) agree it is down, they promote a replica to be the new master and tell clients the new address. Your app connects to Sentinel, not directly to an IP.
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
          Redis Cluster splits data across several masters. The key space is divided into 16,384 hash slots; each key goes to slot CRC16(key) mod 16384, and each master owns a range of slots. Each master can have replicas, and the cluster fails over by itself (no Sentinel needed). This lets you grow beyond one machine's RAM and spread the load.
        </p>
        <p className="com-text">
          The catch: a command that uses several keys (MGET, transactions, Lua scripts) only works if all keys are in the same slot. You force that with hash tags: only the part inside {'{}'} is hashed, so user:{'{101}'}:cart and user:{'{101}'}:profile land in the same slot. This is also why BullMQ asks you to use a queue prefix with braces in a cluster, like {'{bull}'}.
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
          Small app / cache: one Redis (plus persistence or a managed service). Need high availability, data fits in one machine: master + replicas + Sentinel (or a managed service with automatic failover, like AWS ElastiCache). Data too big for one machine or very high write load: Redis Cluster.
        </p>
      </section>
    </div>
  );
}

export default RedisScaling;
