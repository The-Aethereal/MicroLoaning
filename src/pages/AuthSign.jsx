import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react'; // Keep original icon import
import GeometricWeb from '../components/GeometricWeb.jsx';

const AuthSign = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Wallet connection logic (keep original implementation)
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) setWalletAddress(storedAddress);

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      } else {
        setWalletAddress('');
        localStorage.removeItem('walletAddress');
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    localStorage.removeItem('walletAddress');
  };

  // Cursor effect (compatible with other components)
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.id = "auth-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
    };

    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="fixed inset-0 bg-black" />
      <GeometricWeb />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/90 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-lg">
          <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-300">
            <h1 className="text-5xl font-bold text-emerald-400 text-center animate-pulse-slow">
              f!nesse
            </h1>
            <p className="text-gray-400 text-center mt-2 animate-fade-in">
              Decentralized Lending Platform
            </p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-200 animate-fade-in">
              Platform Access
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              {walletAddress ? 'Wallet Connected' : 'Connect your wallet to continue'}
            </p>
          </div>

          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-lg disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <Wallet className={`h-5 w-5 ${isConnecting ? 'animate-spin' : ''}`} />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <>
              <button
                onClick={disconnectWallet}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              >
                Disconnect Wallet
              </button>

              <div className="text-emerald-400 text-sm text-center mt-4 truncate">
                Connected Address: {walletAddress}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        #auth-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          background:rgb(40, 34, 197, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out;
          mix-blend-mode: exclusion;
        }

        button:hover ~ #auth-cursor {
          transform: scale(1.5);
        }

        body, a, button {
          cursor: none;
        }
      `}</style>
    </div>
  );
};

export default AuthSign;