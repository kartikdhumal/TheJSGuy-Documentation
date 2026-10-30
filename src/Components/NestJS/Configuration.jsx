import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSConfiguration() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Config &amp; Environment Variables</h1>
      <p className="com-text">
        @nestjs/config reads your .env file for you. It gives you a ConfigService that you can ask for in any class. You could read process.env all over your code, and it would work. But then you get no checks, no types, and it's harder to test. So keep it simple: read env values in one place, check them when the app starts, and ask for them everywhere else.
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
      isGlobal: true,                                        // no need to import it in every module
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
          If DATABASE_URL is missing, you want the app to stop right when it starts, with a clear message. You don't want it to crash on the first database query at 2 AM. To do this, give Nest a validation schema (a list of rules, written with Joi or zod) or your own validate function.
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
        <h2 className="method-title">Grouped config with types</h2>
        <p className="com-text">
          registerAs() puts related settings together in one object that has types. For example, all JWT settings in one group. Ask for it using its KEY. Now your editor can autocomplete the values, and you don't have to type string keys in your services.
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
          Some library modules (like JwtModule or BullModule) need config values the moment they are created. For these, use their async version. You give it a factory (a small function that builds the settings), and that function gets ConfigService handed to it.
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
        <ol className="com-list">
          <li className="com-list-item">Never commit your .env file. Commit a .env.example with fake values instead.</li>
          <li className="com-list-item">In production, don't ship a .env file. Set the real env variables on the platform (Docker, Kubernetes secrets, AWS Secrets Manager).</li>
          <li className="com-list-item">Don't print the config object in your logs.</li>
          <li className="com-list-item">Use a different secret for each environment, and change (rotate) them from time to time.</li>
        </ol>
      </section>
    </div>
  );
}

export default NestJSConfiguration;
