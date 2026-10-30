import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSAdvanced() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Advanced Features</h1>
      <p className="com-text">
        The features you need once the CRUD is done: custom decorators, lifecycle hooks, cron jobs, events, background queues, file uploads and Swagger docs. All of them follow the same NestJS idea: a module to register, a decorator to use.
      </p>

      <section className="method-section">
        <h2 className="method-title">Combining decorators: applyDecorators</h2>
        <p className="com-text">
          If every admin route repeats the same 4 decorators, merge them into one.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export function AdminOnly() {
  return applyDecorators(
    Roles(Role.Admin),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Admins only' }),
  );
}

@AdminOnly()
@Delete(':id')
remove() {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Lifecycle hooks</h2>
        <p className="com-text">
          Nest calls these methods on providers and modules at specific moments:
          1. onModuleInit(): after the module's dependencies are ready (warm a cache, check a connection).
          2. onApplicationBootstrap(): after all modules are initialised, before listening.
          3. onModuleDestroy() / beforeApplicationShutdown() / onApplicationShutdown(signal): on shutdown (close connections, finish jobs).
          Shutdown hooks only run if you call app.enableShutdownHooks() in main.ts.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL);
    await this.client.ping();
  }

  async onApplicationShutdown(signal?: string) {
    await this.client.quit();
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Cron jobs: @nestjs/schedule</h2>
        <p className="com-text">
          Good for simple timed tasks. But if you run 3 instances, the cron runs 3 times. For jobs that must run once across the cluster, use a BullMQ job scheduler or a Redis lock.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// app.module.ts
imports: [ScheduleModule.forRoot()]

@Injectable()
export class CleanupService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Kolkata' })
  async removeExpiredSessions() {
    await this.sessionsRepo.delete({ expiresAt: LessThan(new Date()) });
  }

  @Interval(30_000)
  heartbeat() {}
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Events: @nestjs/event-emitter</h2>
        <p className="com-text">
          Decouple side effects. UsersService emits "user.created" and does not need to know that mail, analytics and audit services react to it. Note: events are in-memory, so they are lost if the process crashes. For work that must not be lost, use a queue.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`imports: [EventEmitterModule.forRoot()]

// emitter
this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id, user.email));

// listener (in any module)
@OnEvent('user.created', { async: true })
async sendWelcomeMail(event: UserCreatedEvent) {
  await this.mailService.sendWelcome(event.email);
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Background jobs: @nestjs/bullmq</h2>
        <p className="com-text">
          For slow or must-not-lose work (emails, PDFs, imports), add a job to a Redis-backed queue and return immediately. A processor class handles it with retries. See the Redis &amp; BullMQ section for the details.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`imports: [BullModule.registerQueue({ name: 'emails' })]

// producer
constructor(@InjectQueue('emails') private readonly emailsQueue: Queue) {}
await this.emailsQueue.add('welcome', { userId }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });

// consumer
@Processor('emails', { concurrency: 10 })
export class EmailsProcessor extends WorkerHost {
  async process(job: Job<{ userId: string }>) {
    if (job.name === 'welcome') await this.mail.sendWelcome(job.data.userId);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">File uploads</h2>
        <p className="com-text">
          FileInterceptor uses multer under the hood. Always validate size and type with ParseFilePipe. For big files, prefer letting the browser upload directly to S3 with a pre-signed URL so the API server does not carry the bytes.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Post('avatar')
@UseInterceptors(FileInterceptor('file'))
uploadAvatar(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),       // 2 MB
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.storage.upload(file);
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Swagger / OpenAPI docs</h2>
        <p className="com-text">
          @nestjs/swagger reads your controllers and DTOs and builds interactive API docs. The CLI plugin can read DTO types automatically so you add fewer @ApiProperty() decorators.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// main.ts
const config = new DocumentBuilder()
  .setTitle('DSF API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);        // http://localhost:3000/docs

// dto
export class CreateUserDto {
  @ApiProperty({ example: 'kartik@example.com' })
  @IsEmail()
  email: string;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Logging</h2>
        <p className="com-text">
          The built-in Logger is fine for development. In production, use structured JSON logs (nestjs-pino or winston) so tools like Loki, Datadog or CloudWatch can search them, and include a request id in every line.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`private readonly logger = new Logger(OrdersService.name);

this.logger.log('Order placed ' + order.id);
this.logger.warn('Stock low for product ' + productId);
this.logger.error('Payment failed', err.stack);`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSAdvanced;
