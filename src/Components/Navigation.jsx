import React from 'react'
import '../styles/navigation.css';
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Navigation() {
    return (
        <footer className="footer-container">
            <div className="footer-accent" />
            <div className="footer-inner">
                <div className="footer-credit">
                    <p className="footer-text">
                        Made with <span className="footer-heart">❤️</span> by{' '}
                        <a
                            href="https://kartikdhumal.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-name-link"
                        >
                            Kartik Dhumal
                        </a>
                        <br/>
                        <span className="footer-year">© {new Date().getFullYear()}</span>
                    </p>
                </div>
                <div className="footer-divider" aria-hidden="true" />
                <div className="social-links">
                    <a
                        href="https://www.linkedin.com/in/kartikdhumal/"
                        className="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin className="social-icon" />
                    </a>
                    <a
                        href="https://github.com/kartikdhumal"
                        className="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <FaGithub className="social-icon" />
                    </a>
                    <a
                        href="mailto:kartikdhumal24@gmail.com"
                        className="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Email"
                    >
                        <FaEnvelope className="social-icon" />
                    </a>
                    <a
                        href="https://www.instagram.com/kartik_dhumal._/"
                        className="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <FaInstagram className="social-icon" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Navigation
