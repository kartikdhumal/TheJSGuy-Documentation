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
        A pipe runs just before the controller method and does one of two things with the input: transform it (string "5" → number 5) or validate it (throw 400 Bad Request if it is wrong). The most important pipe is ValidationPipe, which checks the request body against a DTO class.
      </p>

      <section className="method-section">
        <h2 className="method-title">What is a DTO?</h2>
        <p className="com-text">
          DTO (Data Transfer Object) is a class that describes the shape of data coming in. With class-validator decorators on each field, the DTO becomes both the type and the validation rules. Use a class, not an interface, because interfaces do not exist at runtime and cannot be validated.
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
        <h2 className="method-title">Global ValidationPipe options</h2>
        <p className="com-text">
          1. whitelist: true removes any field that has no decorator in the DTO (stops users sending role: 'admin').
          2. forbidNonWhitelisted: true returns 400 instead of silently removing extra fields.
          3. transform: true turns the plain body into a DTO instance and converts types (query "10" → 10 for a number field).
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
        <h2 className="method-title">Update DTOs with mapped types</h2>
        <p className="com-text">
          Do not copy the create DTO for update. PartialType makes every field optional and keeps the validation rules. PickType, OmitType and IntersectionType build other variations. Import them from @nestjs/swagger if you use Swagger (so docs stay correct), otherwise from @nestjs/mapped-types.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role'] as const),
) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Built-in pipes</h2>
        <p className="com-text">
          ParseIntPipe, ParseFloatPipe, ParseBoolPipe, ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe, DefaultValuePipe and ParseFilePipe. Use them on params and query values.
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
        <h2 className="method-title">Writing a custom pipe</h2>
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
        <h2 className="method-title">Custom validator</h2>
        <p className="com-text">When a rule needs logic or the database (e.g. "email must not already exist"), write a validator constraint.</p>
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
