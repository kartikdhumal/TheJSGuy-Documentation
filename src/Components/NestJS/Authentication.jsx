import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSAuthentication() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">JWT Authentication</h1>
      <p className="com-text">
        The standard NestJS auth setup: the user logs in with email and password, gets a short-lived access token (JWT) and a long-lived refresh token. Every protected request sends the access token in the Authorization header. A guard verifies it and puts the user on req.user. Passport (@nestjs/passport) handles the token verification through a "strategy".
      </p>

      <section className="method-section">
        <h2 className="method-title">Install</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm i -D @types/passport-jwt @types/bcrypt`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Auth module</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Login: verify password, sign tokens</h2>
        <p className="com-text">
          Use the same error for "no such email" and "wrong password", so attackers cannot find out which emails are registered. Keep the payload small: user id (sub) and roles, never the password or personal data, because a JWT is only encoded, not encrypted.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const ok = user && (await bcrypt.compare(dto.password, user.password));
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, roles: user.roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">JWT strategy: verify on every request</h2>
        <p className="com-text">
          The strategy reads the token from the header, checks signature and expiry, then calls validate(). Whatever validate() returns becomes req.user.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; roles: Role[] }) {
    return { id: payload.sub, roles: payload.roles };   // → req.user
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">@CurrentUser() decorator</h2>
        <p className="com-text">Instead of @Req() req and req.user everywhere, create a param decorator.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    return field ? user?.[field] : user;
  },
);

@UseGuards(JwtAuthGuard)
@Get('me')
me(@CurrentUser() user: AuthUser) {
  return this.usersService.findOne(user.id);
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Refresh token flow</h2>
        <p className="com-text">
          1. Access token: 15 minutes, sent in the header, kept in memory on the client.
          2. Refresh token: 7 days, stored in an httpOnly secure cookie (JavaScript cannot read it, so XSS cannot steal it).
          3. When the access token expires, the client calls /auth/refresh; the server verifies the refresh token and issues a new pair.
          4. Rotation: store a hash of the current refresh token in the DB. On refresh, compare and replace it. If an old token is used again, it was stolen: revoke all sessions of that user.
          5. Logout deletes the stored hash, so the refresh token stops working even before it expires.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Public()
@Post('refresh')
@HttpCode(200)
async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken } = await this.authService.refresh(req.cookies.refresh_token);
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { accessToken };
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Security checklist</h2>
        <p className="com-text">
          1. Hash passwords with bcrypt or argon2, never store plain text.
          2. Long random JWT secrets from env, different for access and refresh tokens.
          3. Short access token life; JWTs cannot be revoked before expiry without a blacklist.
          4. Rate limit login and password-reset routes (ThrottlerGuard).
          5. Protect everything by default with a global guard and @Public() exceptions.
          6. Use HTTPS only, and set helmet() and a strict CORS origin.
        </p>
      </section>
    </div>
  );
}

export default NestJSAuthentication;
