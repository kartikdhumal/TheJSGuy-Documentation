import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSInterceptors() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Interceptors</h1>
      <p className="com-text">
        An interceptor wraps the route handler, so it can run code before the handler and after it. It gets the result as an RxJS Observable from next.handle(), which lets you change the response, measure time, add a timeout, cache, or map errors. Think of it as "around" logic, like a decorator around the whole handler.
      </p>

      <section className="method-section">
        <h2 className="method-title">How it works</h2>
        <p className="com-text">
          intercept(context, next): code before next.handle() runs before the controller. next.handle() returns an Observable of the handler's result. Operators in .pipe() (map, tap, catchError, timeout) run after. If you never call next.handle(), the handler does not run at all (that is how caching works).
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();                                  // BEFORE

    return next.handle().pipe(
      tap(() => {                                              // AFTER
        this.logger.log(req.method + ' ' + req.url + ' ' + (Date.now() - start) + 'ms');
      }),
    );
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Wrapping every response</h2>
        <p className="com-text">
          A common requirement: every API response should look the same, like {'{ success: true, data: ... }'}. Do it once in an interceptor instead of in every controller.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}

// app.module.ts
providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }]`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Hiding fields: ClassSerializerInterceptor</h2>
        <p className="com-text">
          Never send the password hash back. Mark it with @Exclude() on the entity and enable ClassSerializerInterceptor. It runs class-transformer on the returned class instance and removes excluded fields. It only works when you return class instances (entities), not plain objects.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  get displayName() {
    return this.email.split('@')[0];
  }
}

providers: [{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }]`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Timeout</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(10_000),
      catchError((err) =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException())
          : throwError(() => err),
      ),
    );
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Response caching</h2>
        <p className="com-text">
          @nestjs/cache-manager ships a CacheInterceptor that caches GET responses. Under the hood it skips next.handle() when there is a cache hit. Use Redis as the store when you run more than one instance.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@UseInterceptors(CacheInterceptor)
@CacheTTL(60_000)                    // ms
@Get('products')
findAll() {
  return this.productsService.findAll();
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Interceptor vs Middleware</h2>
        <p className="com-text">
          Middleware runs before routing details are known and cannot see the handler's return value. An interceptor knows the exact handler (so it can read metadata) and receives the result, so it can transform it. Use middleware for raw request plumbing and interceptors for anything that touches the response.
        </p>
      </section>
    </div>
  );
}

export default NestJSInterceptors;
