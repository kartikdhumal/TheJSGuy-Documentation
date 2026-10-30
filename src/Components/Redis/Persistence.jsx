import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function RedisPersistence() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Persistence (RDB &amp; AOF)</h1>
      <p className="com-text">
        Redis keeps data in RAM, so what happens when the server restarts? Without persistence, everything is gone. Persistence means Redis also writes data to disk so it can load it back after a restart. There are two methods, and you can use both.
      </p>

      <section className="method-section">
        <h2 className="method-title">RDB (snapshot)</h2>
        <p className="com-text">
          RDB saves a full snapshot of all data to a file (dump.rdb) at intervals, for example "every 5 minutes if at least 100 keys changed". Redis forks a child process to write the file, so the main thread keeps serving clients.
          Good: small compact file, very fast restart, great for backups.
          Bad: you can lose the data written since the last snapshot (minutes of data).
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# redis.conf
save 900 1      # snapshot if at least 1 change in 15 minutes
save 300 100    # or 100 changes in 5 minutes

# Manual snapshot
BGSAVE          # in the background (safe)
SAVE            # blocks Redis until done (avoid in production)`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">AOF (Append Only File)</h2>
        <p className="com-text">
          AOF logs every write command to a file. On restart, Redis replays the log to rebuild the data. How often it syncs to disk is set by appendfsync:
          always: after every write (safest, slowest).
          everysec: once per second (default, good balance, you can lose at most about 1 second).
          no: let the operating system decide (fastest, least safe).
          The file keeps growing, so Redis rewrites it in the background into the shortest form (AOF rewrite).
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# redis.conf
appendonly yes
appendfsync everysec

BGREWRITEAOF    # compact the AOF file manually`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">RDB vs AOF</h2>
        <p className="com-text">
          RDB: periodic snapshot, smaller file, faster restart, more possible data loss.
          AOF: log of every write, bigger file, slower restart, much less data loss.
          Both together: the recommended production setup when data matters (AOF for safety, RDB for backups). Pure cache: you can turn persistence off completely, since the database can always refill the cache.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Persistence is not a backup plan alone</h2>
        <p className="com-text">
          Persistence protects you from restarts on the same machine. If the disk or server dies, you still lose data. For real safety, copy RDB files to another place (for example S3) and use replication so a second server has the data too. Managed services (AWS ElastiCache, Redis Cloud) handle this for you.
        </p>
      </section>
    </div>
  );
}

export default RedisPersistence;
