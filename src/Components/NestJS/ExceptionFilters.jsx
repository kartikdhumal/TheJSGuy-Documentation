import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSExceptionFilters() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Exception Filters &amp; Handling Errors</h1>
      <p className="com-text">
        Nest has a safety net for errors built in. If something throws an error in a guard, pipe, controller or service, Nest catches it and sends back a JSON error for you. So you don't need try/catch in every controller. Just throw the right exception from your service. An exception filter is a small class that lets you decide what that error reply looks like.
      </p>

      <section className="method-section">
        <h2 className="method-title">Built-in HTTP exceptions</h2>
        <p className="com-text">
          Nest gives you ready-made exceptions for common cases: BadRequestException (400), UnauthorizedException (401), ForbiddenException (403), NotFoundException (404), ConflictException (409), UnprocessableEntityException (422), InternalServerErrorException (500) and more. Any other error (one that is not an HttpException) turns into a 500 with "Internal server error". That way, your inside details don't leak out to the user.
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
        <h2 className="method-title">Make your own exception</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`export class InsufficientBalanceException extends HttpException {
  constructor(balance: number) {
    super({ code: 'INSUFFICIENT_BALANCE', message: 'Balance is ' + balance }, HttpStatus.BAD_REQUEST);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">One filter for all errors</h2>
        <p className="com-text">
          @Catch() with nothing inside catches every error. Use it to:
          <br />1. Send every error back in the same shape.
          <br />2. Log surprise errors along with their stack trace.
          <br />3. Hide inside details in production.
          If you write @Catch(HttpException) instead, it only catches HTTP exceptions.
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
        <h2 className="method-title">Turning database errors into nice errors</h2>
        <p className="com-text">
          Say a user signs up with an email that already exists. The database throws a "unique" error, and by default that becomes a 500. But it isn't really a server crash. It's a 409 Conflict. So write a small filter just for that error type and turn it into the right reply.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError & { code?: string }, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (exception.code === '23505') {                    // Postgres: "this value already exists"
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
          1. Throw errors from the service, not the controller. That way the error rule sits next to the logic it belongs to.
          <br />2. In production, never send stack traces or SQL messages to the user.
          <br />3. Use fixed error codes like EMAIL_TAKEN. Then the frontend checks the code, not the message text (which might change).
          <br />4. Add a request id to your logs and error replies. When a user reports an error, you can find it in the logs quickly.
          <br />5. Errors in background jobs, cron jobs and event listeners are not HTTP requests. Filters don't catch them. So wrap that code in try/catch and log the error yourself.
        </p>
      </section>
    </div>
  );
}

export default NestJSExceptionFilters;
