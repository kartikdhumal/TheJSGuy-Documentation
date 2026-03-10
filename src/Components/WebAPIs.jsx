import React, { useEffect } from 'react';
import '../styles/debouncing.css';

import 'prismjs/themes/prism.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function WebAPIs() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="debounce-container">
      <h1>Web APIs Documentation</h1>

      <h2>1. Web Storage API</h2>
      <p>Web Storage allows saving key/value pairs in the browser.</p>

      <h3>LocalStorage</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`// localStorage - persists even after browser is closed
localStorage.setItem("userid", "734824643");
console.log(localStorage.getItem("userid")); // "734824643"
localStorage.removeItem("userid");`}
      </CodeBlock>

      <h3>SessionStorage</h3>
      <CodeBlock language="javascript" style={atomDark}>
        {`// sessionStorage - clears when browser/tab is closed
sessionStorage.setItem("userid", "734824643");
console.log(sessionStorage.getItem("userid")); // "734824643"
sessionStorage.removeItem("userid");`}
      </CodeBlock>

      <h2>2. Fetch API</h2>
      <p>Fetch is used to make HTTP requests to servers and returns a Promise.</p>
      <CodeBlock language="javascript" style={atomDark}>
        {`const getData = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log("Error:", err);
  }
};

getData();`}
      </CodeBlock>

      <h2>3. Geolocation API</h2>
      <p>Get user’s geographic location if allowed.</p>
      <CodeBlock language="javascript" style={atomDark}>
        {`if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);
  });
} else {
  console.log("Geolocation not supported");
}`}
      </CodeBlock>

      <h2>4. Notification API</h2>
      <p>Send system-level notifications to the user.</p>
      <CodeBlock language="javascript" style={atomDark}>
        {`if (window.Notification.permission === "granted") {
  new Notification("Hello, Guddu!");
} else if (Notification.permission !== "denied") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("Hello, Guddu!");
    }
  });
}`}
      </CodeBlock>

      <h2>5. Cookie API (via document.cookie)</h2>
      <p>Store small pieces of data sent with each HTTP request.</p>
      <CodeBlock language="javascript" style={atomDark}>
        {`// Set a cookie
document.cookie = "username=Guddu; expires=Fri, 31 Dec 2025 23:59:59 GMT";

// Read cookies
console.log(document.cookie); // Shows all cookies

// Delete cookie (set past expiry date)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";`}
      </CodeBlock>

      <h2>🔍 Difference Between Web APIs</h2>
      <li className="faq-item">
        <h3 className="faq-question">Q1: What is the difference between sessionStorage and localStorage?</h3>
        <p className="faq-answer">
          ➤ <strong>sessionStorage</strong> stores data only for the duration of the page session — once you close the tab, the data is gone.
          ➤ <strong>localStorage</strong> keeps the data even after the browser is closed, unless it is manually cleared.
          ➤ Both can only store strings and work on the same-origin policy.
        </p>
      </li>

      <li className="faq-item">
        <h3 className="faq-question">Q2: What is the difference between localStorage and cookies?</h3>
        <p className="faq-answer">
          ➤ <strong>localStorage</strong> stores data on the client side and doesn’t send it with every HTTP request. It can store up to ~5MB and is ideal for saving user preferences.
          ➤ <strong>Cookies</strong> are smaller (~4KB), sent with every request automatically, and are typically used for authentication and tracking.
          ➤ Excessive use of cookies can slow down requests since they’re always sent to the server.
        </p>
      </li>

      <li className="faq-item">
        <h3 className="faq-question">Q3: What is the difference between sessionStorage and cookies?</h3>
        <p className="faq-answer">
          ➤ <strong>sessionStorage</strong> is purely client-side and data is cleared once the tab is closed.
          ➤ <strong>Cookies</strong> can be configured to expire at a specific time or persist until manually removed.
          ➤ Cookies are sent with every HTTP request, making them suitable for server-related features like login sessions.
          ➤ By default, if you don’t set an expiry time — the cookie becomes a session cookie, and it will be deleted when the browser or tab is closed.
        </p>
      </li>


    </div>
  );
}

export default WebAPIs;
