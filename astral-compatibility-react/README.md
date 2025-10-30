# 🌟 Astral Compatibility - React Version

> Privacy-preserving zodiac compatibility matching using React and Fully Homomorphic Encryption (FHE)

This is the **React version** of the FHE Astral Compatibility application, demonstrating how to build privacy-preserving dApps with modern React patterns and Web3 integration.

## 🎯 Overview

**Astral Compatibility React** is a complete React implementation of the privacy-preserving zodiac matching dApp. It showcases:

- ✅ **Modern React Architecture** - React 18 with Hooks and Context API
- ✅ **Web3 Integration** - MetaMask wallet connection with ethers.js v5
- ✅ **Privacy-First Design** - FHE encrypted zodiac data on-chain
- ✅ **Component-Based UI** - Reusable React components with CSS modules
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Real-time Updates** - Contract event listeners for live data
- ✅ **User Experience** - Loading states, notifications, and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MetaMask browser extension
- Sepolia testnet ETH (for transactions)

### Installation

```bash
# Navigate to the project directory
cd examples/astral-compatibility-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

## 📦 Project Structure

```
astral-compatibility-react/
├── public/                      # Static assets
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── components/             # React components
│   │   ├── Navbar.js           # Navigation bar with wallet connection
│   │   ├── Hero.js             # Hero section with stats
│   │   ├── WalletStatus.js     # Wallet connection status
│   │   ├── CreateProfile.js    # Profile creation form
│   │   ├── CompatibilityMatch.js # Match request form
│   │   ├── HowItWorks.js       # Features showcase
│   │   ├── Footer.js           # Footer component
│   │   ├── LoadingModal.js     # Loading overlay
│   │   ├── Notification.js     # Toast notifications
│   │   └── *.css               # Component styles
│   ├── config/
│   │   └── contract.js         # Contract ABI and configuration
│   ├── context/
│   │   └── Web3Context.js      # Web3 context provider
│   ├── App.js                  # Main app component
│   ├── App.css                 # App styles
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 Features

### 1. Wallet Connection
- MetaMask integration with automatic network switching
- Account change detection and reconnection
- Connection status display with formatted address

### 2. Profile Management
- Create encrypted zodiac profile on-chain
- Update existing profile with new zodiac data
- Real-time profile status updates
- Visual feedback for zodiac selection with element and quality

### 3. Compatibility Matching
- Request compatibility matches with other users
- Partner address validation
- Check partner profile existence before matching
- Match history display (placeholder for future implementation)

### 4. User Experience
- Loading modal for transaction processing
- Toast notifications for success/error states
- Responsive design for mobile and desktop
- Smooth scrolling navigation
- Real-time stats updates (total matches, user matches)

### 5. Privacy Features
- All zodiac data encrypted using FHE
- On-chain compatibility calculations on encrypted data
- No plaintext zodiac information exposed
- User controls their own encrypted data

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern React with Hooks and Context
- **React Scripts** - Create React App tooling
- **CSS3** - Custom CSS with CSS variables for theming

### Web3
- **ethers.js v5** - Ethereum blockchain interaction
- **MetaMask** - Wallet connection and transaction signing

### Smart Contract
- **Solidity 0.8.24** - Smart contract language
- **fhEVM v0.5** - Fully Homomorphic Encryption library
- **Sepolia Testnet** - Deployment network

### Development
- **Create React App** - React development environment
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)

## 🌐 Smart Contract

### Contract Details
- **Address**: `0x3897f97Cdfa21926450B05329B55AC7F85F7F066`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x3897f97Cdfa21926450B05329B55AC7F85F7F066)

### Contract Functions Used
- `createProfile(zodiac, element, quality)` - Create encrypted profile
- `updateProfile(zodiac, element, quality)` - Update existing profile
- `requestCompatibilityMatch(partnerAddress)` - Request compatibility calculation
- `getUserProfileStatus(address)` - Check if user has profile
- `getUserStats(address)` - Get user match count
- `totalMatches()` - Get total platform matches

## 💻 Component Architecture

### Web3Context Provider
The `Web3Context` provides centralized Web3 state management:

```javascript
const {
  account,          // Connected wallet address
  hasProfile,       // User profile status
  userMatches,      // User's match count
  totalMatches,     // Total platform matches
  connectWallet,    // Connect wallet function
  createProfile,    // Create profile function
  updateProfile,    // Update profile function
  requestMatch,     // Request match function
  showLoading,      // Show loading modal
  hideLoading,      // Hide loading modal
  showNotification, // Show toast notification
} = useWeb3();
```

### Component Breakdown

**Navbar** - Navigation with wallet connection button
**Hero** - Landing section with statistics
**WalletStatus** - Shows connection and profile status
**CreateProfile** - Zodiac selection and profile creation
**CompatibilityMatch** - Partner matching interface
**HowItWorks** - Feature explanation cards
**Footer** - Footer with links
**LoadingModal** - Transaction loading overlay
**Notification** - Toast notifications for feedback

## 🎯 Key Differences from Vanilla JS Version

| Feature | Vanilla JS Version | React Version |
|---------|-------------------|---------------|
| **Architecture** | Procedural with global state | Component-based with Context API |
| **State Management** | Manual DOM manipulation | React state and hooks |
| **Code Organization** | Single files (app.js, style.css) | Modular components with scoped styles |
| **Reusability** | Limited | High (reusable components) |
| **Maintainability** | Harder to scale | Easy to extend and maintain |
| **Development Experience** | Manual setup | Hot reload with CRA |
| **Bundle Size** | Smaller (vanilla JS) | Larger (React framework) |
| **Learning Curve** | Lower | Higher (React knowledge needed) |

## 🔐 Security Considerations

- Private keys never leave MetaMask
- All zodiac data encrypted before sending to blockchain
- Contract address and ABI are publicly verifiable
- No server-side components (fully decentralized)
- User controls their own data permissions

## 🚧 Future Enhancements

- [ ] Match history display with decryption workflow
- [ ] Reveal compatibility scores with FHE decryption
- [ ] Profile deletion functionality
- [ ] Multiple match requests queue
- [ ] Enhanced zodiac information display
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] PWA offline support
- [ ] IPFS integration for decentralized hosting

## 📚 Learn More

### Related Documentation
- [Main README](../../README.md) - Project overview and SDK documentation
- [Vanilla JS Version](../FHEAstralCompatibility/README.md) - Original implementation
- [Smart Contract](../FHEAstralCompatibility/contracts/AstralCompatibility.sol) - Contract source code

### External Resources
- [React Documentation](https://react.dev/) - Learn React
- [ethers.js Documentation](https://docs.ethers.org/v5/) - Web3 library
- [Zama fhEVM](https://docs.zama.ai/fhevm) - FHE technology
- [Create React App](https://create-react-app.dev/) - React tooling

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details

## 🙏 Acknowledgments

- **Zama** - For fhEVM technology and FHE libraries
- **React Team** - For the amazing React framework
- **ethers.js** - For Web3 integration
- **FHEVM Season 2 Bounty** - For supporting this project

---

**Built with ❤️ using React and FHE technology**

[View Live Demo](https://your-deployment-url.com) • [Report Bug](https://github.com/yourusername/fhevm-react-template/issues) • [Request Feature](https://github.com/yourusername/fhevm-react-template/issues)
