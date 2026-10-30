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
        You can use any database library with Nest. But Nest has official modules for two of them: TypeORM (for SQL databases like PostgreSQL and MySQL) and Mongoose (for MongoDB). Prisma and Drizzle are popular too. You just use them as a normal provider. On this page we use TypeORM with PostgreSQL, because that's the most common SQL setup in Nest projects.
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
    autoLoadEntities: true,      // finds entities from every forFeature() by itself
    synchronize: false,          // never true in production, use migrations instead
    logging: ['error'],
  }),
}),`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Entities and how tables connect</h2>
        <p className="com-text">
          An entity is just a class that stands for a table. Each property is a column. Relations are links between tables, like "one user has many orders". You write the link on both classes:
        </p>
        <ol className="com-list">
          <li className="com-list-item">@ManyToOne goes on the side that holds the foreign key column (here, each order stores its userId).</li>
          <li className="com-list-item">@OneToMany goes on the other side (the user), so you can reach the orders from the user.</li>
        </ol>
        <p className="com-text">
          To read and write rows, you use a repository. A repository is a helper object for one table, with ready-made methods like find, save and softDelete. You register the entity with forFeature() in its module, then ask for the repository in your service (see below).
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
        <h2 className="method-title">Using a repository in a service</h2>
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
        <h2 className="method-title">Query builder for harder queries</h2>
        <CodeBlock language="typescript" style={atomDark}>
          {`const topCustomers = await this.usersRepo
  .createQueryBuilder('u')
  .innerJoin('u.orders', 'o')
  .select(['u.id AS id', 'u.email AS email'])
  .addSelect('SUM(o.total)', 'spent')
  .where('o.createdAt >= :from', { from })      // always use parameters, never glue strings together
  .groupBy('u.id')
  .orderBy('spent', 'DESC')
  .limit(10)
  .getRawMany();`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Transactions</h2>
        <p className="com-text">
          Sometimes a few writes must all work, or none of them should happen. For example: create the order, reduce the stock, create the payment. If one step fails, you don't want half of it saved. A transaction wraps these steps together, so it's "all or nothing".
          One important thing: inside the transaction, use the manager you are given for every query. Don't use your injected repositories there. If you do, those queries run outside the transaction.
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
      throw new BadRequestException('Out of stock');   // undoes everything in this transaction
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
          synchronize: true changes your tables by itself to match your entities. That's handy on your own laptop. But it's risky in production: if you rename a column, it can delete the old column and its data. So use migrations instead. A migration is a small SQL file that changes your tables one step at a time, like a git commit for your database. You read it, then run it when you deploy.
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
          Say you load 50 users, then run one more query for each user's orders. That's 51 queries for one page. It's slow. Fix it in one of two ways:
        </p>
        <ol className="com-list">
          <li className="com-list-item">Load the orders in the same query (with the relations option, or a join in the query builder).</li>
          <li className="com-list-item">Or get all the orders with one WHERE userId IN (...) query, and group them in your code.</li>
        </ol>
      </section>
    </div>
  );
}

export default NestJSDatabase;
