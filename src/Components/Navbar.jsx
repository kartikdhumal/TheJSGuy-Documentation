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
            {card.groups?.map((group) => (
              <details key={group.name} className="navbar-group">
                <summary className="navbar-group-summary">
                  <span className="navbar-group-name">{group.name}</span>
                  <span className="navbar-group-full">{group.fullForm}</span>
                  <span className="navbar-group-arrow" aria-hidden="true">▾</span>
                </summary>
                <p className="navbar-group-about">{group.about}</p>
                {group.sections.map((section) => (
                  <div key={section.title} className="navbar-group-section">
                    <p className="navbar-group-section-title">{section.title}</p>
                    <div className="navbar-links">
                      {section.links.map((link) => (
                        <div key={link.to} className="navbar-item">
                          <Link to={link.to} className="navbar-link">{link.label}</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </details>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
