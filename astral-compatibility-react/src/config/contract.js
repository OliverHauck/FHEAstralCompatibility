// Blockchain Configuration
export const CONFIG = {
  CONTRACT_ADDRESS: '0x3897f97Cdfa21926450B05329B55AC7F85F7F066',
  CHAIN_ID: 11155111, // Sepolia testnet
  RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
  EXPLORER_URL: 'https://sepolia.etherscan.io',

  // Zodiac signs mapping
  ZODIAC_SIGNS: [
    { id: 0, name: 'Aries', element: 0, quality: 0 },
    { id: 1, name: 'Taurus', element: 1, quality: 1 },
    { id: 2, name: 'Gemini', element: 2, quality: 2 },
    { id: 3, name: 'Cancer', element: 3, quality: 0 },
    { id: 4, name: 'Leo', element: 0, quality: 1 },
    { id: 5, name: 'Virgo', element: 1, quality: 2 },
    { id: 6, name: 'Libra', element: 2, quality: 0 },
    { id: 7, name: 'Scorpio', element: 3, quality: 1 },
    { id: 8, name: 'Sagittarius', element: 0, quality: 2 },
    { id: 9, name: 'Capricorn', element: 1, quality: 0 },
    { id: 10, name: 'Aquarius', element: 2, quality: 1 },
    { id: 11, name: 'Pisces', element: 3, quality: 2 }
  ],

  // Elements
  ELEMENTS: ['Fire', 'Earth', 'Air', 'Water'],

  // Qualities
  QUALITIES: ['Cardinal', 'Fixed', 'Mutable']
};

// Contract ABI - Simplified version for UI interaction
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'uint8', name: '_zodiac', type: 'uint8' },
      { internalType: 'uint8', name: '_element', type: 'uint8' },
      { internalType: 'uint8', name: '_quality', type: 'uint8' }
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_partner', type: 'address' }
    ],
    name: 'requestCompatibilityMatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_zodiac', type: 'uint8' },
      { internalType: 'uint8', name: '_element', type: 'uint8' },
      { internalType: 'uint8', name: '_quality', type: 'uint8' }
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' }
    ],
    name: 'getUserProfileStatus',
    outputs: [
      { internalType: 'bool', name: 'hasProfile', type: 'bool' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' }
    ],
    name: 'getUserStats',
    outputs: [
      { internalType: 'uint256', name: 'matchCount', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalMatches',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'ProfileCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user1', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user2', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'matchId', type: 'bytes32' }
    ],
    name: 'MatchRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'matchId', type: 'bytes32' },
      { indexed: false, internalType: 'uint8', name: 'score', type: 'uint8' }
    ],
    name: 'CompatibilityRevealed',
    type: 'event'
  }
];
