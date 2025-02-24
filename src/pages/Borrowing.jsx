import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { ethers } from 'ethers';
import { useWallet } from '../wallet.jsx';

// Use Vite’s environment variable syntax
const contractAddress = import.meta.env.VITE_MICRO_LOAN_ADDRESS || "0xc7e393878c1f05040b54afa172d00d73b0db412e";

// Minimal ABI for the functions we need (requestLoan and events)
const contractAbi = [
  "function requestLoan(tuple(uint256 amount, uint256 interest, uint256 duration, uint256 collateralAmount, address collateralToken)) external",
  "event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 collateralAmount)"
];

const Borrowing = () => {
  const { signer, account } = useWallet();
  const [isConnected, setIsConnected] = useState(!!account);
  const [walletLoading, setWalletLoading] = useState(false);
  
  const [loanAmount, setLoanAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [interestRate, setInterestRate] = useState('5');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [loanRequests, setLoanRequests] = useState([]);

  const calculateTotalRepayment = () => {
    if (!loanAmount || !interestRate || !duration) return null;
    const principal = parseFloat(loanAmount);
    const interest = (principal * parseFloat(interestRate) * parseInt(duration)) / (365 * 100);
    return (principal + interest).toFixed(4);
  };

  const connectWallet = async () => {
    setWalletLoading(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        setStatus('Please install MetaMask to continue');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      setStatus('Wallet connected successfully');
      setIsConnected(true);
    } catch (error) {
      if (error.code === 4001) {
        setStatus('Please approve the MetaMask connection');
      } else {
        setStatus('Failed to connect wallet: ' + error.message);
      }
    } finally {
      setWalletLoading(false);
    }
  };

  const applyForLoan = async () => {
    if (!isConnected || !signer) {
      setStatus("Please connect MetaMask!");
      return;
    }
    try {
      setLoading(true);
      setStatus("Submitting loan request on-chain...");
      
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      // Convert amounts to proper units (assumes ETH for amounts)
      const parsedLoanAmount = ethers.parseEther(loanAmount);
      const parsedCollateral = ethers.parseEther(collateralAmount);
      // Convert duration from days to seconds
      const durationSeconds = parseInt(duration) * 86400;
      const interest = parseInt(interestRate);

      const loanRequest = {
        amount: parsedLoanAmount,
        interest: interest,
        duration: durationSeconds,
        collateralAmount: parsedCollateral,
        // Placeholder collateral token address
        collateralToken: "0x0000000000000000000000000000000000000000"
      };

      const tx = await contract.requestLoan(loanRequest);
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("Loan requested successfully on-chain!");

      const newLoan = {
        id: Date.now(), // local id for UI purposes
        amount: loanAmount,
        collateral: collateralAmount,
        duration: duration,
        interestRate: interestRate,
        totalRepayment: calculateTotalRepayment(),
        status: 'REQUESTED',
        timestamp: new Date().toLocaleString(),
      };

      setLoanRequests(prev => [newLoan, ...prev]);
      setLoanAmount('');
      setCollateralAmount('');
      setDuration('30');
      setInterestRate('5');
    } catch (error) {
      console.error(error);
      setStatus("Error requesting loan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Borrowing</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border border-blue-500">
          <CardHeader>
            <CardTitle className="text-white">Request a Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Loan Amount (ETH)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  disabled={!isConnected}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Collateral Amount (ETH)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  disabled={!isConnected}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Loan Duration (Days)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={duration}
                  onChange={(e) => {
                    const value = Math.max(2, parseInt(e.target.value) || 2);
                    setDuration(value.toString());
                  }}
                  disabled={!isConnected}
                  min="2"
                  max="365"
                />
                <p className="text-gray-400 text-sm mt-1">Minimum duration: 2 days</p>
              </div>
              <div>
                <label className="block text-white mb-2">Interest Rate (% APR)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={interestRate}
                  onChange={(e) => {
                    const value = Math.max(2, parseFloat(e.target.value) || 2);
                    setInterestRate(value.toString());
                  }}
                  disabled={!isConnected}
                  min="2"
                  max="100"
                  step="0.1"
                />
                <p className="text-gray-400 text-sm mt-1">Minimum interest rate: 2% APR</p>
              </div>
              <div>
                <label className="block text-white mb-2">NFT Address</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!isConnected}
                  placeholder="Coming Soon"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Token ID</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!isConnected}
                  placeholder="Coming Soon"
                />
              </div>
              {calculateTotalRepayment() && (
                <div className="p-3 bg-gray-700 rounded">
                  <p className="text-white">
                    Total Repayment Amount: {calculateTotalRepayment()} ETH
                  </p>
                  <p className="text-gray-400 text-sm">
                    (Including {((parseFloat(interestRate) * parseInt(duration)) / 365).toFixed(2)}% interest for {duration} days)
                  </p>
                </div>
              )}
              {isConnected ? (
                <div className="space-y-4">
                  <p className="text-white">Connected Account: {account}</p>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={applyForLoan}
                    disabled={loading || !loanAmount || !collateralAmount || !duration || !interestRate}
                  >
                    {loading ? "Processing..." : "Request Loan"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={walletLoading}
                >
                  {walletLoading ? "Connecting..." : "Connect MetaMask"}
                </button>
              )}
              {status && (
                <p className="text-white p-3 rounded bg-gray-700">
                  {status}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border border-blue-500">
          <CardHeader>
            <CardTitle className="text-white">My Loan Requests (Local View)</CardTitle>
          </CardHeader>
          <CardContent>
            {loanRequests.length === 0 ? (
              <p className="text-gray-400">No loan requests yet</p>
            ) : (
              <div className="space-y-4">
                {loanRequests.map((loan) => (
                  <div key={loan.id} className="p-4 bg-gray-700 rounded">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-400">Amount:</p>
                      <p className="text-white">{loan.amount} ETH</p>
                      <p className="text-gray-400">Collateral:</p>
                      <p className="text-white">{loan.collateral} ETH</p>
                      <p className="text-gray-400">Duration:</p>
                      <p className="text-white">{loan.duration} days</p>
                      <p className="text-gray-400">Interest Rate:</p>
                      <p className="text-white">{loan.interestRate}% APR</p>
                      <p className="text-gray-400">Total Repayment:</p>
                      <p className="text-white">{loan.totalRepayment} ETH</p>
                      <p className="text-gray-400">Status:</p>
                      <p className="text-white">{loan.status}</p>
                      <p className="text-gray-400">Requested:</p>
                      <p className="text-white">{loan.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Borrowing;
