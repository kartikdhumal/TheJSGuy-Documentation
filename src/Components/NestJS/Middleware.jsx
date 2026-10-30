import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSMiddleware() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Middleware</h1>
      <p className="com-text">
        NestJS middleware is the same as Express middleware. It is a function with (req, res, next) that runs before your route handler. It is the very first layer, even before guards. Think of it as the reception desk of a building: everyone passes through it, but it doesn't know which room you are going to. In the same way, middleware doesn't know which controller method will handle the request. So use it for general work: logging, request id, raw body, security headers.
      </p>

      <section className="method-section">
        <h2 className="method-title">Class middleware</h2>
        <p className="com-text">
          This is a class with @Injectable() that implements NestMiddleware. Since it is a provider, it can ask for services in its constructor.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = (req.headers['x-request-id'] as string) ?? randomUUID();
    req.headers['x-request-id'] = id;
    res.setHeader('x-request-id', id);
    next();                               // forget this and the request hangs
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Turning middleware on</h2>
        <p className="com-text">
          You don't add middleware inside @Module(). Instead, the module implements NestModule. It then uses a consumer (a small helper Nest gives you) to pick which routes the middleware runs on. You can add routes, skip routes, and pick by HTTP method.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({ imports: [UsersModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)     // run in this order
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('*');                                  // all routes

    consumer
      .apply(AuditMiddleware)
      .forRoutes({ path: 'orders', method: RequestMethod.POST }, UsersController);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Functional middleware</h2>
        <p className="com-text">If your middleware doesn't need any services, just use a plain function. It's simpler.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(req.method, req.originalUrl, res.statusCode, Date.now() - start + 'ms');
  });
  next();
}

consumer.apply(logger).forRoutes('*');`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Global middleware in main.ts</h2>
        <p className="com-text">
          Any Express middleware works with app.use(). This is where people usually add helmet, compression and cookie-parser. One thing to know: middleware added with app.use() can't use Nest DI. So it can't ask Nest for services.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

app.use(helmet());
app.use(compression());
app.use(cookieParser());`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Middleware vs Guard vs Interceptor</h2>
        <p className="com-text">
          Middleware doesn't know which handler will run, or what decorators it has. So it can't check @Roles('admin') or @Public(). That is a guard's job. Middleware also can't see the data the handler returns. If you want to change the response, use an interceptor.
          Easy rule to remember:
        </p>
        <ol className="com-list">
          <li className="com-list-item"><strong>Middleware:</strong> basic work on the raw request.</li>
          <li className="com-list-item"><strong>Guards:</strong> who is allowed in.</li>
          <li className="com-list-item"><strong>Interceptors:</strong> wrapping around the handler.</li>
        </ol>
      </section>
    </div>
  );
}

export default NestJSMiddleware;
