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
        Redis keeps data in RAM. So what happens when the server restarts? Without persistence, everything is gone. Persistence means Redis also saves the data to disk, so it can load it back after a restart. There are two ways to do it, and you can use both.
      </p>

      <section className="method-section">
        <h2 className="method-title">RDB (snapshot)</h2>
        <p className="com-text">
          RDB takes a full snapshot (a photo) of all the data and saves it to a file (dump.rdb) every so often. For example: "every 5 minutes, if at least 100 keys changed". Redis starts a child process to write the file, so the main thread keeps serving clients.
          Good: the file is small, restart is very fast, and it is great for backups.
          Bad: you can lose everything written since the last snapshot (a few minutes of data).
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
          AOF writes down every write command in a file, like a diary. On restart, Redis runs the diary again from the start to rebuild the data. The appendfsync setting decides how often it saves to disk:
          always: after every write (safest, slowest).
          everysec: once per second (the default, a good middle ground, you lose at most about 1 second).
          no: let the operating system decide (fastest, least safe).
          The file keeps growing. So Redis rewrites it in the background into the shortest version (this is called AOF rewrite).
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
          RDB: a snapshot every so often. Smaller file, faster restart, but you can lose more data.
          AOF: a log of every write. Bigger file, slower restart, but you lose much less data.
          Both together: the usual choice in production when the data matters (AOF to stay safe, RDB for backups).
          Only a cache: you can turn persistence off fully. The database can always fill the cache again.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Persistence alone is not a backup</h2>
        <p className="com-text">
          Persistence saves you when the same machine restarts. But if the disk or the server dies, the data is still lost. To be really safe, copy the RDB files to another place (for example S3). Also use replication, so a second server has the data too. Managed services (AWS ElastiCache, Redis Cloud) do this for you.
        </p>
      </section>
    </div>
  );
}

export default RedisPersistence;
