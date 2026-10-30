import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSIntroduction() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Introduction to NestJS</h1>
      <p className="com-text">
        NestJS is a framework for building server-side applications with Node.js and TypeScript. Under the hood it uses Express (default) or Fastify, but on top of it gives you a fixed structure: modules, controllers, providers and dependency injection. Express tells you "here is a router, organise it yourself". NestJS tells you "here is where every piece goes". That is why big teams like it: every NestJS project looks the same.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why NestJS over plain Express?</h2>
        <p className="com-text">
          1. Structure: code is split into modules (users, orders, auth), so a big app stays organised.
          2. Dependency Injection: you do not create objects with new everywhere. Nest creates them and passes them where needed, which makes testing easy.
          3. TypeScript first: types, decorators and DTOs are part of the design, not an add-on.
          4. Batteries included: validation, guards (auth), interceptors, config, TypeORM/Mongoose, Swagger, BullMQ, WebSockets, microservices and testing all have official packages.
          5. It is still Express underneath, so any Express middleware still works.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">The 3 building blocks</h2>
        <p className="com-text">
          Module: a box that groups related code (UsersModule). Controller: receives the HTTP request and returns the response, no business logic. Provider (Service): holds the business logic and talks to the database. Flow: Request → Controller → Service → Database → back to Controller → Response.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// users.controller.ts : handles HTTP
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// users.service.ts : business logic
@Injectable()
export class UsersService {
  findAll() {
    return [{ id: 1, name: 'Kartik' }];
  }
}

// users.module.ts : ties them together
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Quick setup with the CLI</h2>
        <p className="com-text">The Nest CLI creates the project and generates files for you, so you never write the boilerplate by hand.</p>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i -g @nestjs/cli
nest new my-app          # creates the project
cd my-app
npm run start:dev        # starts with watch mode on http://localhost:3000

# Generate a full CRUD feature (module + controller + service + DTOs + entity)
nest g resource users

# Or generate pieces one by one
nest g module orders
nest g controller orders
nest g service orders`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">main.ts: the entry point</h2>
        <p className="com-text">
          NestFactory.create() builds the app from the root module (AppModule). This is where you set global things: prefix, validation, CORS, Swagger and the port.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');                                   // /api/users
  app.enableCors({ origin: process.env.FRONTEND_URL });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();                                    // graceful shutdown

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Project structure</h2>
        <p className="com-text">
          Group files by feature (module), not by type. Shared things like guards, filters, interceptors and decorators go in a common folder.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`src/
├── main.ts
├── app.module.ts
├── config/                 # env config & validation
├── common/                 # guards, filters, interceptors, decorators, pipes
├── database/               # data source, migrations
└── modules/
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── strategies/jwt.strategy.ts
    └── users/
        ├── users.module.ts
        ├── users.controller.ts
        ├── users.service.ts
        ├── dto/create-user.dto.ts
        └── entities/user.entity.ts`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Decorators everywhere</h2>
        <p className="com-text">
          A decorator is a function starting with @ that attaches metadata to a class, method or parameter (@Controller, @Get, @Body, @Injectable). Nest reads this metadata at startup to know which class is a controller, which method handles which route, and what to inject. Decorators need "experimentalDecorators" and "emitDecoratorMetadata" in tsconfig.json; the CLI sets this for you.
        </p>
      </section>
    </div>
  );
}

export default NestJSIntroduction;
