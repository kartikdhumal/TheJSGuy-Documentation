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
        In Express everything is middleware. NestJS splits that work into 5 special layers, each with one job: Middleware, Guards, Interceptors, Pipes and Exception Filters. Knowing the order they run in is the most asked NestJS interview question, and it tells you where to put each piece of logic.
      </p>

      <section className="method-section">
        <h2 className="method-title">The order</h2>
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
        <p className="com-text">
          1. Middleware: raw request work that does not need to know which handler runs (logging, request id, cookie parsing, helmet).
          2. Guard: "is this request allowed?" Returns true or false (authentication, roles, permissions). Runs after middleware because it knows the exact handler and its metadata.
          3. Interceptor: wraps the handler, can run code before and after it (response transform, timing, caching, timeout).
          4. Pipe: transform and validate input (DTO validation, string "5" to number 5).
          5. Exception Filter: catches errors and builds the error response.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Where to register them</h2>
        <p className="com-text">
          Each layer (except middleware) can be bound at 3 levels: global, controller, or a single route. Use the Use* decorators for controller/route level. For global, prefer registering in a module with the APP_* tokens instead of app.useGlobal*() in main.ts, because then the class can inject other providers (ConfigService, Reflector, a repository).
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
          Guards, interceptors and filters receive a context object instead of (req, res, next). It works for HTTP, WebSockets and microservices. From it you can get the request, and also the handler and class, which is how guards read metadata like @Roles('admin').
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`const request = context.switchToHttp().getRequest();
const handler = context.getHandler();   // the route method
const controller = context.getClass();  // the controller class
const type = context.getType();         // 'http' | 'ws' | 'rpc'`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Quick decision table</h2>
        <p className="com-text">
          Need to log every request? Middleware or interceptor.
          Need to check a JWT or a role? Guard.
          Need to wrap every response as {'{ success, data }'}? Interceptor.
          Need to validate a body or convert a param? Pipe.
          Need a consistent error JSON? Exception filter.
          Need to measure handler time or add a timeout? Interceptor.
        </p>
      </section>
    </div>
  );
}

export default NestJSRequestLifecycle;
