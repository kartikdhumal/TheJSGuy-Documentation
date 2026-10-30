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
        <p className="com-text">
          1. Keep controllers small. They only deal with HTTP. Your business rules go in services.
          <br />2. Make one module per feature. Export only what other modules need.
          <br />3. Always use DTOs with ValidationPipe (whitelist: true). Never send req.body straight to the database.
          <br />4. Send entities out through ClassSerializerInterceptor, or turn them into a response DTO. That way secrets (like password hashes) never leak.
          <br />5. Lock all routes by default with a global guard. Use @Public() for the open ones.
          <br />6. Use singleton providers (one shared copy) most of the time. Use request scope only when you really need it.
          <br />7. Avoid circular dependencies (two modules needing each other). Move the shared part into its own module instead of using forwardRef.
          <br />8. Use transactions when you write in several steps. Use migrations, not synchronize.
          <br />9. Put heavy or slow work in queues, not inside the request.
        </p>
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
          <br />1. Stops taking new requests.
          <br />2. Runs onModuleDestroy / onApplicationShutdown, where you close the DB pool, BullMQ workers and Redis.
          <br />3. Exits.
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
        <p className="com-text">
          1. The Fastify adapter (@nestjs/platform-fastify) can handle more requests than Express. Use it if you don't depend on middleware that only works with Express.
          <br />2. Cache data you read often in Redis. Add database indexes on columns you filter by. Avoid N+1 queries.
          <br />3. Add pagination to every endpoint that returns a list.
          <br />4. Don't block the event loop. Inside a request, avoid sync crypto, a huge JSON.parse, or loops over lots of data. Move that work to a queue or a worker thread.
          <br />5. Turn on compression and keep responses small (select only the columns you need).
        </p>
      </section>
    </div>
  );
}

export default NestJSBestPractices;
