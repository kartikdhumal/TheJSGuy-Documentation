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
        Here's the usual way to do login in Nest:
      </p>
      <ol className="com-list">
        <li className="com-list-item">The user logs in with email and password.</li>
        <li className="com-list-item"><strong>They get two tokens:</strong> an access token (a JWT) that lasts a short time, and a refresh token that lasts longer.</li>
        <li className="com-list-item">On every protected request, they send the access token in the Authorization header.</li>
        <li className="com-list-item">A guard checks the token and puts the user on req.user.</li>
      </ol>
      <p className="com-text">
        A JWT is like a cinema ticket. You show it at the door, and the staff checks it's real and not expired. The checking is done by Passport (@nestjs/passport) using a "strategy", which is just the set of rules for how to check a token.
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
          Give the same error for "no such email" and "wrong password". If you don't, attackers can find out which emails have accounts. Keep the payload (the data inside the token) small: just the user id (sub) and roles. Never put the password or personal data in it. A JWT is only encoded, not encrypted, so anyone holding it can read what's inside.
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
        <h2 className="method-title">JWT strategy: check the token on every request</h2>
        <p className="com-text">
          The strategy takes the token from the header. It checks the signature (is it real?) and the expiry (is it still valid?). Then it calls validate(). Whatever validate() returns becomes req.user.
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
        <p className="com-text">Writing @Req() req and req.user everywhere gets messy. Instead, make your own param decorator that hands you the user directly.</p>
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
        <ol className="com-list">
          <li className="com-list-item"><strong>Access token:</strong> lives 15 minutes. It's sent in the header and kept in memory on the client.</li>
          <li className="com-list-item"><strong>Refresh token:</strong> lives 7 days. It's kept in an httpOnly secure cookie. JavaScript can't read that cookie, so an XSS attack can't steal it.</li>
          <li className="com-list-item">When the access token runs out, the client calls /auth/refresh. The server checks the refresh token and gives back a new pair of tokens.</li>
          <li className="com-list-item"><strong>Rotation:</strong> save a hash of the current refresh token in the database. On each refresh, compare it and replace it with the new one. If an old token shows up again, someone stole it. So log that user out of all sessions.</li>
          <li className="com-list-item">Logout deletes the saved hash. Now the refresh token stops working, even before it runs out.</li>
        </ol>
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
        <ol className="com-list">
          <li className="com-list-item">Hash passwords with bcrypt or argon2. Never save them as plain text.</li>
          <li className="com-list-item">Use long, random JWT secrets from env. Use a different one for access and refresh tokens.</li>
          <li className="com-list-item">Keep the access token short-lived. You can't cancel a JWT before it expires unless you keep a blacklist.</li>
          <li className="com-list-item">Limit how often people can hit the login and password-reset routes (ThrottlerGuard).</li>
          <li className="com-list-item">Lock every route by default with a global guard. Mark the open ones with @Public().</li>
          <li className="com-list-item">Use HTTPS only. Add helmet() and set a strict CORS origin.</li>
        </ol>
      </section>
    </div>
  );
}

export default NestJSAuthentication;
