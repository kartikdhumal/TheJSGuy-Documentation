import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSControllers() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Controllers &amp; Routing</h1>
      <p className="com-text">
        A controller receives the request and returns the response. Its only job is HTTP: read params, query and body, call the service, return the result. Keep business logic out of it. Whatever you return is sent as JSON automatically, and an async method's promise is awaited for you.
      </p>

      <section className="method-section">
        <h2 className="method-title">A full CRUD controller</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Controller('users')                      // base path: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()                                  // POST /users
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()                                   // GET /users?page=1&limit=10
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')                              // GET /users/5
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')                            // PATCH /users/5
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')                           // DELETE /users/5
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Request decorators</h2>
        <p className="com-text">
          @Body() → req.body, @Param('id') → req.params.id, @Query() → req.query, @Headers('authorization') → a header, @Req() / @Res() → the raw Express request/response, @Ip() → client IP. You can pass a key to get one value (@Body('email')) or nothing to get the whole object.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Status codes and headers</h2>
        <p className="com-text">
          POST returns 201 by default, everything else 200. Change it with @HttpCode(). Set headers with @Header() and redirect with @Redirect().
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Post('login')
@HttpCode(200)                          // login does not create anything
login(@Body() dto: LoginDto) { ... }

@Get('report')
@Header('Cache-Control', 'no-store')
getReport() { ... }

@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
docs() {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Avoid @Res() unless you need it</h2>
        <p className="com-text">
          If you inject @Res(), Nest stops sending the response for you: you must call res.json() yourself, and interceptors that change the response will not work. If you only need to set a cookie or header, use passthrough mode so Nest still handles the response.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Post('login')
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken } = await this.authService.login(dto);
  res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });
  return { accessToken };              // Nest still sends this as JSON
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Route order matters</h2>
        <p className="com-text">
          Routes are matched in the order they are declared. If @Get(':id') comes before @Get('me'), a request to /users/me is caught by :id with id = "me". Put fixed paths before dynamic ones.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Get('me')        // first
getProfile() { ... }

@Get(':id')       // after
findOne() { ... }`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">API versioning</h2>
        <p className="com-text">
          When you must change a response shape without breaking old mobile apps, enable versioning and keep both versions side by side.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// main.ts
app.enableVersioning({ type: VersioningType.URI });   // /v1/users, /v2/users

@Controller({ path: 'users', version: '1' })
export class UsersV1Controller {}

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Streaming files</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Get('export')
exportCsv(): StreamableFile {
  const file = createReadStream(join(process.cwd(), 'exports/users.csv'));
  return new StreamableFile(file, {
    type: 'text/csv',
    disposition: 'attachment; filename="users.csv"',
  });
}`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSControllers;
