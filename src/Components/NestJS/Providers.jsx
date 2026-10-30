import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSProviders() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Providers &amp; Dependency Injection</h1>
      <p className="com-text">
        A provider is anything Nest can make for you and hand to other classes: services, repositories, helpers, config values, a Redis client.
        Dependency Injection (DI) sounds big, but the idea is simple. Your class does not make the things it needs with new. It just asks for them in the constructor. Nest makes them and hands them over. The part of Nest that does this is called the IoC container (Inversion of Control, which just means Nest is in charge of making objects, not you). Think of a restaurant: the chef doesn't go to the market, the ingredients are delivered to the kitchen.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why bother with DI?</h2>
        <p className="com-text">
          Without DI: OrdersService does new PaymentService(new HttpClient(...)) itself. Now the two classes are stuck together. In a test, you can't swap the real payment service for a fake one.
          With DI: OrdersService only says "I need a PaymentService". In the real app, Nest gives it the real one. In a test, you give it a fake one (a mock). Only one copy is made and shared. And Nest works out which thing to create first.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()                 // marks the class as a provider Nest can manage
export class OrdersService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mailService: MailService,
  ) {}

  async placeOrder(dto: CreateOrderDto) {
    await this.paymentService.charge(dto.amount);
    await this.mailService.sendOrderConfirmation(dto.email);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">How Nest knows what to inject</h2>
        <p className="com-text">
          With emitDecoratorMetadata turned on, TypeScript saves the types of your constructor parameters. Nest reads those types (PaymentService, MailService). It then uses each class as a token. A token is just a name tag Nest uses to find the right provider. This is why it works with classes but not with interfaces. Interfaces vanish after TypeScript compiles your code, so there is nothing left to read. For interfaces, you need your own token with @Inject().
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Custom providers</h2>
        <p className="com-text">
          Writing providers: [UsersService] is a short way of writing {'{ provide: UsersService, useClass: UsersService }'}. The long way lets you choose exactly what gets handed over:
          <br />1. useValue: a fixed value or object (like config, or a mock).
          <br />2. useClass: pick which class to use (for example, a different one for each environment).
          <br />3. useFactory: build it with a function. The function can be async and can ask for other providers.
          <br />4. useExisting: a second name (alias) for a provider that already exists.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`providers: [
  // useValue
  { provide: 'APP_NAME', useValue: 'Digital Safety Files' },

  // useClass: choose implementation by environment
  {
    provide: StorageService,
    useClass: process.env.NODE_ENV === 'production' ? S3StorageService : LocalStorageService,
  },

  // useFactory: async, with dependencies
  {
    provide: 'REDIS',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const client = new Redis(config.get('REDIS_URL'));
      await client.ping();
      return client;
    },
  },

  // useExisting: alias
  { provide: 'LOGGER', useExisting: AppLogger },
]

// inject a string/symbol token
constructor(@Inject('REDIS') private readonly redis: Redis) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Interfaces with injection tokens</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface PaymentGateway {
  charge(amount: number): Promise<string>;
}

// module
providers: [{ provide: PAYMENT_GATEWAY, useClass: StripeGateway }]

// service depends on the interface, not on Stripe
constructor(@Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Provider scopes (how many copies get made)</h2>
        <p className="com-text">
          1. DEFAULT (singleton): one copy for the whole app. Use this 99% of the time. It is the fastest.
          <br />2. REQUEST: a new copy for every request. Handy for data that changes per request (tenant, current user). But it is slower. It also spreads upward: any class that asks for a request-scoped provider becomes request-scoped too.
          <br />3. TRANSIENT: a new copy for every class that asks for it. Each class gets its own.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  get tenantId() {
    return this.req.headers['x-tenant-id'];
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Optional and circular dependencies</h2>
        <p className="com-text">
          @Optional() means "it's fine if this is missing". If the provider isn't there, you get undefined instead of a crash. Sometimes two services need each other. You can fix that with forwardRef on both sides. But take it as a warning sign. A better fix is usually to move the shared code into a third service.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`constructor(
  @Optional() private readonly analytics?: AnalyticsService,
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Common error: "Nest can't resolve dependencies"</h2>
        <p className="com-text">
          You will see this error a lot: "Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument UsersService at index [0] is available in the AuthModule context". In plain words, Nest can't find UsersService for AuthService. It is almost always one of these three:
          <br />1. UsersService is not in the providers of its own module.
          <br />2. UsersModule does not export UsersService.
          <br />3. AuthModule does not import UsersModule.
          If those look fine, check for a missing @Injectable(). Or a circular import that ends up as undefined.
        </p>
      </section>
    </div>
  );
}

export default NestJSProviders;
