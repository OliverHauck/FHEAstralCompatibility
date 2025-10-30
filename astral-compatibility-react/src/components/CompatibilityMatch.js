import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import './CompatibilityMatch.css';

const CompatibilityMatch = () => {
  const { account, requestMatch, showLoading, hideLoading, showNotification } = useWeb3();
  const [partnerAddress, setPartnerAddress] = useState('');

  const handleRequestMatch = async () => {
    if (!account) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    if (!partnerAddress) {
      showNotification('Please enter partner address', 'error');
      return;
    }

    if (!ethers.utils.isAddress(partnerAddress)) {
      showNotification('Please enter a valid Ethereum address', 'error');
      return;
    }

    if (partnerAddress.toLowerCase() === account.toLowerCase()) {
      showNotification('You cannot match with yourself', 'error');
      return;
    }

    try {
      showLoading('Requesting compatibility match...');
      await requestMatch(partnerAddress);
      hideLoading();
      showNotification('Compatibility match requested! The compatibility score is being calculated privately.', 'success');
      setPartnerAddress('');
    } catch (error) {
      hideLoading();
      console.error('Error requesting match:', error);
      showNotification('Failed to request match: ' + error.message, 'error');
    }
  };

  return (
    <section id="matches" className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Compatibility Matching</h2>
          <p>Request compatibility analysis with another user</p>
        </div>

        <div className="match-form">
          <div className="form-group">
            <label htmlFor="partnerAddress">Partner's Wallet Address</label>
            <input
              type="text"
              id="partnerAddress"
              className="form-control"
              placeholder="0x..."
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
            />
            <small className="form-text">
              Enter the wallet address of the person you want to match with
            </small>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleRequestMatch}>
              Request Compatibility Match
            </button>
          </div>
        </div>

        <div className="match-results">
          <h3>Your Compatibility Matches</h3>
          <div className="match-list">
            <p>Match results will be displayed here once the compatibility calculations are complete.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompatibilityMatch;
