import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSModules() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Modules</h1>
      <p className="com-text">
        A module is a class with @Module() that groups one feature: its controllers, its services and what it shares with others. Every app has one root module (AppModule) and imports feature modules into it. Nest uses this tree to know which providers exist and who can use them.
      </p>

      <section className="method-section">
        <h2 className="method-title">The 4 properties of @Module()</h2>
        <p className="com-text">
          1. imports: other modules whose exported providers this module needs.
          2. controllers: the controllers of this module (handle routes).
          3. providers: services and other classes Nest should create for this module.
          4. exports: the providers other modules are allowed to use when they import this module.
          By default, a provider is private to its module. If you do not export it, nobody outside can inject it.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({
  imports: [TypeOrmModule.forFeature([User])],   // gives this module the User repository
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],                         // other modules can now inject UsersService
})
export class UsersModule {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Sharing a service between modules</h2>
        <p className="com-text">
          AuthService needs UsersService. Do not add UsersService to the providers of AuthModule (that creates a second copy). Export it from UsersModule and import UsersModule in AuthModule.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({
  imports: [UsersModule],          // brings in everything UsersModule exports
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}  // works now
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Modules are singletons</h2>
        <p className="com-text">
          If UsersModule is imported in 5 places, Nest still creates it once and every importer gets the same UsersService instance. That is why a database connection or Redis client inside a module is shared, not duplicated.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Global modules</h2>
        <p className="com-text">
          @Global() makes a module's exports available everywhere without importing it. Use it only for truly app-wide things (config, database, Redis, logger). Making everything global hides dependencies and makes the code hard to follow.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}   // import once in AppModule, use anywhere`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Dynamic modules: forRoot / forFeature / forRootAsync</h2>
        <p className="com-text">
          A dynamic module is a module that takes options and builds its providers from them. You see this in almost every library:
          forRoot(): configure once in AppModule (database connection).
          forFeature(): register something per feature module (entities for this module).
          forRootAsync(): same as forRoot, but the options come from another provider (usually ConfigService), so you can read env values.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Writing your own dynamic module</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({})
export class StorageModule {
  static forRoot(options: { bucket: string }): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        { provide: 'STORAGE_OPTIONS', useValue: options },
        StorageService,
      ],
      exports: [StorageService],
    };
  }
}

// usage
imports: [StorageModule.forRoot({ bucket: 'user-uploads' })]`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Circular module imports</h2>
        <p className="com-text">
          If UsersModule imports AuthModule and AuthModule imports UsersModule, Nest cannot decide which to build first. Use forwardRef(() =&gt; Module) on both sides. But first ask why: a circular import usually means some logic should move to a third, shared module.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Module({ imports: [forwardRef(() => AuthModule)] })
export class UsersModule {}`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSModules;
