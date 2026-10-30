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
        A module is a class with @Module() on top. It holds one feature of your app: its controllers, its services, and what it shares with other modules. Think of it like a department in an office. Every app has one main (root) module called AppModule. You import your feature modules into it, so they form a tree. Nest looks at this tree to know which providers exist and who is allowed to use them.
      </p>

      <section className="method-section">
        <h2 className="method-title">The 4 properties of @Module()</h2>
        <p className="com-text">
          1. imports: other modules this module needs things from.
          <br />2. controllers: the controllers in this module (they handle the routes).
          <br />3. providers: the services and other classes Nest should create for this module.
          <br />4. exports: the providers this module shares. Other modules can use them after they import this module.
          By default, a provider stays private inside its own module. If you don't export it, no other module can ask for it.
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
          Say AuthService needs UsersService. Don't add UsersService to the providers of AuthModule. That would make a second, separate copy. Instead, do two things:
          <br />1. Export UsersService from UsersModule.
          <br />2. Import UsersModule in AuthModule.
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
        <h2 className="method-title">Each module is made only once</h2>
        <p className="com-text">
          Modules are singletons. That means there is only one of each. Even if UsersModule is imported in 5 places, Nest creates it once. Everyone who imports it gets the same UsersService object. That is why a database connection or Redis client inside a module is shared, not copied again and again.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Global modules</h2>
        <p className="com-text">
          @Global() makes a module's exports usable everywhere, without importing the module each time. Use it only for things the whole app really needs (config, database, Redis, logger). Don't make everything global. If you do, it gets hard to see which module needs what, and the code becomes hard to follow.
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
          A dynamic module is a module you can give settings to. It then builds its providers from those settings. You will see this in almost every library:
          forRoot(): set it up once in AppModule (for example, the database connection).
          forFeature(): add something for one feature module only (for example, the entities this module uses).
          forRootAsync(): same as forRoot, but the settings come from another provider (usually ConfigService). This lets you read env values.
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
        <h2 className="method-title">When two modules import each other</h2>
        <p className="com-text">
          This is called a circular import. UsersModule imports AuthModule, and AuthModule imports UsersModule. Now Nest can't tell which one to build first. The fix is forwardRef(() =&gt; Module) on both sides. But first, ask yourself why this happened. Usually it means some code should move into a third module that both can share.
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
