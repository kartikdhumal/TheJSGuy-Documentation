import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { navbarCards } from '../utils/navbarData';

function Navbar() {
  return (
    <div className="main">
      <div className="navbar-container">
        {navbarCards.map((card, index) => (
          <div key={index} className="navbar-section">
            <div className="navbar-section-header">
              <h1 className="navbar-title">{card.title}</h1>
              {(card.version && card.versionDate && card.version !== '—') && (
                <span className="navbar-version-badge">
                  <span className="navbar-version-badge-version">{card.version}</span>
                  <span className="navbar-version-badge-date">{card.versionDate}</span>
                </span>
              )}
            </div>
            {card.useOuterWrapper ? (
              <div className="navbar-outer">
                <div className="navbar-links">
                  {card.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="navbar-item">
                      <Link to={link.to} className="navbar-link">{link.label}</Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="navbar-links">
                {card.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="navbar-item">
                    <Link to={link.to} className="navbar-link">{link.label}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
