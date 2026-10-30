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
        What a production-ready NestJS app looks like: thin controllers, focused services, validated input, one error format, safe config, health checks, graceful shutdown and a small Docker image.
      </p>

      <section className="method-section">
        <h2 className="method-title">Code rules</h2>
        <p className="com-text">
          1. Thin controllers: HTTP only. Business rules live in services.
          2. One module per feature, export only what others need.
          3. Always use DTOs with ValidationPipe (whitelist: true). Never pass req.body straight to the database.
          4. Return entities through ClassSerializerInterceptor or map to a response DTO, so secrets never leak.
          5. Protect all routes by default with a global guard, use @Public() for exceptions.
          6. Prefer singleton providers; request scope only when really needed.
          7. Avoid circular dependencies; extract a shared module instead of using forwardRef.
          8. Use transactions for multi-step writes, migrations instead of synchronize.
          9. Keep heavy or slow work in queues, not in the request.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">A production main.ts</h2>
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
          Load balancers and Kubernetes call a health endpoint to know if an instance can take traffic. Check real dependencies (database, Redis), not just "the process is up".
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
        <h2 className="method-title">Graceful shutdown</h2>
        <p className="com-text">
          On deploy, the platform sends SIGTERM. With enableShutdownHooks(), Nest stops accepting new requests, runs onModuleDestroy / onApplicationShutdown (close DB pool, close BullMQ workers, close Redis), then exits. Without it, in-flight requests and jobs are cut off.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Multi-stage Dockerfile</h2>
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
          A Nest app runs on one Node.js thread. To use more CPU, run several instances (PM2 cluster, Docker replicas, Kubernetes pods) behind a load balancer. That means the app must be stateless: sessions, cache, rate limits, WebSocket events and locks go to Redis, not process memory. Cron jobs must be made single-runner (BullMQ scheduler or a lock), otherwise they run once per instance.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Performance tips</h2>
        <p className="com-text">
          1. Fastify adapter (@nestjs/platform-fastify) gives higher throughput than Express if you do not rely on Express-only middleware.
          2. Cache hot reads in Redis, add DB indexes on filtered columns, avoid N+1 queries.
          3. Paginate every list endpoint.
          4. Do not block the event loop: no sync crypto, huge JSON.parse or loops over big data inside a request; move them to a queue or worker thread.
          5. Use compression and keep response payloads small (select only needed columns).
        </p>
      </section>
    </div>
  );
}

export default NestJSBestPractices;
