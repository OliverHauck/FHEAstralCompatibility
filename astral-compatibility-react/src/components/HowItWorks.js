import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Privacy-preserving astrological compatibility using advanced cryptography</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Fully Private</h3>
            <p>
              Your zodiac information is encrypted using FHE technology. No one can see your
              personal astrological data.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Matching</h3>
            <p>
              Compatible calculations happen directly on the blockchain without revealing
              individual zodiac signs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Accurate Analysis</h3>
            <p>
              Based on traditional astrological principles including elements, qualities, and
              zodiac relationships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
