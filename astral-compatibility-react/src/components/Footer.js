import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h4>Astral Compatibility</h4>
            <p>Privacy-preserving zodiac compatibility powered by FHE encryption</p>
          </div>
          <div className="footer-links">
            <a href="#home" className="footer-link">Privacy Policy</a>
            <a href="#home" className="footer-link">Terms of Service</a>
            <a href="#home" className="footer-link">Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Astral Compatibility. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
