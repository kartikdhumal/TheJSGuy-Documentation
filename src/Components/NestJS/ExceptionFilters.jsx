import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSExceptionFilters() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Exception Filters &amp; Error Handling</h1>
      <p className="com-text">
        NestJS has a built-in exception layer. If anything throws in a guard, pipe, controller or service, Nest catches it and sends a JSON error. You do not need try/catch in every controller: just throw the right exception from the service. An exception filter lets you control what that error response looks like.
      </p>

      <section className="method-section">
        <h2 className="method-title">Built-in HTTP exceptions</h2>
        <p className="com-text">
          BadRequestException (400), UnauthorizedException (401), ForbiddenException (403), NotFoundException (404), ConflictException (409), UnprocessableEntityException (422), InternalServerErrorException (500) and more. Any error that is not an HttpException becomes a 500 with "Internal server error", so internal details do not leak.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`async findOne(id: number) {
  const user = await this.usersRepo.findOneBy({ id });
  if (!user) throw new NotFoundException('User ' + id + ' not found');
  return user;
}

// Response:
// { "statusCode": 404, "message": "User 5 not found", "error": "Not Found" }

// Custom body
throw new ConflictException({ code: 'EMAIL_TAKEN', message: 'Email already registered' });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Custom exception class</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`export class InsufficientBalanceException extends HttpException {
  constructor(balance: number) {
    super({ code: 'INSUFFICIENT_BALANCE', message: 'Balance is ' + balance }, HttpStatus.BAD_REQUEST);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">A global exception filter</h2>
        <p className="com-text">
          @Catch() with no argument catches everything. Use it to return one consistent error shape, log unexpected errors with the stack, and hide internals in production. @Catch(HttpException) would catch only HTTP exceptions.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (status >= 500) {
      this.logger.error(req.method + ' ' + req.url, (exception as Error)?.stack);
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      path: req.url,
      timestamp: new Date().toISOString(),
      error: message,
    });
  }
}

// app.module.ts
providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }]`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Mapping database errors</h2>
        <p className="com-text">
          A unique-constraint error from the database is a 500 by default, but really it is a 409 Conflict. Catch that error type in a dedicated filter and convert it.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError & { code?: string }, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (exception.code === '23505') {                    // Postgres unique violation
      return res.status(409).json({ statusCode: 409, message: 'Record already exists' });
    }
    res.status(500).json({ statusCode: 500, message: 'Database error' });
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Best practices</h2>
        <p className="com-text">
          1. Throw from the service, not the controller, so the error rule lives with the logic.
          2. Never return stack traces or SQL messages to the client in production.
          3. Use stable error codes (EMAIL_TAKEN) so the frontend does not depend on message text.
          4. Add a request id to logs and error responses so a user's error can be found in logs.
          5. Errors in background jobs, cron and event listeners are not HTTP: filters do not catch them, so wrap them with try/catch and log.
        </p>
      </section>
    </div>
  );
}

export default NestJSExceptionFilters;
