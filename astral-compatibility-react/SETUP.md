# 🚀 Setup Guide - Astral Compatibility React

This guide will help you set up and run the Astral Compatibility React application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** 7.x or higher (comes with Node.js)
- **MetaMask** browser extension ([Install](https://metamask.io/download/))
- **Sepolia testnet ETH** (get from [Sepolia Faucet](https://sepoliafaucet.com/))

## 🔧 Installation Steps

### 1. Navigate to Project Directory

```bash
cd D:\fhevm-react-template\examples\astral-compatibility-react
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- react & react-dom (^18.3.0)
- react-scripts (^5.0.1)
- ethers (^5.7.2)
- fhevmjs (^0.5.0)
- And development dependencies

### 3. Verify Installation

Check that all packages are installed correctly:

```bash
npm list --depth=0
```

You should see all the packages listed in package.json.

## 🎮 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will open automatically at:
```
http://localhost:3000
```

Features in development mode:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh for React components
- ✅ Source maps for debugging
- ✅ Error overlay in browser

### Production Build

Create an optimized production build:

```bash
npm run build
```

This creates a `build/` folder with:
- Minified JavaScript bundles
- Optimized CSS files
- Compressed assets
- Service worker (optional)

### Serve Production Build Locally

To test the production build locally:

```bash
# Install serve globally (if not already installed)
npm install -g serve

# Serve the build folder
serve -s build -p 3000
```

## 🔐 MetaMask Configuration

### 1. Install MetaMask

If you haven't already, install the MetaMask browser extension:
- [Chrome/Brave](https://chrome.google.com/webstore/detail/metamask/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/metamask/)

### 2. Add Sepolia Network

The app will automatically prompt you to switch to Sepolia network. If not, add it manually:

**Network Details:**
- Network Name: `Sepolia Test Network`
- RPC URL: `https://ethereum-sepolia-rpc.publicnode.com`
- Chain ID: `11155111`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia.etherscan.io`

### 3. Get Test ETH

Get free Sepolia testnet ETH from faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

You'll need a small amount of ETH for:
- Creating profile (~0.001 ETH)
- Requesting matches (~0.001 ETH)
- Updating profile (~0.001 ETH)

## 📱 Using the Application

### 1. Connect Wallet

Click the **"Connect Wallet"** button in the navigation bar to connect your MetaMask wallet.

### 2. Create Profile

Navigate to **"Create Profile"** section:
1. Select your zodiac sign from the dropdown
2. Review the element and quality information
3. Click **"Create Private Profile"**
4. Confirm the transaction in MetaMask
5. Wait for blockchain confirmation

Your zodiac data is now encrypted and stored on-chain!

### 3. Request Compatibility Match

Navigate to **"Matches"** section:
1. Enter your partner's wallet address
2. Click **"Request Compatibility Match"**
3. Confirm the transaction in MetaMask
4. Wait for the compatibility calculation

The compatibility score is calculated on encrypted data without revealing zodiac signs!

### 4. View Results

Match results will appear in the "Your Compatibility Matches" section once calculations are complete.

## 🛠️ Development Tools

### Available Scripts

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Run tests
npm test

# Eject from Create React App (⚠️ irreversible)
npm run eject
```

### Project Structure

```
astral-compatibility-react/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots
├── src/
│   ├── components/        # React components
│   ├── config/           # Contract config & ABI
│   ├── context/          # Web3 context provider
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
└── package.json          # Dependencies
```

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```env
REACT_APP_CONTRACT_ADDRESS=0x3897f97Cdfa21926450B05329B55AC7F85F7F066
REACT_APP_CHAIN_ID=11155111
REACT_APP_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

## 🐛 Troubleshooting

### MetaMask Connection Issues

**Problem:** MetaMask not connecting

**Solution:**
1. Refresh the page
2. Unlock MetaMask
3. Switch to Sepolia network manually
4. Try connecting again

### Transaction Failures

**Problem:** Transaction failing or reverting

**Solutions:**
1. Ensure you have enough Sepolia ETH
2. Check gas price is not too low
3. Verify you're on Sepolia network (Chain ID: 11155111)
4. Try increasing gas limit manually in MetaMask

### Build Errors

**Problem:** `npm install` or `npm run build` fails

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Use legacy peer deps if needed
npm install --legacy-peer-deps
```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

## 📚 Additional Resources

### Documentation
- [Main README](../../README.md) - Project overview
- [React README](./README.md) - Detailed React documentation
- [Smart Contract](../FHEAstralCompatibility/contracts/AstralCompatibility.sol)

### External Resources
- [React Documentation](https://react.dev/)
- [ethers.js v5 Docs](https://docs.ethers.org/v5/)
- [Zama fhEVM Docs](https://docs.zama.ai/fhevm)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🎯 Next Steps

After setup, you can:

1. **Explore the Code** - Review component architecture and Web3 integration
2. **Create Profiles** - Test the encrypted profile creation
3. **Request Matches** - Try compatibility matching with friends
4. **Customize UI** - Modify styles and components
5. **Deploy** - Build and deploy to production

## 💡 Tips

- **Gas Optimization**: Batch multiple operations when possible
- **Error Handling**: Always check transaction status before showing success
- **State Management**: Use Context API for global state
- **Testing**: Test with different wallets and network conditions
- **Security**: Never commit private keys or sensitive data

## 🤝 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Main README](../../README.md)
3. Open an issue on GitHub
4. Join the Zama Discord community

---

**Happy Building! 🚀✨**

Built with ❤️ using React and FHE technology
