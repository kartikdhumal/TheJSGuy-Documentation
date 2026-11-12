import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

function ToolCalling() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">Tool Calling &amp; AI Agents</h1>
      <p className="com-text">
        On its own, an LLM can only produce text. It cannot check today's weather, read your database or send an email. Tool calling (also called function calling) lets it ask your code to do those things. The model never runs anything itself. It replies with "please call this function with these arguments", your code runs it, and you send the result back.
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">The model chooses which of your functions to call and with what arguments. Your code runs it and returns the result.</p>
      </div>

      <section className="method-section">
        <h2 className="method-title">The tool-calling loop</h2>
        <Flow
          steps={[
            { title: 'User asks', text: '"Is order 1042 shipped?"' },
            { title: 'Model', text: 'Wants getOrderStatus({ id: 1042 })' },
            { title: 'Your code', text: 'Runs the real function' },
            { title: 'Result back', text: '{ status: "shipped" }' },
            { title: 'Model answers', text: '"Yes, it shipped today."' },
          ]}
        />
      </section>

      <section className="method-section">
        <h2 className="method-title">Example with Gemini</h2>
        <p className="com-text">You describe each tool with a name, a clear description and a JSON schema for its arguments. The description matters a lot: it is how the model decides when to use the tool.</p>
        <CodeBlock language="javascript" style={atomDark}>
          {`const tools = [{
  functionDeclarations: [{
    name: 'getOrderStatus',
    description: 'Get the shipping status of a customer order by its order id.',
    parameters: {
      type: 'object',
      properties: { orderId: { type: 'number', description: 'The order id' } },
      required: ['orderId'],
    },
  }],
}];

const functions = {
  getOrderStatus: async ({ orderId }) => db.orders.findStatus(orderId), // your real code
};

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite', tools });
const chat = model.startChat();

let result = await chat.sendMessage('Is order 1042 shipped yet?');
let calls = result.response.functionCalls();

while (calls && calls.length > 0) {
  const responses = await Promise.all(calls.map(async (call) => ({
    functionResponse: { name: call.name, response: await functions[call.name](call.args) },
  })));
  result = await chat.sendMessage(responses); // give the results back to the model
  calls = result.response.functionCalls();
}

console.log(result.response.text()); // "Yes, order 1042 was shipped today."`}
        </CodeBlock>
        <p className="com-text">The while loop matters: the model may need several tools in a row (find the customer, then their latest order, then its status).</p>
      </section>

      <section className="method-section">
        <h2 className="method-title">From tool calling to agents</h2>
        <p className="com-text">
          An agent is simply that loop with more freedom: a goal, a set of tools, and the model decides the steps itself. It thinks, calls a tool, looks at the result, and repeats until the goal is done.
        </p>
        <Flow
          label="Agent loop"
          steps={[
            { title: 'Goal', text: '"Book a meeting with Priya next week"' },
            { title: 'Think', text: 'Which step is next?' },
            { title: 'Act', text: 'Call a tool (check calendar)' },
            { title: 'Observe', text: 'Read the result' },
            { title: 'Repeat or finish', text: 'Until the goal is done' },
          ]}
        />
      </section>

      <section className="method-section">
        <h2 className="method-title">MCP (Model Context Protocol)</h2>
        <p className="com-text">
          Every app used to describe its tools in its own way. MCP is an open standard for this. You build an MCP server once (for example "my company's database tools"), and any MCP-compatible AI app can use those tools. Think of it as USB-C for AI tools: one plug that fits everywhere.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Safety rules for tools</h2>
        <ul className="com-list">
          <li className="com-list-item">Validate every argument the model sends, exactly like you validate user input in an API. The model can send wrong or even injected values.</li>
          <li className="com-list-item">Check permissions inside the tool using the logged-in user from your session, never a user id the model provides.</li>
          <li className="com-list-item">Ask a human to confirm risky actions: sending emails, payments, deleting data.</li>
          <li className="com-list-item">Set a maximum number of loop steps so a confused agent cannot loop forever and burn money.</li>
          <li className="com-list-item">Give the fewest tools needed. Read-only tools are much safer than write tools.</li>
        </ul>
      </section>
    </div>
  );
}

export default ToolCalling;
