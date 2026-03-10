import React from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Deployment() {
    return (
        <div className="debounce-container">
            <header className="deploy-header">
                <h1 className="deploy-title">Node.js Application Deployment</h1>
                <p className="deploy-subtitle">Production-ready deployment guide</p>
            </header>

            <section className="deploy-section">
                <h2 className="section-title">Pre-Deployment Checklist</h2>
                <div className="checklist-grid">
                    <div className="checklist-item">
                        <h3>Security</h3>
                        <ul>
                            <li>Environment variables configured</li>
                            <li>Sensitive data protected</li>
                            <li>Security headers implemented</li>
                        </ul>
                    </div>
                    <div className="checklist-item">
                        <h3>Performance</h3>
                        <ul>
                            <li>Database indexes optimized</li>
                            <li>Static assets compressed</li>
                            <li>Caching implemented</li>
                        </ul>
                    </div>
                </div>

                <div className="config-section">
                    <h2 className="section-title">Configuration Setup</h2>
                    <div >
                        <div className="code-header">
                            <span>config.js</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>{`const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

module.exports = config;`}</CodeBlock>
                    </div>

                    <div >
                        <div className="code-header">
                            <span>.env</span>
                        </div>
                        <CodeBlock language="javascript" style={atomDark}>{`NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourapp.com`}</CodeBlock>
                    </div>
                </div>

                <div className="deployment-steps">
                    <h2 className="section-title">Deployment Process</h2>
                    <div className="steps-container">
                        <div className="step-item">
                            <h3>1. Build Application</h3>
                            <div>
                                <CodeBlock language="bash" style={atomDark}>npm run build</CodeBlock>
                            </div>
                        </div>
                        <div className="step-item">
                            <h3>2. Run Tests</h3>
                            <div>
                                <CodeBlock language="bash" style={atomDark}>npm test</CodeBlock>
                            </div>
                        </div>
                        <div className="step-item">
                            <h3>3. Start Server</h3>
                            <div>
                                <CodeBlock language="bash" style={atomDark}>npm start</CodeBlock>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Deployment;