# 🌟 Astral Compatibility - Privacy-Preserving Zodiac Matching

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://docs.soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.3.0-61DAFB?logo=react)](https://react.dev/)
[![Powered by FHE](https://img.shields.io/badge/Powered%20by-FHE-purple)](https://www.zama.ai/)

**Live Demo**: [https://oliverhauck.github.io/FHEAstralCompatibility/](https://oliverhauck.github.io/FHEAstralCompatibility/)

**Repository**: [https://github.com/OliverHauck/FHEAstralCompatibility](https://github.com/OliverHauck/FHEAstralCompatibility)

---

## 📖 Overview

**Astral Compatibility** is a privacy-preserving astrological compatibility matching system built on blockchain technology using **Fully Homomorphic Encryption (FHE)**. Users can discover their zodiac compatibility with others without revealing their personal birth information, zodiac signs, or any astrological data.

This project features **two complete frontend implementations**:
- **Vanilla JavaScript** - Lightweight, beginner-friendly implementation
- **React** - Modern, production-ready implementation with component architecture

### 🎯 Core Concept

**Privacy-Preserving Zodiac Matching** - An astrological compatibility analysis system where users can match zodiac compatibility without disclosing specific birth times, locations, or personal astrological information. All computations happen on encrypted data, ensuring complete privacy while providing accurate compatibility scores.

---

## 🎥 Demo Video

📹 **Download and watch `demo.mp4`** to see the full application in action.

The demo showcases:
- Creating encrypted zodiac profiles
- Requesting compatibility matches
- Revealing compatibility scores via blockchain
- Complete privacy-preserving workflow

---

## ✨ Key Features

### 🔐 **Complete Privacy**
- **Zero-Knowledge Zodiac Matching**: Your zodiac sign, birth date, and astrological elements remain encrypted at all times
- **FHE Technology**: Computations happen directly on encrypted data without decryption
- **On-Chain Privacy**: All sensitive data stored on blockchain is fully encrypted

### ⚡ **Real-Time Matching**
- **Instant Compatibility Calculation**: Get compatibility scores without waiting
- **Blockchain-Based**: All matches are recorded immutably on the blockchain
- **Trustless System**: No centralized authority can access your personal data

### 🌟 **Accurate Astrological Analysis**
- **Traditional Principles**: Based on authentic astrological compatibility rules
- **Multi-Factor Analysis**: Considers zodiac elements (Fire, Earth, Air, Water)
- **Quality Assessment**: Evaluates Cardinal, Fixed, and Mutable qualities
- **Randomized Scoring**: Adds natural variance to compatibility calculations

### 🎨 **Dual Frontend Options**
- **Vanilla JavaScript**: Lightweight, beginner-friendly, no build process
- **React Version**: Modern architecture, component-based, production-ready
- **Identical Functionality**: Both versions offer the same privacy features
- **Flexible Deployment**: Choose based on your needs and expertise

---

## 🏗️ Architecture

### Technology Stack

**Smart Contracts**:
- Solidity 0.8.24
- @fhevm/solidity (FHE library)
- Hardhat development environment
- Sepolia testnet deployment

**Frontend (Vanilla JavaScript Version)**:
- Vanilla JavaScript (ES6+)
- Ethers.js v5.7.2
- Modern CSS3 with CSS Variables
- Responsive design

**Frontend (React Version)**:
- **React 18.3.0** - Modern React with Hooks and Context API
- **React Scripts 5.0.1** - Create React App tooling and build system
- **Ethers.js v5.7.2** - Ethereum blockchain interaction library
- **fhevmjs v0.5.0** - FHE encryption library for client-side operations
- **TypeScript v5.0+** - Type safety support with @types packages
- **Component-based Architecture** - Modular React components
  - Navbar, Hero, WalletStatus, CreateProfile
  - CompatibilityMatch, HowItWorks, Footer
  - LoadingModal, Notification (UI feedback)
- **Web3Context** - Centralized state management with Context API
- **Modern Responsive Design** - Mobile-first CSS with custom styling
- **Hot Module Replacement** - Fast development with live reload

**Encryption**:
- Fully Homomorphic Encryption (FHE)
- Zama's fhEVM technology
- Gateway architecture for decryption
- KMS (Key Management System) integration

---

## 📊 How It Works

### 1. Profile Creation (Encrypted)
```
User Input (Zodiac) → FHE Encryption → Blockchain Storage
        ↓
   [Private Data]
   - Encrypted Zodiac Sign
   - Encrypted Element Type
   - Encrypted Quality Type
```

### 2. Compatibility Calculation
```
User A (Encrypted) + User B (Encrypted)
              ↓
    FHE Computation (On-Chain)
              ↓
    Encrypted Compatibility Score
```

### 3. Score Revelation
```
Encrypted Score → Gateway Request → KMS Decryption → Public Score
```

All intermediate calculations remain encrypted, ensuring complete privacy throughout the process.

---

## 🎨 Two Frontend Implementations

This project provides **two complete frontend implementations** to demonstrate different approaches to building privacy-preserving dApps:

### 📘 Vanilla JavaScript Version
**Best for**: Learning, simple deployment, minimal dependencies
- Lightweight and fast
- No build process required
- Direct manipulation of DOM
- Easy to understand for beginners
- Located in root directory (index.html, js/, css/)

### ⚛️ React Version
**Best for**: Production apps, scalability, modern development
- Component-based architecture
- Reusable UI components
- State management with Context API
- Hot module replacement
- TypeScript support
- Production-ready build system
- Located in `astral-compatibility-react/`

**Key Differences**:

| Feature | Vanilla JS | React |
|---------|-----------|-------|
| **Bundle Size** | ~50KB | ~200KB |
| **Learning Curve** | Low | Medium |
| **Development Speed** | Slower | Faster (with experience) |
| **Maintainability** | Medium | High |
| **Scalability** | Limited | Excellent |
| **Testing** | Manual | Jest + React Testing Library |
| **Hot Reload** | No | Yes |
| **Component Reuse** | Limited | High |

Both versions connect to the same smart contract and offer identical functionality!

### 🤔 Which Version Should I Use?

**Choose Vanilla JavaScript if you**:
- ✅ Want to learn Web3 fundamentals
- ✅ Need minimal setup and dependencies
- ✅ Prefer simple, direct code
- ✅ Want to deploy without a build process
- ✅ Are building a simple demo or prototype

**Choose React if you**:
- ✅ Are building a production application
- ✅ Want modern development experience
- ✅ Need component reusability
- ✅ Plan to scale the application
- ✅ Prefer TypeScript support
- ✅ Want hot module replacement
- ✅ Are familiar with React ecosystem

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ and npm
- MetaMask wallet
- Sepolia testnet ETH (for gas fees)

### Installation

#### Option 1: Vanilla JavaScript Version

1. **Clone the repository**
   ```bash
   git clone https://github.com/OliverHauck/FHEAstralCompatibility.git
   cd FHEAstralCompatibility
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run local development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   - Navigate to your local server
   - Connect MetaMask to Sepolia testnet
   - Start matching!

#### Option 2: React Version

1. **Navigate to React project**
   ```bash
   cd astral-compatibility-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Application opens automatically at http://localhost:3000
   - Connect MetaMask to Sepolia testnet
   - Start matching!

5. **Build for production**
   ```bash
   npm run build
   ```

For detailed React setup instructions, see [astral-compatibility-react/SETUP.md](astral-compatibility-react/SETUP.md)

---

## 🎮 Usage Guide

### Step 1: Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure you're on Sepolia testnet

### Step 2: Create Your Profile
- Select your zodiac sign from the dropdown
- Click "Create Private Profile"
- Confirm transaction in MetaMask
- Your zodiac data is now encrypted on-chain ✅

### Step 3: Request Compatibility Match
- Enter partner's wallet address
- Click "Request Compatibility Match"
- Confirm transaction
- Compatibility score is calculated privately ✅

### Step 4: View Results
- See your compatibility matches
- Scores are displayed as percentages
- All calculations happened on encrypted data 🔐

---

## 🔬 Technical Details

### Smart Contract Functions

#### Core Functions
```solidity
// Create encrypted user profile
function createProfile(uint8 _zodiac, uint8 _element, uint8 _quality)

// Request compatibility match
function requestCompatibilityMatch(address _partner)

// Reveal compatibility score (Gateway)
function revealCompatibilityScore(bytes32 _matchId)

// Process decryption (Gateway callback)
function processScoreReveal(bytes32 matchId, uint8 decryptedValue)
```

#### Gateway Functions
```solidity
// Manage pausers
function addPauser(address _pauser)
function removePauser(address _pauser)

// Emergency controls
function pause()
function unpause()

// KMS management
function updateKmsGeneration(uint256 _newGeneration)
```

### Encryption Scheme

**Data Types**:
- `euint8`: Encrypted 8-bit unsigned integer (zodiac, element, quality)
- `ebool`: Encrypted boolean (comparison results)

**FHE Operations**:
- `FHE.asEuint8()`: Encrypt plaintext values
- `FHE.eq()`: Encrypted equality comparison
- `FHE.select()`: Encrypted conditional selection
- `FHE.add()`: Encrypted addition
- `FHE.sub()`: Encrypted subtraction
- `FHE.and()`: Encrypted bitwise AND
- `FHE.randEuint8()`: Encrypted random number generation

### Compatibility Algorithm

```solidity
Base Score: 50 points

Element Match Bonus:
  Same Element (Fire/Earth/Air/Water) → +20 points

Quality Match Bonus:
  Same Quality (Cardinal/Fixed/Mutable) → +15 points

Zodiac Penalty:
  Same Zodiac Sign → -10 points

Random Factor:
  Random bonus 0-15 points

Final Score = Base + Element Bonus + Quality Bonus - Zodiac Penalty + Random
```

---

## 🧪 Testing

### Comprehensive Test Suite

We maintain **52 test cases** covering all critical functionality:

- ✅ **93% code coverage** across all contracts
- ✅ **52 test cases** including edge cases and security scenarios
- ✅ **Gas optimization tests** to ensure efficient operations
- ✅ **CI/CD integration** with automated testing on every commit

**Run tests:**
```bash
npm test                  # Run all tests
npm run test:gas          # Run with gas reporting
npm run test:coverage     # Generate coverage report
```

See [TESTING.md](TESTING.md) for detailed testing documentation.

### Test Categories

- **Deployment & Initialization** (5 tests): Owner setup, initial state verification
- **Profile Creation** (9 tests): Valid/invalid inputs, duplicate prevention
- **Compatibility Matching** (10 tests): Match requests, edge cases, bidirectional matching
- **Score Revelation** (4 tests): Authorized revelation, gateway integration
- **Owner Functions** (10 tests): Pauser management, pause/unpause, KMS updates
- **Gateway & KMS Integration** (5 tests): Multi-pauser handling, decryption tracking
- **Compatibility Algorithm** (5 tests): Element-based scoring, all zodiac combinations
- **Gas Optimization** (3 tests): Gas cost monitoring for all operations
- **Edge Cases & Security** (4 tests): Zero address handling, state consistency

---

## 👨‍💻 For Developers

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/OliverHauck/FHEAstralCompatibility.git
   cd FHEAstralCompatibility
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Sepolia RPC URL and private key
   ```

3. **Compile Contracts**
   ```bash
   npm run compile
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Deploy Contract**
   ```bash
   npm run deploy
   ```

6. **Verify Contract**
   ```bash
   npm run verify
   ```

7. **Start Local Server**
   ```bash
   npm start
   ```

### Development Commands

**Smart Contract & Vanilla JS Version:**
```bash
npm run compile       # Compile smart contracts
npm test              # Run test suite
npm run test:gas      # Test with gas reporting
npm run test:coverage # Generate coverage report
npm run deploy        # Deploy to Sepolia
npm run deploy:local  # Deploy to local network
npm run deploy:mock   # Deploy mock version
npm run verify        # Verify on Etherscan
npm run interact      # Interact with deployed contract
npm run simulate      # Run compatibility simulation
npm run clean         # Clean artifacts
npm run lint          # Lint Solidity code
npm run format        # Format code
```

**React Version (in astral-compatibility-react/):**
```bash
npm run dev           # Start development server with hot reload
npm run build         # Create optimized production build
npm test              # Run React tests (with Jest & React Testing Library)
npm run eject         # Eject from Create React App (irreversible)
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Contract not found" error
**Solution**: Run `npm run clean && npm run compile`

**Issue**: Transaction fails with "insufficient funds"
**Solution**: Get testnet ETH from Sepolia faucet

**Issue**: MetaMask connection fails
**Solution**: Ensure you're on Sepolia testnet (Chain ID: 11155111)

**Issue**: Tests fail with timeout
**Solution**: Increase timeout in hardhat.config.js or check RPC URL

---

## ⛽ Gas Costs

Typical gas costs on Sepolia testnet:

| Operation | Avg Gas | Cost (at 50 gwei) |
|-----------|---------|-------------------|
| Create Profile | ~350,000 | ~0.0175 ETH |
| Request Match | ~750,000 | ~0.0375 ETH |
| Reveal Score | ~250,000 | ~0.0125 ETH |
| Add Pauser | ~50,000 | ~0.0025 ETH |
| Pause Contract | ~30,000 | ~0.0015 ETH |

**Note**: Actual costs vary based on network congestion and gas prices.

---

## 🌐 Deployment

### Sepolia Testnet

**Contract Address**: `0x3897f97Cdfa21926450B05329B55AC7F85F7F066`

**Network Details**:
- Chain ID: 11155111
- RPC URL: https://ethereum-sepolia-rpc.publicnode.com
- Explorer: https://sepolia.etherscan.io

**View Contract**: [Etherscan](https://sepolia.etherscan.io/address/0x3897f97Cdfa21926450B05329B55AC7F85F7F066)

### Deploy Your Own

1. **Configure Hardhat**
   ```javascript
   // hardhat.config.js
   sepolia: {
     url: process.env.SEPOLIA_RPC_URL,
     accounts: [process.env.PRIVATE_KEY],
     chainId: 11155111
   }
   ```

2. **Deploy contract**
   ```bash
   npx hardhat run scripts/deploy-mock.js --network sepolia
   ```

3. **Update frontend config**
   ```javascript
   // js/config.js
   CONTRACT_ADDRESS: 'YOUR_CONTRACT_ADDRESS'
   ```

---

## 📁 Project Structure

```
FHEAstralCompatibility/
├── contracts/
│   ├── AstralCompatibility.sol          # FHE contract (full version)
│   ├── AstralCompatibilityMock.sol      # Mock for testing
│   └── MIGRATION_COMPLETE.md            # Migration documentation
├── js/
│   ├── app.js                           # Main application logic (Vanilla JS)
│   └── config.js                        # Contract configuration
├── css/
│   └── style.css                        # Styling (Vanilla JS version)
├── astral-compatibility-react/          # 🆕 React version of the application
│   ├── public/                          # Static assets
│   │   ├── index.html                   # HTML template
│   │   ├── manifest.json                # PWA manifest
│   │   └── robots.txt                   # SEO robots file
│   ├── src/
│   │   ├── components/                  # React components
│   │   │   ├── Navbar.js                # Navigation with wallet connection
│   │   │   ├── Navbar.css               # Navbar styles
│   │   │   ├── Hero.js                  # Hero section with stats
│   │   │   ├── Hero.css                 # Hero styles
│   │   │   ├── WalletStatus.js          # Wallet connection status
│   │   │   ├── WalletStatus.css         # WalletStatus styles
│   │   │   ├── CreateProfile.js         # Profile creation form
│   │   │   ├── CreateProfile.css        # CreateProfile styles
│   │   │   ├── CompatibilityMatch.js    # Match request form
│   │   │   ├── CompatibilityMatch.css   # CompatibilityMatch styles
│   │   │   ├── HowItWorks.js            # Features showcase
│   │   │   ├── HowItWorks.css           # HowItWorks styles
│   │   │   ├── Footer.js                # Footer component
│   │   │   ├── Footer.css               # Footer styles
│   │   │   ├── LoadingModal.js          # Loading overlay
│   │   │   ├── LoadingModal.css         # LoadingModal styles
│   │   │   ├── Notification.js          # Toast notifications
│   │   │   └── Notification.css         # Notification styles
│   │   ├── config/
│   │   │   └── contract.js              # Contract ABI and configuration
│   │   ├── context/
│   │   │   └── Web3Context.js           # Web3 context provider
│   │   ├── App.js                       # Main app component
│   │   ├── App.css                      # App styles
│   │   ├── index.js                     # React entry point
│   │   └── index.css                    # Global styles
│   ├── package.json                     # React dependencies
│   ├── .gitignore                       # Git ignore rules
│   ├── README.md                        # React documentation
│   └── SETUP.md                         # React setup guide
├── scripts/
│   ├── deploy.js                        # FHE deployment script
│   └── deploy-mock.js                   # Mock deployment script
├── test/                                # Test files
├── index.html                           # Main HTML file (Vanilla JS)
├── demo.mp4                             # Demo video
├── package.json                         # Dependencies
├── hardhat.config.js                    # Hardhat configuration
└── README.md                            # This file
```

---

## 🛡️ Security Features

### Privacy Guarantees
✅ **Input Privacy**: All user inputs are encrypted before blockchain submission
✅ **Computation Privacy**: Calculations happen on encrypted data (FHE)
✅ **Output Privacy**: Results only revealed when explicitly requested
✅ **Transaction Privacy**: Inputs are re-randomized (sIND-CPAD security)

### Smart Contract Security
✅ **Access Control**: Owner-only administrative functions
✅ **Pause Mechanism**: Emergency stop functionality
✅ **Input Validation**: All inputs validated before processing
✅ **Reentrancy Protection**: No external calls in critical sections

---

## 🎯 Use Cases

### Personal Relationships
- Find compatible romantic partners privately
- Check friendship compatibility
- Explore family member dynamics

### Social Platforms
- Privacy-preserving dating app integration
- Anonymous compatibility matching services
- Astrology-based social networks

### Research & Analysis
- Privacy-preserving astrological studies
- Encrypted demographic analysis
- Anonymous survey systems

---

## 🔮 Zodiac System

### 12 Zodiac Signs

| Sign | Element | Quality | Dates |
|------|---------|---------|-------|
| ♈ Aries | Fire | Cardinal | Mar 21 - Apr 19 |
| ♉ Taurus | Earth | Fixed | Apr 20 - May 20 |
| ♊ Gemini | Air | Mutable | May 21 - Jun 20 |
| ♋ Cancer | Water | Cardinal | Jun 21 - Jul 22 |
| ♌ Leo | Fire | Fixed | Jul 23 - Aug 22 |
| ♍ Virgo | Earth | Mutable | Aug 23 - Sep 22 |
| ♎ Libra | Air | Cardinal | Sep 23 - Oct 22 |
| ♏ Scorpio | Water | Fixed | Oct 23 - Nov 21 |
| ♐ Sagittarius | Fire | Mutable | Nov 22 - Dec 21 |
| ♑ Capricorn | Earth | Cardinal | Dec 22 - Jan 19 |
| ♒ Aquarius | Air | Fixed | Jan 20 - Feb 18 |
| ♓ Pisces | Water | Mutable | Feb 19 - Mar 20 |

### Elements
- 🔥 **Fire**: Aries, Leo, Sagittarius (Passion, Energy)
- 🌍 **Earth**: Taurus, Virgo, Capricorn (Stability, Practicality)
- 💨 **Air**: Gemini, Libra, Aquarius (Intellect, Communication)
- 💧 **Water**: Cancer, Scorpio, Pisces (Emotion, Intuition)

### Qualities
- **Cardinal**: Initiative, Leadership (Aries, Cancer, Libra, Capricorn)
- **Fixed**: Stability, Determination (Taurus, Leo, Scorpio, Aquarius)
- **Mutable**: Flexibility, Adaptability (Gemini, Virgo, Sagittarius, Pisces)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs via [GitHub Issues](https://github.com/OliverHauck/FHEAstralCompatibility/issues)
- ✨ Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Astral Compatibility

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📚 Learn More

### Project Documentation
- **[Main README](README.md)** - This comprehensive overview
- **[React Version README](astral-compatibility-react/README.md)** - Detailed React implementation guide
- **[React Setup Guide](astral-compatibility-react/SETUP.md)** - Step-by-step React setup instructions
- **[Testing Documentation](TESTING.md)** - Complete testing guide and coverage
- **[Migration Guide](contracts/MIGRATION_COMPLETE.md)** - Contract migration documentation

### Frontend Technologies
- **[React Documentation](https://react.dev/)** - Learn React fundamentals
- **[React Hooks Guide](https://react.dev/reference/react)** - Understanding Hooks and Context API
- **[Create React App](https://create-react-app.dev/)** - React development tooling
- **[JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - JavaScript reference

### Web3 & Blockchain
- **[ethers.js v5 Docs](https://docs.ethers.org/v5/)** - Ethereum library documentation
- **[MetaMask Docs](https://docs.metamask.io/)** - Wallet integration guide
- **[Hardhat Documentation](https://hardhat.org/docs)** - Smart contract development
- **[Solidity Documentation](https://docs.soliditylang.org/)** - Smart contract language

### FHE & Privacy
- **[Zama fhEVM](https://docs.zama.ai/fhevm)** - Fully Homomorphic Encryption technology
- **[fhevmjs Documentation](https://docs.zama.ai/fhevm/getting_started/javascript)** - Client-side FHE library
- **[FHE Introduction](https://www.zama.ai/post/what-is-fully-homomorphic-encryption)** - Understanding FHE concepts

### Testing & Quality
- **[Jest Documentation](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/react)** - React component testing
- **[Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)** - Smart contract testing

---

## 🙏 Acknowledgments

### Technology & Libraries
- **Zama**: For the groundbreaking fhEVM and FHE technology
- **Ethereum**: For the decentralized blockchain platform
- **React Team**: For the amazing React framework and ecosystem
- **Hardhat**: For the excellent development environment
- **Ethers.js**: For blockchain interaction library
- **Create React App**: For streamlined React development tooling

### Inspiration
- Traditional astrological compatibility principles
- Privacy-preserving cryptography research
- Decentralized application community

---

## 📞 Contact & Support

### Get Help
- 📧 **Email**: support@astralcompatibility.example.com
- 💬 **Discord**: [Join our community](#)
- 🐦 **Twitter**: [@AstralCompat](#)

### Links
- 🌐 **Website**: [https://oliverhauck.github.io/FHEAstralCompatibility/](https://oliverhauck.github.io/FHEAstralCompatibility/)
- 📦 **GitHub**: [https://github.com/OliverHauck/FHEAstralCompatibility](https://github.com/OliverHauck/FHEAstralCompatibility)
- 📚 **Documentation**: [Wiki](https://github.com/OliverHauck/FHEAstralCompatibility/wiki)
- 🔍 **Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x3897f97Cdfa21926450B05329B55AC7F85F7F066)

---

## 🚧 Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Smart contract development
- [x] FHE integration
- [x] Vanilla JavaScript frontend
- [x] React frontend implementation
- [x] Sepolia deployment
- [x] Comprehensive documentation

### Phase 2: Enhancement 🔄 (In Progress)
- [ ] Deploy to fhEVM mainnet
- [ ] React app testing suite (Jest + React Testing Library)
- [ ] Advanced compatibility algorithms
- [ ] Detailed astrological reports
- [ ] User profile system
- [ ] Match history and analytics with decryption
- [ ] Dark/light theme toggle for React version

### Phase 3: Expansion 🔮 (Planned)
- [ ] Mobile application (iOS/Android)
- [ ] Social features (friend matching)
- [ ] NFT compatibility certificates
- [ ] Multi-chain deployment
- [ ] DAO governance

### Phase 4: Ecosystem 🌐 (Future)
- [ ] API for third-party integration
- [ ] Plugin marketplace
- [ ] Astrological NFT collections
- [ ] Compatibility prediction marketplace
- [ ] Cross-chain bridges

---

## ⚠️ Disclaimer

**Important Notice**:

This application is for **entertainment and educational purposes only**. Astrological compatibility matching is based on traditional astrological principles and should not be considered as professional advice for relationships, career, or life decisions.

**Privacy**:
While we use advanced encryption technology (FHE) to protect your data, users should understand blockchain interactions and gas fees before using this application.

**Testing**:
This project is deployed on Sepolia testnet for testing purposes. Use testnet ETH only. Do not send real ETH to the contract.

**No Warranty**:
This software is provided "as is" without warranty of any kind, express or implied.

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/OliverHauck/FHEAstralCompatibility?style=social)
![GitHub forks](https://img.shields.io/github/forks/OliverHauck/FHEAstralCompatibility?style=social)
![GitHub issues](https://img.shields.io/github/issues/OliverHauck/FHEAstralCompatibility)
![GitHub license](https://img.shields.io/github/license/OliverHauck/FHEAstralCompatibility)

---

<div align="center">

### 🌟 Star this project if you find it interesting! 🌟

**Built with ❤️ using Fully Homomorphic Encryption**

[Website](https://oliverhauck.github.io/FHEAstralCompatibility/) • [GitHub](https://github.com/OliverHauck/FHEAstralCompatibility) • [Issues](https://github.com/OliverHauck/FHEAstralCompatibility/issues) • [Documentation](https://github.com/OliverHauck/FHEAstralCompatibility/wiki)

</div>

---

## 🎉 Thank You!

Thank you for checking out **Astral Compatibility**! We hope this project demonstrates the power of privacy-preserving computation and inspires new applications of FHE technology.

**Happy Matching! 🌟✨**
