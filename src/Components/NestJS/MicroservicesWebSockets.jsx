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
        Nest is not only for REST APIs. The same modules, providers, guards, pipes and interceptors also work for real-time WebSockets and for microservices. Microservices are small apps that talk to each other over TCP, Redis, RabbitMQ, Kafka or NATS. So you learn the pattern once, and use it everywhere.
      </p>

      <section className="method-section">
        <h2 className="method-title">WebSocket gateway</h2>
        <p className="com-text">
          A gateway is like a controller, but for WebSocket messages instead of HTTP requests. @SubscribeMessage() handles one event. @WebSocketServer() gives you the server, so you can send a message to many users at once. Nest uses Socket.IO by default.
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
          Say you run 2 or more copies of your server. A user connected to server A won't get messages sent from server B. To fix this:
          <br />1. Use the Socket.IO Redis adapter. All servers then share events through Redis Pub/Sub, like a group chat between the servers.
          <br />2. Turn on sticky sessions on the load balancer, so each user keeps talking to the same server.
          For login, check the user in handleConnection (or in a WS guard). Verify the JWT the client sends when it first connects (the handshake).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Server-Sent Events (SSE)</h2>
        <p className="com-text">Sometimes only the server needs to send updates to the client, like job progress or notifications. For this one-way flow, SSE is simpler than WebSockets.</p>
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
          A microservice is a Nest app that listens on a transport instead of HTTP. A transport is just the road the messages travel on, like Redis, TCP or RabbitMQ. There are two ways to send messages:
          <br />1. Request-response (@MessagePattern + client.send): the caller waits for an answer, like asking a question.
          <br />2. Event-based (@EventPattern + client.emit): send it and move on, no answer. Like dropping a note in a letterbox.
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
        <h2 className="method-title">Hybrid app (HTTP + microservice)</h2>
        <p className="com-text">One app can do both: answer HTTP requests and listen on a microservice transport at the same time.</p>
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
          Microservices bring extra problems: network failures, transactions that span many services, version mismatches, and more work to deploy. For most teams, the right start is a modular monolith. That means one app, but split into clear Nest modules that only share what they export. Move a module out into its own service only when it really needs to scale, deploy, or be owned by a team on its own.
        </p>
      </section>
    </div>
  );
}

export default NestJSMicroservicesWebSockets;
