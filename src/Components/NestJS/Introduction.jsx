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
        NestJS is a framework for building backend apps with Node.js and TypeScript. Inside, it still uses Express (by default) or Fastify. On top of that, it gives you a fixed way to organise your code: modules, controllers, providers and dependency injection. Express says "here is a router, organise it yourself". NestJS says "here is where every piece goes". That is why big teams like it. Every NestJS project looks the same, so you can jump into any one and find your way.
      </p>

      <section className="method-section">
        <h2 className="method-title">Why pick NestJS over plain Express?</h2>
        <ol className="com-list">
          <li className="com-list-item"><strong>Clear structure:</strong> your code is split into modules (users, orders, auth). So even a big app stays tidy.</li>
          <li className="com-list-item"><strong>Dependency Injection:</strong> you don't write new everywhere to make objects. Nest makes them and hands them to the classes that need them. This also makes testing easy.</li>
          <li className="com-list-item"><strong>TypeScript first:</strong> types, decorators and DTOs are built in from the start, not added later.</li>
          <li className="com-list-item"><strong>Lots of ready-made tools:</strong> validation, guards (auth), interceptors, config, TypeORM/Mongoose, Swagger, BullMQ, WebSockets, microservices and testing all have official packages.</li>
          <li className="com-list-item">It is still Express underneath. So any Express middleware you already know still works.</li>
        </ol>
      </section>

      <section className="method-section">
        <h2 className="method-title">The 3 building blocks</h2>
        <p className="com-text">
          Module: a box that keeps related code together (like UsersModule).
          Controller: takes the HTTP request and sends back the response. It does not hold your main app logic.
          Provider (Service): holds the real logic (the business logic) and talks to the database.
          Think of a restaurant: the controller is the waiter, the service is the chef, and the module is the whole kitchen team.
          The flow is: Request → Controller → Service → Database → back to Controller → Response.
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
        <p className="com-text">The Nest CLI is a command-line tool. It creates the project and makes the files for you. So you never have to type the same starter code by hand.</p>
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
        <h2 className="method-title">main.ts: where your app starts</h2>
        <p className="com-text">
          main.ts is the first file that runs. NestFactory.create() builds your app from the main (root) module, AppModule. This is also where you set things for the whole app: the URL prefix, validation, CORS, Swagger and the port.
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
        <h2 className="method-title">How to arrange your folders</h2>
        <p className="com-text">
          Put files together by feature (one folder per module), not by file type. So everything about users lives in the users folder. Things many modules share, like guards, filters, interceptors and decorators, go in a common folder.
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
        <h2 className="method-title">You will see decorators everywhere</h2>
        <p className="com-text">
          A decorator is the @Something line you put on top of a class, method or parameter (@Controller, @Get, @Body, @Injectable). It is really a function. It sticks a small label (called metadata, which just means extra info) onto that code. When the app starts, Nest reads these labels. That is how it knows which class is a controller, which method handles which route, and what to pass in. Decorators need "experimentalDecorators" and "emitDecoratorMetadata" turned on in tsconfig.json. Don't worry, the CLI does this for you.
        </p>
      </section>
    </div>
  );
}

export default NestJSIntroduction;
