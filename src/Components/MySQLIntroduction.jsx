import React, { useEffect } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MySQLIntroduction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to MySQL</h1>
      <p>
        MySQL is an open-source relational database management system (RDBMS) that uses SQL (Structured Query Language). It is widely used for web applications, e-commerce, and data warehousing.
      </p>

      <div className="method-section">
        <h2 className="method-title">What is MySQL?</h2>
        <ul>
          <li>Relational: data stored in tables with rows and columns.</li>
          <li>ACID-compliant: supports transactions.</li>
          <li>Client-server: MySQL server runs as a service; clients connect via network.</li>
          <li>Cross-platform: runs on Windows, Linux, macOS.</li>
        </ul>
      </div>

      <div className="method-section">
        <h2 className="method-title">Default Port: 3306</h2>
        <p>MySQL listens on TCP port <strong>3306</strong> for client connections.</p>
        <h3>Start MySQL on a custom port</h3>
        <CodeBlock language="bash" style={atomDark}>
          {`mysqld --port=3307`}
        </CodeBlock>
        <h3>Connect using custom port</h3>
        <CodeBlock language="bash" style={atomDark}>
          {`mysql -u username -p --port=3307`}
        </CodeBlock>
        <h3>Connection URI format</h3>
        <CodeBlock language="text" style={atomDark}>
          {`mysql://username:password@localhost:3306/database_name`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">MySQL over SSL (Encrypted Connection)</h2>
        <p>You can use SSL/TLS to encrypt traffic between client and server. Port remains <strong>3306</strong> unless you change it.</p>
        <CodeBlock language="bash" style={atomDark}>
          {`mysql -u username -p \\
  --host=your-hostname \\
  --port=3306 \\
  --ssl-ca=ca.pem \\
  --ssl-cert=client-cert.pem \\
  --ssl-key=client-key.pem`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Basic connection from command line</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`# Connect to local MySQL (will prompt for password)
mysql -u root -p

# Connect to a specific database
mysql -u root -p my_database

# Exit
exit;`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default MySQLIntroduction;
