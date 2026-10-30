import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSPipesValidation() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Pipes, DTOs &amp; Validation</h1>
      <p className="com-text">
        A pipe runs right before your controller method. It checks and cleans the input before it reaches you, like washing vegetables before cooking. It does one of two things:
        <br />1. Transform: change the input, like the string "5" → the number 5.
        <br />2. Validate: check the input, and throw 400 Bad Request if it is wrong.
        The pipe you will use most is ValidationPipe. It checks the request body against a DTO class.
      </p>

      <section className="method-section">
        <h2 className="method-title">What is a DTO?</h2>
        <p className="com-text">
          A DTO (Data Transfer Object) is a class that describes what the incoming data should look like. You put class-validator decorators on each field. Now the DTO does two jobs: it is the type, and it is the list of rules. Use a class, not an interface. Interfaces disappear when your code runs, so there is nothing to check against.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i class-validator class-transformer`}
        </CodeBlock>
        <CodeBlock language="typescript" style={atomDark}>
          {`// dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'password must contain an uppercase letter' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ValidateNested({ each: true })
  @Type(() => AddressDto)               // needed so nested objects become class instances
  @IsArray()
  addresses: AddressDto[];
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">ValidationPipe settings for the whole app</h2>
        <p className="com-text">
          1. whitelist: true removes any field that has no decorator in the DTO. This stops users from sneaking in something like role: 'admin'.
          <br />2. forbidNonWhitelisted: true sends back a 400 error instead of quietly removing extra fields.
          <br />3. transform: true turns the plain body into a real DTO object. It also converts types (query "10" → 10 for a number field).
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);

// Error response for a bad body (400)
// {
//   "statusCode": 400,
//   "message": ["email must be an email", "password must be longer than or equal to 8 characters"],
//   "error": "Bad Request"
// }`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Update DTOs without copy-paste</h2>
        <p className="com-text">
          Don't copy your create DTO to make an update DTO. Use PartialType instead. It makes every field optional and keeps all the rules. PickType, OmitType and IntersectionType let you build other versions too. If you use Swagger, import them from @nestjs/swagger so your docs stay correct. If not, import them from @nestjs/mapped-types.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role'] as const),
) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Pipes that come with Nest</h2>
        <p className="com-text">
          Nest gives you these ready to use: ParseIntPipe, ParseFloatPipe, ParseBoolPipe, ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe, DefaultValuePipe and ParseFilePipe. Use them on params and query values.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {}

@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Writing your own pipe</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') return value.trim();
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (typeof value[key] === 'string') value[key] = value[key].trim();
      }
    }
    return value;
  }
}

@Post()
create(@Body(TrimPipe) dto: CreateUserDto) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Writing your own validation rule</h2>
        <p className="com-text">Sometimes a rule needs real code or a database check, like "this email must not already exist". For that, write your own validator constraint (a class that holds your custom rule).</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@ValidatorConstraint({ name: 'isStrongPin' })
export class IsStrongPin implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^\\d{4}$/.test(value) && !['1234', '0000'].includes(value);
  }
  defaultMessage() {
    return 'PIN must be 4 digits and not too simple';
  }
}

export class SetPinDto {
  @Validate(IsStrongPin)
  pin: string;
}`}
        </CodeBlock>
      </section>
    </div>
  );
}

export default NestJSPipesValidation;
