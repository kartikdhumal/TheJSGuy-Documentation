import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSTesting() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Testing</h1>
      <p className="com-text">
        Testing is where dependency injection pays off. Because a service only asks for its dependencies, a test can give it fakes instead of the real database or mail server. NestJS projects come with Jest set up: unit tests next to the code (*.spec.ts) and end-to-end tests in the test folder (*.e2e-spec.ts).
      </p>

      <section className="method-section">
        <h2 className="method-title">Unit test a service</h2>
        <p className="com-text">
          Test.createTestingModule() builds a small Nest module just for the test. Replace each dependency with a mock using useValue, then test only the service's own logic.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`describe('UsersService', () => {
  let service: UsersService;
  let repo: { findOneBy: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    repo = { findOneBy: jest.fn(), save: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('returns the user when found', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, email: 'a@b.com' });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1, email: 'a@b.com' });
  });

  it('throws NotFoundException when missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Unit test a controller</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`const usersService = { findAll: jest.fn().mockResolvedValue([]) };

const moduleRef = await Test.createTestingModule({
  controllers: [UsersController],
  providers: [{ provide: UsersService, useValue: usersService }],
}).compile();

const controller = moduleRef.get(UsersController);
await controller.findAll({ page: 1, limit: 10 });
expect(usersService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Unit test a guard</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`it('blocks a user without the admin role', () => {
  const reflector = { getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]) } as any;
  const guard = new RolesGuard(reflector);

  const context = {
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({ getRequest: () => ({ user: { roles: [Role.User] } }) }),
  } as unknown as ExecutionContext;

  expect(guard.canActivate(context)).toBe(false);
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">End-to-end test with supertest</h2>
        <p className="com-text">
          E2E tests boot the real app (all modules, pipes, guards) and send real HTTP requests. Use a separate test database, or override only the external providers (payment, mail) with overrideProvider(). Apply the same global pipes as main.ts, otherwise validation will not run in tests.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(MailService)
      .useValue({ sendWelcome: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /users rejects an invalid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Kartik', email: 'not-an-email', password: 'Secret123' })
      .expect(400);
  });

  it('GET /users/me needs a token', () => {
    return request(app.getHttpServer()).get('/users/me').expect(401);
  });
});`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Overriding guards in tests</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
  .overrideGuard(JwtAuthGuard)
  .useValue({ canActivate: () => true })
  .compile();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Commands</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm run test          # unit tests
npm run test:watch
npm run test:cov      # coverage report
npm run test:e2e      # end-to-end tests`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSTesting;
