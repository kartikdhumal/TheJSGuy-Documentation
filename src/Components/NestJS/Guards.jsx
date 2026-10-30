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
        A guard answers one question: "should this request reach the handler?" It implements canActivate() and returns true (continue) or false (Nest throws 403 Forbidden). You can also throw your own exception, like UnauthorizedException (401). Guards are used for authentication (who are you?) and authorization (are you allowed?).
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
        <h2 className="method-title">Role-based access with metadata</h2>
        <p className="com-text">
          The guard needs to know which roles a route requires. We attach that with a custom decorator (SetMetadata or Reflector.createDecorator) and read it in the guard with Reflector. getAllAndOverride checks the method first, then the controller, so a route can override its controller.
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
          Safer default: protect every route globally and mark the few open ones (login, register, health) as public. Then a new route is never accidentally left unprotected.
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
        <h2 className="method-title">Resource ownership checks</h2>
        <p className="com-text">
          Roles are not enough: a normal user must only edit their own order. Keep that check in the service (where you already load the record), or in a guard that loads the resource. Never trust a userId sent in the body; take it from req.user, which the auth guard set from the verified token.
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
          @nestjs/throttler is a guard too. Register it globally and tighten it on sensitive routes like login. With several server instances, use a Redis storage so the limit is shared.
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
