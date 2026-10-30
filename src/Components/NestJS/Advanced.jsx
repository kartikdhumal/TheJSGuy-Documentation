import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSAdvanced() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">More Useful Features</h1>
      <p className="com-text">
        Once your basic CRUD works, you'll soon need a few more things: custom decorators, lifecycle hooks, cron jobs, events, background queues, file uploads and Swagger docs. The good news: they all work the same way in Nest. You register a module, then you use a decorator.
      </p>

      <section className="method-section">
        <h2 className="method-title">Combining decorators: applyDecorators</h2>
        <p className="com-text">
          Do all your admin routes repeat the same 4 decorators? Put them together into one decorator, and use that instead.
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
          Lifecycle hooks are methods that Nest calls for you at certain moments, like when the app starts or stops. You add them to your providers and modules:
          <br />1. onModuleInit(): runs when the module's dependencies are ready. Good for filling a cache or checking a connection.
          <br />2. onApplicationBootstrap(): runs when all modules are set up, just before the app starts listening for requests.
          <br />3. onModuleDestroy() / beforeApplicationShutdown() / onApplicationShutdown(signal): run when the app shuts down. Good for closing connections and finishing jobs.
          Watch out: the shutdown hooks only run if you call app.enableShutdownHooks() in main.ts.
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
          A cron job is a task that runs on a timer, like "every night at 12". This is good for simple timed tasks. But be careful: if you run 3 copies of your app, the cron runs 3 times. If a job must run only once across all copies, use a BullMQ job scheduler or a Redis lock.
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
          Events keep your services from being stuck together. UsersService just shouts "user.created". It doesn't need to know that the mail, analytics and audit services are listening and reacting. Think of a school bell: it rings, and everyone who cares does their own thing.
          One catch: events live only in memory. If the app crashes, they are gone. For work you can't afford to lose, use a queue.
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
          Some work is slow, or must not get lost (emails, PDFs, imports). For that, add a job to a queue stored in Redis and reply to the user right away. A processor class picks up the job later and tries again if it fails. The Redis &amp; BullMQ section has all the details.
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
          FileInterceptor uses multer behind the scenes. Always check the file size and type with ParseFilePipe. For big files, it's better to let the browser upload straight to S3 with a pre-signed URL (a short-lived link that allows one upload). That way your API server doesn't have to carry all those bytes.
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
          @nestjs/swagger looks at your controllers and DTOs and makes API docs for you. You can even try the requests right on the docs page. The CLI plugin can read your DTO types by itself, so you write fewer @ApiProperty() decorators.
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
          The built-in Logger is fine while you develop. In production, write your logs as JSON (with nestjs-pino or winston). Then tools like Loki, Datadog or CloudWatch can search them easily. Also add a request id to every log line.
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
