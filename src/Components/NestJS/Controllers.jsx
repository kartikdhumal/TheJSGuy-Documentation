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
        A controller takes the request in and sends the response back. Its only job is the HTTP part:
      </p>
      <ol className="com-list">
        <li className="com-list-item">Read the params, query and body.</li>
        <li className="com-list-item">Call the service.</li>
        <li className="com-list-item">Return the result.</li>
      </ol>
      <p className="com-text">
        Keep your main app logic out of it, that belongs in the service. Whatever you return is sent as JSON for you. If the method is async, Nest waits for the promise for you too.
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
        <h2 className="method-title">Getting data out of the request</h2>
        <p className="com-text">
          These decorators pull parts of the request into your method:
          @Body() → req.body
          @Param('id') → req.params.id
          @Query() → req.query
          @Headers('authorization') → one header
          @Req() / @Res() → the raw Express request and response
          @Ip() → the client's IP address
          Pass a key to get just one value, like @Body('email'). Pass nothing to get the whole object.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Status codes and headers</h2>
        <p className="com-text">
          By default, POST sends back 201 and everything else sends back 200. You can change this with @HttpCode(). Use @Header() to set a header, and @Redirect() to send the user to another URL.
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
        <h2 className="method-title">Skip @Res() unless you really need it</h2>
        <p className="com-text">
          Once you use @Res(), Nest stops sending the response for you. Now you have to call res.json() yourself. Also, interceptors that change the response will stop working. If you only want to set a cookie or a header, use passthrough mode. Then Nest still sends the response for you.
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
          Nest checks routes from top to bottom, in the order you wrote them. Say @Get(':id') comes before @Get('me'). Then a request to /users/me gets caught by :id, with id = "me". Oops. So always put fixed paths (like 'me') above dynamic ones (like ':id').
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
          Sometimes you need to change what a response looks like. But old mobile apps still expect the old shape. Turn on versioning and keep both versions running side by side. Old apps use v1, new apps use v2.
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
