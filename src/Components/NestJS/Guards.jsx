import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSGuards() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Guards &amp; Authorization</h1>
      <p className="com-text">
        A guard is like a security guard at the gate. It answers one question: "should this request get in and reach the handler?" It has a canActivate() method:
      </p>
      <ol className="com-list">
        <li className="com-list-item">Return true, and the request goes on.</li>
        <li className="com-list-item">Return false, and Nest throws 403 Forbidden.</li>
      </ol>
      <p className="com-text">
        You can also throw your own error, like UnauthorizedException (401). Guards are used for two things: authentication (who are you?) and authorization (are you allowed to do this?).
      </p>

      <section className="method-section">
        <h2 className="method-title">A simple guard</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'];
    if (key !== this.config.get('INTERNAL_API_KEY')) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}

@UseGuards(ApiKeyGuard)
@Controller('internal')
export class InternalController {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Checking roles (admin, user...)</h2>
        <p className="com-text">
          The guard needs to know which roles a route needs. Here is how it finds out:
        </p>
        <ol className="com-list">
          <li className="com-list-item">We stick that info onto the route with our own decorator (made with SetMetadata or Reflector.createDecorator). This info is called metadata.</li>
          <li className="com-list-item">Inside the guard, we read it back with Reflector (a Nest helper for reading metadata).</li>
        </ol>
        <p className="com-text">
          getAllAndOverride looks at the method first, then the controller. So a route's own setting wins over its controller's setting.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// roles.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;                    // no @Roles → open to any logged-in user

    const { user } = context.switchToHttp().getRequest();
    return required.some((role) => user?.roles?.includes(role));
  }
}

// usage
@Roles(Role.Admin)
@Delete(':id')
remove(@Param('id') id: string) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Global auth guard with @Public()</h2>
        <p className="com-text">
          A safer way to start: lock every route in the whole app. Then mark only the few open ones (login, register, health) as public. This way, if you add a new route and forget about auth, it is still locked by default.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// app.module.ts : order matters, auth first then roles
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
]

@Public()
@Post('login')
login() {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Is this really yours?</h2>
        <p className="com-text">
          Roles are not enough. A normal user should only edit their own order, not someone else's. Put this check in the service, since you already load the record there. Or use a guard that loads the record. Never trust a userId sent in the body, because anyone can type any id there. Take it from req.user instead. The auth guard filled that in from the checked token.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`async update(id: number, dto: UpdateOrderDto, user: AuthUser) {
  const order = await this.ordersRepo.findOneBy({ id });
  if (!order) throw new NotFoundException();
  if (order.userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw new ForbiddenException('You can only edit your own orders');
  }
  return this.ordersRepo.save({ ...order, ...dto });
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rate limiting with ThrottlerGuard</h2>
        <p className="com-text">
          Rate limiting means "only allow so many requests per minute". @nestjs/throttler does this, and it is a guard too. Turn it on for the whole app. Then make it stricter on risky routes like login. If you run more than one copy of your server, store the counts in Redis so all copies share the same limit.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])     // 100 req / minute
providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]

@Throttle({ default: { limit: 5, ttl: 60_000 } })          // 5 login tries / minute
@Post('login')
login() {}

@SkipThrottle()
@Get('health')
health() {}`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSGuards;
