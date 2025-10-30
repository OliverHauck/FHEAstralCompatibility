import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './WalletStatus.css';

const WalletStatus = () => {
  const { account, hasProfile } = useWeb3();

  if (!account) return null;

  const formatAddress = (address) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div className="wallet-status">
      <div className="container">
        <div className="status-content">
          <div className="status-info">
            <span className="status-icon">✅</span>
            <span>Connected: <span className="address">{formatAddress(account)}</span></span>
          </div>
          <div className="profile-info">
            <span>{hasProfile ? 'Profile Created ✅' : 'No Profile'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
