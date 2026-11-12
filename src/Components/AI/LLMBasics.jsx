import React, { useEffect } from 'react';
import '../../styles/debouncing.css';
import '../../styles/ai.css';
import CodeBlock from '../CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Flow from './Flow';

const TOKENS = ['How', ' do', ' I', ' reset', ' my', ' pass', 'word', '?'];

function LLMBasics() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="debounce-container">
      <h1 className="title">How LLMs Work</h1>
      <p className="com-text">
        An LLM (Large Language Model) is a very big program that has read a huge amount of text. Its only real job is to guess the next small piece of text. It guesses one piece, adds it to the text, and guesses again. Do this a few hundred times and you get a full answer. It is like the "suggest next word" on your phone keyboard, but trained on most of the internet.
      </p>

      <div className="definition-box">
        <p className="definition-label">In one line</p>
        <p className="definition-text">An LLM reads your text as tokens and keeps predicting the most likely next token until the answer is done.</p>
      </div>

      <section className="method-section">
        <h2 className="method-title">Tokens: how the model reads text</h2>
        <p className="com-text">
          The model does not read letters or full words. It reads tokens. A token is a small chunk of text, often a full short word or a piece of a longer word. As a rough rule, 1 token is about 4 characters of English, so 100 tokens is about 75 words.
        </p>
        <div className="ai-tokens" aria-label="Example sentence split into tokens">
          {TOKENS.map((token, index) => (
            <span key={`${token}-${index}`} className="ai-token">{token.replace(' ', '·')}</span>
          ))}
        </div>
        <p className="com-text">
          "How do I reset my password?" becomes about 8 tokens. The dot (·) shows a space that belongs to the token. Notice "password" is split into two tokens. Why should you care? Because you pay per token, and every model has a token limit.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">How one answer is generated</h2>
        <Flow
          label="One loop per token"
          steps={[
            { title: 'Your prompt', text: 'Turned into tokens' },
            { title: 'Model', text: 'Scores every possible next token' },
            { title: 'Pick one', text: 'Usually a likely one' },
            { title: 'Append', text: 'Add it, then loop again' },
          ]}
        />
        <p className="com-text">
          This is why answers appear word by word in ChatGPT or Gemini. The model is literally making them one token at a time, and the app shows each token as soon as it exists (that is called streaming).
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Context window: the model's short-term memory</h2>
        <p className="com-text">
          The context window is the maximum number of tokens the model can look at in one request. That includes your instructions, the chat history, any documents you paste, and the answer it writes. Anything outside the window, the model simply cannot see.
        </p>
        <ul className="com-list">
          <li className="com-list-item">The model has no memory between requests. Every request starts fresh.</li>
          <li className="com-list-item">A chat app "remembers" because it sends the old messages again with every new message.</li>
          <li className="com-list-item">Long chats get expensive and slow, so apps trim or summarise old messages.</li>
        </ul>
      </section>

      <section className="method-section">
        <h2 className="method-title">Temperature: how creative the answer is</h2>
        <p className="com-text">
          Temperature controls how "brave" the model is when picking the next token. Low temperature means it almost always picks the most likely token, so answers are stable and repeatable. High temperature means it sometimes picks less likely tokens, so answers are more varied and creative.
        </p>
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr><th>Temperature</th><th>Behaviour</th><th>Use it for</th></tr>
            </thead>
            <tbody>
              <tr><td>0 to 0.3</td><td>Focused, nearly the same answer every time</td><td>Extracting data, classification, code, factual Q&amp;A</td></tr>
              <tr><td>0.5 to 0.8</td><td>Balanced</td><td>Normal chat assistants</td></tr>
              <tr><td>0.9 and above</td><td>Creative, can wander off</td><td>Brainstorming, stories, marketing ideas</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="method-section">
        <h2 className="method-title">Hallucination: confident but wrong</h2>
        <p className="com-text">
          The model is trained to produce text that sounds right, not text that is checked for truth. So when it does not know something, it can still produce a confident, wrong answer. This is called a hallucination. It happens most with facts it never saw, like your company's private data or very recent events.
        </p>
        <p className="com-text">
          The main fixes: give it the real facts inside the prompt (that is exactly what RAG does), tell it to say "I don't know" when the facts are missing, and keep temperature low for factual tasks.
        </p>
      </section>

      <section className="method-section">
        <h2 className="method-title">Calling an LLM from Node.js</h2>
        <p className="com-text">
          This uses Google's Gemini SDK, the same one Walyze uses. Other providers (OpenAI, Anthropic) look almost the same: a model name, your messages, some settings, and a text answer back. Model names change often, so always check the provider's docs for the current one.
        </p>
        <CodeBlock language="javascript" style={atomDark}>
          {`import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
  systemInstruction: 'You are a helpful assistant. Answer in 2 short sentences.',
  generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
});

const result = await model.generateContent('What is a database index?');
console.log(result.response.text());`}
        </CodeBlock>
        <ul className="com-list">
          <li className="com-list-item">Keep the API key on the server, never in frontend code. Anyone can read frontend code.</li>
          <li className="com-list-item">maxOutputTokens caps the answer length, which also caps the cost.</li>
        </ul>
      </section>
    </div>
  );
}

export default LLMBasics;
