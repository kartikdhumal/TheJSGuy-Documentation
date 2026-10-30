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
        A provider is anything Nest can create and inject: services, repositories, helpers, config values, a Redis client. Dependency Injection (DI) means a class does not create its own dependencies with new. It just asks for them in the constructor, and Nest's IoC container (Inversion of Control) creates them and passes them in.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why DI?</h2>
        <p className="com-text">
          Without DI: OrdersService does new PaymentService(new HttpClient(...)). Now it is tightly coupled, and in a test you cannot swap the real payment service for a fake one.
          With DI: OrdersService only says "I need a PaymentService". In production Nest gives the real one, in a test you give a mock. One instance is shared, and Nest figures out the creation order.
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
          TypeScript with emitDecoratorMetadata saves the constructor parameter types. Nest reads them (PaymentService, MailService) and uses each class as a token to look up the provider. That is why it works with classes but not with interfaces: interfaces disappear after compiling, so for them you need a custom token with @Inject().
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Custom providers</h2>
        <p className="com-text">
          providers: [UsersService] is a shortcut for {'{ provide: UsersService, useClass: UsersService }'}. The long form lets you control what is injected:
          1. useValue: a fixed value or object (config, mock).
          2. useClass: pick a class (e.g. a different one per environment).
          3. useFactory: build it with a function, can be async and can inject other providers.
          4. useExisting: an alias for another provider.
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
        <h2 className="method-title">Provider scopes</h2>
        <p className="com-text">
          1. DEFAULT (singleton): one instance for the whole app. Use this 99% of the time; it is the fastest.
          2. REQUEST: a new instance for every request. Useful for per-request data (tenant, current user), but it is slower, and it "bubbles up": anything that injects a request-scoped provider also becomes request-scoped.
          3. TRANSIENT: a new instance for every class that injects it (each consumer gets its own copy).
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
          @Optional() injects undefined instead of crashing if the provider is missing. For two services that depend on each other, use forwardRef on both sides, but treat it as a design smell and prefer moving shared logic into a third service.
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
          The message "Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument UsersService at index [0] is available in the AuthModule context" means one of three things:
          1. UsersService is not in the providers of its module.
          2. UsersModule does not export UsersService.
          3. AuthModule does not import UsersModule.
          Also check for a missing @Injectable() or a circular import that resolves to undefined.
        </p>
      </section>
    </div>
  );
}

export default NestJSProviders;
