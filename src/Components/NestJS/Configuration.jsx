import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSConfiguration() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Configuration &amp; Environment Variables</h1>
      <p className="com-text">
        @nestjs/config loads your .env file and gives you a ConfigService you can inject anywhere. Reading process.env directly all over the code works, but you lose validation, types and testability. The rule: read env in one place, validate it at startup, inject it everywhere else.
      </p>

      <section className="method-section">
        <h2 className="method-title">Setup</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i @nestjs/config`}
        </CodeBlock>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,                                        // no need to import in each module
      envFilePath: ['.env.' + process.env.NODE_ENV, '.env'], // first found wins per key
      cache: true,
    }),
  ],
})
export class AppModule {}

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}

  send() {
    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<number>('SMTP_PORT', 587);    // default value
    const key = this.config.getOrThrow<string>('SMTP_KEY');    // throws if missing
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Validate env at startup</h2>
        <p className="com-text">
          If DATABASE_URL is missing, you want the app to fail on boot with a clear message, not crash on the first query at 2 AM. Pass a validation schema (Joi or zod) or a validate function.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`import * as Joi from 'joi';

ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    REDIS_URL: Joi.string().required(),
  }),
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Typed config namespaces</h2>
        <p className="com-text">
          registerAs() groups related settings into a typed object. Inject it with its KEY and you get autocomplete and no string keys in your services.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// config/jwt.config.ts
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
}));

// app.module.ts
ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] })

// any service
constructor(
  @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
) {}

this.jwt.accessTtl;   // typed`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Using config in other modules: forRootAsync</h2>
        <p className="com-text">
          Library modules need config values at creation time. Use their async version with a factory that injects ConfigService.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow('JWT_SECRET'),
    signOptions: { expiresIn: config.get('JWT_ACCESS_TTL', '15m') },
  }),
}),

BullModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    connection: { url: config.getOrThrow('REDIS_URL') },
  }),
}),`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Rules for secrets</h2>
        <p className="com-text">
          1. Never commit .env; commit a .env.example with dummy values.
          2. In production, set real env variables from the platform (Docker, Kubernetes secrets, AWS Secrets Manager) instead of shipping a .env file.
          3. Do not log the config object.
          4. Different secret per environment, and rotate them.
        </p>
      </section>
    </div>
  );
}

export default NestJSConfiguration;
