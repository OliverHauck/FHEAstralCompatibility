import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONFIG, CONTRACT_ABI } from '../config/contract';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [userMatches, setUserMatches] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // Show loading modal
  const showLoading = useCallback((message) => {
    setLoadingMessage(message);
    setLoading(true);
  }, []);

  // Hide loading modal
  const hideLoading = useCallback(() => {
    setLoading(false);
    setLoadingMessage('');
  }, []);

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  }, []);

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!contract || !account) return;

    try {
      // Load profile status
      const profileStatus = await contract.getUserProfileStatus(account);
      setHasProfile(profileStatus.hasProfile || profileStatus[0]);

      // Load user stats
      const stats = await contract.getUserStats(account);
      setUserMatches(stats.toString());

      // Load total matches
      const total = await contract.totalMatches();
      setTotalMatches(total.toString());
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [contract, account]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is required to use this application');
      }

      showLoading('Connecting to wallet...');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== CONFIG.CHAIN_ID) {
        await switchNetwork();
      }

      // Set up ethers
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        CONTRACT_ABI,
        web3Signer
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setAccount(accounts[0]);

      hideLoading();
      showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      hideLoading();
      console.error('Error connecting wallet:', error);
      showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
  }, [showLoading, hideLoading, showNotification]);

  // Switch network
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CONFIG.CHAIN_ID.toString(16) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x' + CONFIG.CHAIN_ID.toString(16),
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [CONFIG.RPC_URL],
                blockExplorerUrls: [CONFIG.EXPLORER_URL],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Sepolia network');
        }
      } else {
        throw switchError;
      }
    }
  };

  // Create profile
  const createProfile = async (zodiacId) => {
    if (!contract || !account) {
      throw new Error('Please connect your wallet first');
    }

    const zodiac = CONFIG.ZODIAC_SIGNS[zodiacId];
    const tx = await contract.createProfile(zodiacId, zodiac.element, zodiac.quality);
    await tx.wait();
    await loadUserData();
  };

  // Update profile
  const updateProfile = async (zodiacId) => {
    if (!contract || !account) {
      throw new Error('Please connect your wallet first');
    }

    const zodiac = CONFIG.ZODIAC_SIGNS[zodiacId];
    const tx = await contract.updateProfile(zodiacId, zodiac.element, zodiac.quality);
    await tx.wait();
  };

  // Request match
  const requestMatch = async (partnerAddress) => {
    if (!contract || !account) {
      throw new Error('Please connect your wallet first');
    }

    // Check if partner has a profile
    const partnerProfile = await contract.getUserProfileStatus(partnerAddress);
    if (!partnerProfile.hasProfile && !partnerProfile[0]) {
      throw new Error('Partner does not have a profile yet');
    }

    const tx = await contract.requestCompatibilityMatch(partnerAddress);
    await tx.wait();
    await loadUserData();
  };

  // Initialize
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    };
    init();
  }, []);

  // Load user data when contract or account changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setContract(null);
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [connectWallet]);

  // Setup contract event listeners
  useEffect(() => {
    if (!contract || !account) return;

    const handleProfileCreated = (user) => {
      if (user.toLowerCase() === account.toLowerCase()) {
        showNotification('Profile created successfully!', 'success');
        loadUserData();
      }
    };

    const handleMatchRequested = (user1, user2, matchId) => {
      if (
        user1.toLowerCase() === account.toLowerCase() ||
        user2.toLowerCase() === account.toLowerCase()
      ) {
        showNotification('New compatibility match requested!', 'success');
        loadUserData();
      }
    };

    const handleCompatibilityRevealed = (matchId, score) => {
      showNotification(`Compatibility score revealed: ${score}%`, 'success');
      loadUserData();
    };

    contract.on('ProfileCreated', handleProfileCreated);
    contract.on('MatchRequested', handleMatchRequested);
    contract.on('CompatibilityRevealed', handleCompatibilityRevealed);

    return () => {
      contract.removeAllListeners('ProfileCreated');
      contract.removeAllListeners('MatchRequested');
      contract.removeAllListeners('CompatibilityRevealed');
    };
  }, [contract, account, loadUserData, showNotification]);

  const value = {
    provider,
    signer,
    contract,
    account,
    hasProfile,
    userMatches,
    totalMatches,
    loading,
    loadingMessage,
    notification,
    connectWallet,
    createProfile,
    updateProfile,
    requestMatch,
    showLoading,
    hideLoading,
    showNotification,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
