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
        NestJS middleware is the same as Express middleware: a function with (req, res, next) that runs before the route handler. It runs first in the lifecycle, before guards. It does not know which controller method will handle the request, so use it for generic work: logging, request id, raw body, security headers.
      </p>

      <section className="method-section">
        <h2 className="method-title">Class middleware</h2>
        <p className="com-text">
          A class with @Injectable() that implements NestMiddleware. Because it is a provider, it can inject services.
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
        <h2 className="method-title">Applying middleware</h2>
        <p className="com-text">
          Middleware is not set in @Module(). The module implements NestModule and uses a consumer to choose routes. You can include or exclude routes and filter by HTTP method.
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
        <p className="com-text">If the middleware needs no dependencies, a plain function is simpler.</p>
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
          Any Express middleware works with app.use(). This is the usual place for helmet, compression and cookie-parser. Note: middleware added with app.use() cannot use Nest DI.
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
          Middleware does not know the target handler or its decorators, so it cannot check @Roles('admin') or @Public(). That is a guard's job. Middleware also cannot see the response data the handler returns; to transform the response, use an interceptor. Rule: middleware for raw request plumbing, guards for access, interceptors for wrapping the handler.
        </p>
      </section>
    </div>
  );
}

export default NestJSMiddleware;
