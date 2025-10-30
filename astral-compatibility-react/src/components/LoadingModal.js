import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './LoadingModal.css';

const LoadingModal = () => {
  const { loading, loadingMessage } = useWeb3();

  if (!loading) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="loading-spinner"></div>
        <h3>Processing Transaction</h3>
        <p>{loadingMessage || 'Please confirm the transaction in your wallet and wait for blockchain confirmation...'}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
