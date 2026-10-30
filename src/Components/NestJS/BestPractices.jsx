import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSBestPractices() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Best Practices &amp; Deployment</h1>
      <p className="com-text">
        Here's what a Nest app that's ready for real users looks like: small controllers, services that each do one job, checked input, one error format, safe config, health checks, a clean shutdown and a small Docker image.
      </p>

      <section className="method-section">
        <h2 className="method-title">Simple code rules</h2>
        <ol className="com-list">
          <li className="com-list-item">Keep controllers small. They only deal with HTTP. Your business rules go in services.</li>
          <li className="com-list-item">Make one module per feature. Export only what other modules need.</li>
          <li className="com-list-item">Always use DTOs with ValidationPipe (whitelist: true). Never send req.body straight to the database.</li>
          <li className="com-list-item">Send entities out through ClassSerializerInterceptor, or turn them into a response DTO. That way secrets (like password hashes) never leak.</li>
          <li className="com-list-item">Lock all routes by default with a global guard. Use @Public() for the open ones.</li>
          <li className="com-list-item">Use singleton providers (one shared copy) most of the time. Use request scope only when you really need it.</li>
          <li className="com-list-item">Avoid circular dependencies (two modules needing each other). Move the shared part into its own module instead of using forwardRef.</li>
          <li className="com-list-item">Use transactions when you write in several steps. Use migrations, not synchronize.</li>
          <li className="com-list-item">Put heavy or slow work in queues, not inside the request.</li>
        </ol>
      </section>

      <section className="method-section">
        <h2 className="method-title">A main.ts ready for production</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({ origin: config.get('FRONTEND_URL'), credentials: true });

  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  app.enableShutdownHooks();

  if (config.get('NODE_ENV') !== 'production') {
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  }

  await app.listen(config.get('PORT', 3000), '0.0.0.0');
}
bootstrap();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Health checks: @nestjs/terminus</h2>
        <p className="com-text">
          Load balancers and Kubernetes call a health endpoint to ask, "Are you OK to take requests?" Think of it like a doctor's quick check-up. Check the real things your app needs (database, Redis), not just "the app is running".
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Shutting down cleanly</h2>
        <p className="com-text">
          When you deploy, the platform sends your app a SIGTERM signal ("please stop"). If you called enableShutdownHooks(), Nest then:
        </p>
        <ol className="com-list">
          <li className="com-list-item">Stops taking new requests.</li>
          <li className="com-list-item">Runs onModuleDestroy / onApplicationShutdown, where you close the DB pool, BullMQ workers and Redis.</li>
          <li className="com-list-item">Exits.</li>
        </ol>
        <p className="com-text">
          Without it, requests and jobs that are still running get cut off in the middle.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Multi-stage Dockerfile (small image)</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---- run ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Scaling</h2>
        <p className="com-text">
          A Nest app runs on one Node.js thread. To use more CPU, run several copies of it (PM2 cluster, Docker replicas, Kubernetes pods) behind a load balancer. So your app must be stateless, which means it keeps nothing important in its own memory. Sessions, cache, rate limits, WebSocket events and locks go to Redis instead. Cron jobs must also run on only one copy (use a BullMQ scheduler or a lock). If not, they run once on every copy.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Performance tips</h2>
        <ol className="com-list">
          <li className="com-list-item">The Fastify adapter (@nestjs/platform-fastify) can handle more requests than Express. Use it if you don't depend on middleware that only works with Express.</li>
          <li className="com-list-item">Cache data you read often in Redis. Add database indexes on columns you filter by. Avoid N+1 queries.</li>
          <li className="com-list-item">Add pagination to every endpoint that returns a list.</li>
          <li className="com-list-item">Don't block the event loop. Inside a request, avoid sync crypto, a huge JSON.parse, or loops over lots of data. Move that work to a queue or a worker thread.</li>
          <li className="com-list-item">Turn on compression and keep responses small (select only the columns you need).</li>
        </ol>
      </section>
    </div>
  );
}

export default NestJSBestPractices;
