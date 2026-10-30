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
        An interceptor wraps around your route handler. So it can run code before the handler, and after it too. Think of it like gift wrapping around a box: it is on both sides of what's inside. It gets the handler's result from next.handle() as an RxJS Observable (a stream of values you can change with operators like map). With that you can change the response, measure time, add a timeout, cache, or change errors.
      </p>

      <section className="method-section">
        <h2 className="method-title">How it works</h2>
        <p className="com-text">
          Everything happens inside intercept(context, next):
        </p>
        <ol className="com-list">
          <li className="com-list-item">Code you write before next.handle() runs before the controller.</li>
          <li className="com-list-item">next.handle() calls the handler and gives you its result as an Observable.</li>
          <li className="com-list-item">Operators inside .pipe() (map, tap, catchError, timeout) run after the handler.</li>
        </ol>
        <p className="com-text">
          If you never call next.handle(), the handler doesn't run at all. That is exactly how caching works.
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
          A common need: every API response should look the same, like {'{ success: true, data: ... }'}. Do it once in an interceptor, not again and again in every controller.
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
          Never send the password hash back to the user. Mark that field with @Exclude() on the entity. Then turn on ClassSerializerInterceptor. It runs class-transformer on what you return and removes the fields you excluded. One catch: it only works when you return class objects (entities), not plain objects.
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
          @nestjs/cache-manager comes with a CacheInterceptor. It saves GET responses so it can reuse them. When the answer is already saved, it simply skips next.handle(), so the handler doesn't run. If you run more than one copy of your server, store the cache in Redis.
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
          Middleware runs before Nest knows which handler will run. It also can't see what the handler returns.
          An interceptor knows the exact handler, so it can read its metadata. It also gets the result, so it can change it.
          So: use middleware for basic work on the raw request. Use interceptors for anything that touches the response.
        </p>
      </section>
    </div>
  );
}

export default NestJSInterceptors;
