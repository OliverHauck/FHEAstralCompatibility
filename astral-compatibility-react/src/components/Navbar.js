import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './Navbar.css';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1>🌟 Astral Compatibility</h1>
        </div>
        <div className="nav-menu">
          <a href="#home" className="nav-link">Home</a>
          <a href="#create-profile" className="nav-link">Create Profile</a>
          <a href="#matches" className="nav-link">Matches</a>
          <button
            className="connect-btn"
            onClick={connectWallet}
            disabled={!!account}
          >
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
