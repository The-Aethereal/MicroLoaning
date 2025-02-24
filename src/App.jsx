import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Borrowing from './pages/Borrowing.jsx';
import About from './pages/About.jsx';
import Lending from './pages/Lending.jsx';
import AuthSign from './pages/AuthSign.jsx';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './wallet.jsx'; 
const App = () => {
  const { setProvider, setSigner, setAccount } = useWallet(); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Error connecting to MetaMask", err);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [setAccount]);

  return (
    <WalletProvider>
      <Router>
        <Navbar connectWallet={connectWallet} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/borrowing" element={<Borrowing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/authsign" element={<AuthSign />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
};

export default App;
