import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ExpressErrorHandling() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Error Handling in Express.js</h1>
      <p>
        Use <strong>error-handling middleware</strong> (four arguments: <code>err, req, res, next</code>) to centralize errors. Call <code>next(err)</code> from route handlers or other middleware to pass errors to it.
      </p>

      <div className="method-section">
        <h2 className="method-title">Passing errors with next(err)</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});`}
        </CodeBlock>
      </div>

      <div className="method-section">
        <h2 className="method-title">Error-handling middleware (define last)</h2>
        <CodeBlock language="javascript" style={atomDark}>
          {`app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
});`}
        </CodeBlock>
      </div>
    </div>
  );
}

export default ExpressErrorHandling;
