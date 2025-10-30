import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './Hero.css';

const Hero = () => {
  const { userMatches, totalMatches } = useWeb3();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Privacy-Preserving Zodiac Compatibility</h2>
          <p>
            Discover your astrological compatibility without revealing your personal zodiac
            information. Powered by Fully Homomorphic Encryption (FHE) technology.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{totalMatches}</span>
              <span className="stat-label">Total Matches</span>
            </div>
            <div className="stat">
              <span className="stat-number">{userMatches}</span>
              <span className="stat-label">Your Matches</span>
            </div>
          </div>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection('create-profile')}
            >
              Get Started
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => scrollToSection('matches')}
            >
              View Matches
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
