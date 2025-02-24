// About.jsx
import React, { useEffect } from 'react';
import { Coins, Lock, Zap } from 'lucide-react';

const About = () => {
  
  useEffect(() => {
    // Custom cursor effect
    const cursor = document.createElement("div");
    cursor.id = "custom-pointer";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Revolutionizing Microfinance with Blockchain</h1>
      
      {/* Process Section */}
      <div className="bg-gray-800 border border-blue-400 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Our Blockchain Approach</h2>
        <div className="space-y-6 text-gray-300">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-blue-200">Peer-to-Peer Lending Protocol</h3>
            <p>Built on Ethereum and Polygon networks, our smart contract system enables direct transactions between participants. By eliminating third-party involvement, we create a seamless lending experience where terms are automatically enforced through blockchain code.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-blue-200">Asset-Backed Financing</h3>
            <p>Users secure loans through digital asset collateralization. Our automated contracts manage the entire lifecycle of each agreement, providing real-time monitoring of collateral ratios and instant liquidation protection for lenders.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-blue-200">Transparent Operations</h3>
            <p>Every transaction is permanently recorded on-chain, creating an auditable history that's resistant to modification. Our contract code undergoes continuous security analysis to maintain the highest protection standards for user assets.</p>
          </div>
        </div>
      </div>

      {/* Advantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-blue-400 rounded-xl p-6 hover:border-blue-300 transition-colors">
          <div className="bg-blue-400/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Coins className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-blue-200 mb-2">Fair Market Pricing</h3>
          <p className="text-gray-300">Our decentralized model ensures competitive rates through open market dynamics, benefiting both liquidity providers and borrowers.</p>
        </div>

        <div className="bg-gray-800 border border-blue-400 rounded-xl p-6 hover:border-blue-300 transition-colors">
          <div className="bg-blue-400/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Lock className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-blue-200 mb-2">Automated Protection</h3>
          <p className="text-gray-300">Advanced smart contracts with multi-layered security protocols safeguard all transactions, ensuring capital protection without centralized control.</p>
        </div>

        <div className="bg-gray-800 border border-blue-400 rounded-xl p-6 hover:border-blue-300 transition-colors">
          <div className="bg-blue-400/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Zap className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-blue-200 mb-2">Real-Time Execution</h3>
          <p className="text-gray-300">Blockchain-powered processing enables near-instant settlement, dramatically reducing wait times compared to conventional financial systems.</p>
        </div>
      </div>

      <style jsx global>{`
        #custom-pointer {
          position: fixed;
          width: 18px;
          height: 18px;
          background: rgb(40, 34, 197);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: transform 0.15s ease, opacity 0.2s;
          mix-blend-mode: exclusion;
        }

        button:hover ~ #custom-pointer,
        a:hover ~ #custom-pointer {
          transform: scale(1.8) translate(-25%, -25%);
          opacity: 0.7;
        }

        body, a, button {
          cursor: none;
        }
      `}</style>
    </div>
  );
};

export default About;