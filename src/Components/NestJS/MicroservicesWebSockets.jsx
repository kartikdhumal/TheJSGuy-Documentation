import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NestJSMicroservicesWebSockets() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">WebSockets &amp; Microservices</h1>
      <p className="com-text">
        NestJS is not only for REST APIs. The same modules, providers, guards, pipes and interceptors work for real-time WebSocket gateways and for microservices that talk over TCP, Redis, RabbitMQ, Kafka or NATS. You learn the pattern once and reuse it.
      </p>

      <section className="method-section">
        <h2 className="method-title">WebSocket gateway</h2>
        <p className="com-text">
          A gateway is like a controller for WebSocket messages. @SubscribeMessage() handles an event, @WebSocketServer() gives the server to broadcast. Socket.IO is the default adapter.
        </p>
        <CodeBlock language="bash" style={atomDark}>
          {`npm i @nestjs/websockets @nestjs/platform-socket.io`}
        </CodeBlock>
        <CodeBlock language="typescript" style={atomDark}>
          {`@WebSocketGateway({ namespace: 'chat', cors: { origin: process.env.FRONTEND_URL } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('left', client.id);
  }

  @SubscribeMessage('join')
  join(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    return { event: 'joined', data: roomId };      // reply to the sender
  }

  @SubscribeMessage('message')
  message(@MessageBody() dto: ChatMessageDto) {
    this.server.to(dto.roomId).emit('message', dto); // broadcast to the room
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Scaling WebSockets</h2>
        <p className="com-text">
          With 2+ server instances, a user on server A does not get messages emitted on server B. Use the Socket.IO Redis adapter so all instances share events through Redis Pub/Sub, and enable sticky sessions on the load balancer. Authenticate in handleConnection (or a WS guard) by verifying the JWT sent in the handshake.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Server-Sent Events (SSE)</h2>
        <p className="com-text">For one-way server → client updates (job progress, notifications), SSE is simpler than WebSockets.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`@Sse('jobs/:id/progress')
progress(@Param('id') id: string): Observable<MessageEvent> {
  return this.jobsService.progress$(id).pipe(map((percent) => ({ data: { percent } })));
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Microservices</h2>
        <p className="com-text">
          A microservice is a Nest app that listens on a transport instead of HTTP. Two message styles:
          1. Request-response (@MessagePattern + client.send): the caller waits for a reply.
          2. Event-based (@EventPattern + client.emit): fire-and-forget, no reply.
        </p>
        <CodeBlock language="typescript" style={atomDark}>
          {`// orders-service/main.ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});
await app.listen();

// orders-service controller
@Controller()
export class OrdersController {
  @MessagePattern('orders.get')                 // request-response
  getOrder(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @EventPattern('user.deleted')                 // event
  async onUserDeleted(@Payload() data: { userId: string }) {
    await this.ordersService.anonymise(data.userId);
  }
}`}
        </CodeBlock>
        <CodeBlock language="typescript" style={atomDark}>
          {`// api-gateway: register a client
ClientsModule.register([
  { name: 'ORDERS', transport: Transport.REDIS, options: { host: 'localhost', port: 6379 } },
])

@Injectable()
export class GatewayService {
  constructor(@Inject('ORDERS') private readonly orders: ClientProxy) {}

  getOrder(id: number) {
    return firstValueFrom(this.orders.send('orders.get', id).pipe(timeout(5000)));
  }

  userDeleted(userId: string) {
    this.orders.emit('user.deleted', { userId });
  }
}`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">Hybrid app</h2>
        <p className="com-text">One app can serve HTTP and listen to a microservice transport at the same time.</p>
        <CodeBlock language="typescript" style={atomDark}>
          {`const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.RMQ,
  options: { urls: [process.env.RABBIT_URL], queue: 'orders' },
});
await app.startAllMicroservices();
await app.listen(3000);`}
        </CodeBlock>
      </section>

      <section className="method-section">
        <h2 className="method-title">When not to use microservices</h2>
        <p className="com-text">
          Microservices add network failures, distributed transactions, versioning and deployment overhead. A well-structured modular monolith (clear NestJS modules with exported boundaries) is the right start for most teams. Split a module into a service only when it needs independent scaling, deployment or ownership.
        </p>
      </section>
    </div>
  );
}

export default NestJSMicroservicesWebSockets;
