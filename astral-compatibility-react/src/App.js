import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WalletStatus from './components/WalletStatus';
import CreateProfile from './components/CreateProfile';
import CompatibilityMatch from './components/CompatibilityMatch';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoadingModal from './components/LoadingModal';
import Notification from './components/Notification';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Navbar />
        <Hero />
        <WalletStatus />
        <CreateProfile />
        <CompatibilityMatch />
        <HowItWorks />
        <Footer />
        <LoadingModal />
        <Notification />
      </div>
    </Web3Provider>
  );
}

export default App;
