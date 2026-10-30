import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSDatabase() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Database with TypeORM</h1>
      <p className="com-text">
        NestJS works with any database library, but has official modules for TypeORM (SQL: PostgreSQL, MySQL) and Mongoose (MongoDB). Prisma and Drizzle are also popular and are used as a normal provider. This page uses TypeORM with PostgreSQL, the most common SQL setup in NestJS projects.
      </p>

      <section className="method-section">
        <h2 className="method-title">Connect once in AppModule</h2>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i @nestjs/typeorm typeorm pg`}
        </CodeBlock>
        <CodeBlock language="typescript" style={atomDark}>
          {`TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    url: config.getOrThrow('DATABASE_URL'),
    autoLoadEntities: true,      // picks up entities from every forFeature()
    synchronize: false,          // never true in production, use migrations
    logging: ['error'],
  }),
}),`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Entities and relations</h2>
        <p className="com-text">
          An entity is a class mapped to a table. Relations are declared on both sides: @ManyToOne holds the foreign key column, @OneToMany is the inverse side.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })               // not returned unless asked for
  password: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()                      // soft delete
  deletedAt?: Date;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: string;                           // decimals come back as string

  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Repository in a service</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  findAll(page = 1, limit = 10) {
    return this.usersRepo.findAndCount({
      where: { deletedAt: IsNull() },
      relations: { orders: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async create(dto: CreateUserDto) {
    const user = this.usersRepo.create({ ...dto, password: await hash(dto.password, 10) });
    return this.usersRepo.save(user);
  }

  remove(id: string) {
    return this.usersRepo.softDelete(id);
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Query builder for complex queries</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`const topCustomers = await this.usersRepo
  .createQueryBuilder('u')
  .innerJoin('u.orders', 'o')
  .select(['u.id AS id', 'u.email AS email'])
  .addSelect('SUM(o.total)', 'spent')
  .where('o.createdAt >= :from', { from })      // always use parameters, never string concat
  .groupBy('u.id')
  .orderBy('spent', 'DESC')
  .limit(10)
  .getRawMany();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Transactions</h2>
        <p className="com-text">
          When several writes must all succeed or all fail (create order + reduce stock + create payment), run them in one transaction. Inside, use the given manager for every query, not the injected repositories, or those queries will run outside the transaction.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`constructor(private readonly dataSource: DataSource) {}

async placeOrder(userId: string, dto: CreateOrderDto) {
  return this.dataSource.transaction(async (manager) => {
    const product = await manager.findOne(Product, {
      where: { id: dto.productId },
      lock: { mode: 'pessimistic_write' },          // SELECT ... FOR UPDATE
    });
    if (!product || product.stock < dto.qty) {
      throw new BadRequestException('Out of stock');   // rolls back
    }
    product.stock -= dto.qty;
    await manager.save(product);
    return manager.save(Order, { userId, productId: product.id, qty: dto.qty });
  });
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Migrations</h2>
        <p className="com-text">
          synchronize: true auto-changes tables to match entities. Handy locally, dangerous in production (a renamed column can drop data). Use migrations: versioned SQL files you review and run on deploy.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`# data-source.ts exports a DataSource used by the CLI
npx typeorm-ts-node-commonjs migration:generate src/database/migrations/AddOrders -d src/data-source.ts
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
npx typeorm-ts-node-commonjs migration:revert -d src/data-source.ts`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Using MongoDB instead (Mongoose)</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ default: 0 }) stock: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);

// module
MongooseModule.forRoot(process.env.MONGO_URL),
MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

// service
constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Avoid the N+1 problem</h2>
        <p className="com-text">
          Loading 50 users and then calling a query for each user's orders = 51 queries. Load the relation in the same query (relations option or a join in the query builder), or fetch all orders with one WHERE userId IN (...) query and group them in code.
        </p>
      </section>
    </div>
  );
}

export default NestJSDatabase;
