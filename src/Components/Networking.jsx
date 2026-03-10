import React, { useEffect } from 'react'
import '../styles/debouncing.css';

function Networking() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className='debounce-container'>
      {/* Networking Section */}
      <h1 id="overview" className="section-title">Networking</h1>

      <div id="osi-model" className="faq-item">
        <h3 className="faq-question">What are the layers of the OSI model?</h3>
        <p className="faq-answer">
          The OSI model consists of seven layers:
          <div>
            <p>Physical Layer: Transmits raw bit streams over a physical medium.</p>
            <p>Data Link Layer: Provides node-to-node data transfer and handles error correction.</p>
            <p>Network Layer: Determines how data is sent to the receiver from the sender.</p>
            <p>Transport Layer: Provides reliable data transfer services to the upper layers.</p>
            <p>Session Layer: Manages sessions between applications.</p>
            <p>Presentation Layer: Translates data between the application layer and the network format.</p>
            <p>Application Layer: Provides network services to the end-user applications.</p>
          </div>
        </p>
      </div>

      <div id="protocols">
        <h2>What are different networking protocols and their definitions?</h2>
        <li className="faq-item">
          <h3 className="faq-question">1. What is HTTP (HyperText Transfer Protocol)?</h3>
          <div className="faq-answer">
            <p>Used for transferring web pages on the internet.</p>
            <p>Operates on a request-response model between clients (browsers) and servers.</p>
            <p>Stateless protocol, meaning each request is independent.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">2. What is HTTPS (HyperText Transfer Protocol Secure)?</h3>
          <div className="faq-answer">
            <p>Secure version of HTTP.</p>
            <p>Encrypts data between the client and server using SSL/TLS.</p>
            <p>Ensures data integrity and privacy.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">3. What is FTP (File Transfer Protocol)?</h3>
          <div className="faq-answer">
            <p>Used for transferring files between computers on a network.</p>
            <p>Supports uploading and downloading files.</p>
            <p>Can operate in active or passive mode.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">4. What is SMTP (Simple Mail Transfer Protocol)?</h3>
          <div className="faq-answer">
            <p>Used for sending emails from clients to servers and between servers.</p>
            <p>Operates on a push mechanism to send emails.</p>
            <p>Often used with IMAP or POP3 for retrieving emails.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">5. What is IMAP (Internet Message Access Protocol)?</h3>
          <div className="faq-answer">
            <p>Used by email clients to retrieve messages from a mail server.</p>
            <p>Allows multiple devices to access the same mailbox.</p>
            <p>Messages are stored on the server for sync across devices.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">6. What is POP3 (Post Office Protocol v3)?</h3>
          <div className="faq-answer">
            <p>Used by email clients to download emails from a server.</p>
            <p>Typically downloads and removes emails from the server.</p>
            <p>Best for single-device email access.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">7. What is SSH (Secure Shell)?</h3>
          <div className="faq-answer">
            <p>Provides a secure channel over an unsecured network.</p>
            <p>Used for remote command-line login and execution.</p>
            <p>Encrypts data to ensure confidentiality and integrity.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">8. What is DNS (Domain player_name System)?</h3>
          <div className="faq-answer">
            <p>Translates domain names (like www.example.com) into IP addresses.</p>
            <p>Essential for locating computer services/devices online.</p>
            <p>Operates in a hierarchical, decentralized manner.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">9. What is DHCP (Dynamic Host Configuration Protocol)?</h3>
          <div className="faq-answer">
            <p>Automatically assigns IP addresses to devices on a network.</p>
            <p>Simplifies network admin by managing IP allocation.</p>
            <p>Ensures each device has a unique IP address.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">10. What is SNMP (Simple Network Management Protocol)?</h3>
          <div className="faq-answer">
            <p>Used for managing and monitoring network devices (routers, switches, servers).</p>
            <p>Lets admins collect info and configure devices remotely.</p>
            <p>Helps monitor performance and detect faults.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">11. What is Telnet?</h3>
          <div className="faq-answer">
            <p>Used for bidirectional text-based communication over a network.</p>
            <p>Allows remote login to devices.</p>
            <p>Not secure — transmits data in plain text. Replaced by SSH in modern systems.</p>
          </div>
        </li>

        <li className="faq-item">
          <h3 className="faq-question">12. What is RTP (Real-time Transport Protocol)?</h3>
          <div className="faq-answer">
            <p>Used for delivering audio and video over IP networks.</p>
            <p>Supports real-time data transmission with minimal delay.</p>
            <p>Common in streaming, video calls, and VoIP apps.</p>
          </div>
        </li>

      </div>


      <div id="subnetting" className="faq-item">
        <h3 className="faq-question">What is subnetting?</h3>
        <p className="faq-answer">
          Subnetting is the practice of dividing a network into smaller logical subnetworks (subnets). It improves network performance and security by reducing broadcast domains and organizing the network structure.
        </p>
      </div>
    </div>
  )
}

export default Networking
