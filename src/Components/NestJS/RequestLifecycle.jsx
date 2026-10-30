import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSRequestLifecycle() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Request Lifecycle</h1>
      <p className="com-text">
        In Express, everything is middleware. NestJS splits that work into 5 layers, and each layer has one job: Middleware, Guards, Interceptors, Pipes and Exception Filters. Think of a request walking through a building, passing a few checkpoints before it reaches the right room. The order of these layers is the most asked NestJS interview question. It also tells you where each piece of your code should go.
      </p>

      <section className="method-section">
        <h2 className="method-title">The order things run in</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`Incoming request
   │
   ├─ 1. Middleware          (global → module)
   ├─ 2. Guards              (global → controller → route)
   ├─ 3. Interceptors BEFORE (global → controller → route)
   ├─ 4. Pipes               (global → controller → route → param)
   ├─ 5. Controller method → Service
   ├─ 6. Interceptors AFTER  (route → controller → global, reverse order)
   │
   └─ Exception Filters      (only if something throws; route → controller → global)
   │
Response`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">One job per layer</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Middleware:</strong> basic work on the raw request. It doesn't need to know which handler (route method) will run. For example: logging, request id, reading cookies, helmet.</li>
          <li className="com-list-item"><strong>Guard:</strong> asks "is this request allowed in?" and answers true or false. Used for login checks, roles and permissions. It runs after middleware because, by then, Nest knows the exact handler and its metadata (the extra info from decorators).</li>
          <li className="com-list-item"><strong>Interceptor:</strong> wraps around the handler. It can run code before and after it. For example: changing the response, timing, caching, timeouts.</li>
          <li className="com-list-item"><strong>Pipe:</strong> checks and cleans the input. For example: DTO validation, or turning the string "5" into the number 5.</li>
          <li className="com-list-item"><strong>Exception Filter:</strong> catches errors and builds the error response.</li>
        </ol>
      </section>

      <section className="method-section">
        <h2 className="method-title">Where to register them</h2>
        <p className="com-text">
          Every layer except middleware can be attached at 3 levels: the whole app (global), one controller, or one route.
          For a controller or a route, use the Use* decorators (@UseGuards, @UseInterceptors and so on).
          For the whole app, you have two choices. You can call app.useGlobal*() in main.ts. Or you can register it inside a module with the APP_* tokens. Pick the module way. Then your class can ask for other providers (ConfigService, Reflector, a repository).
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// Route / controller level
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@UsePipes(new ValidationPipe())
@UseFilters(HttpExceptionFilter)
@Controller('orders')
export class OrdersController {}

// Global level with DI support (app.module.ts)
@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">ExecutionContext</h2>
        <p className="com-text">
          Guards, interceptors and filters don't get (req, res, next). Instead, they get one context object, called ExecutionContext. It works the same for HTTP, WebSockets and microservices. From it you can get the request. You can also get the route method (handler) and its controller class. That is how a guard reads extra info like @Roles('admin').
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`const request = context.switchToHttp().getRequest();
const handler = context.getHandler();   // the route method
const controller = context.getClass();  // the controller class
const type = context.getType();         // 'http' | 'ws' | 'rpc'`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Which one should I use?</h2>
        <p className="com-text">
          Want to log every request? Middleware or interceptor.
          Want to check a JWT or a role? Guard.
          Want every response to look like {'{ success, data }'}? Interceptor.
          Want to check a body or convert a param? Pipe.
          Want every error to have the same JSON shape? Exception filter.
          Want to time the handler or add a timeout? Interceptor.
        </p>
      </section>
    </div>
  );
}

export default NestJSRequestLifecycle;
