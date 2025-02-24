import React, { useState, useEffect } from 'react';
import { Clock, Wallet, User, TrendingUp } from 'lucide-react';
import { ethers } from 'ethers';
import { useWallet } from '../wallet.jsx';

// Custom Card Components
const Card = ({ className, children, onClick }) => (
  <div 
    className={`rounded-lg shadow-lg overflow-hidden ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-lg ${className}`}>
    {children}
  </div>
);

// Use Vite’s environment variable syntax
const contractAddress = import.meta.env.VITE_MICRO_LOAN_ADDRESS || "0xc7e393878c1f05040b54afa172d00d73b0db412e";
const contractAbi = [
  "function getOpenLoanIds() external view returns (uint256[])",
  "function loans(uint256) external view returns (address borrower, address lender, uint256 amount, uint256 interest, uint256 duration, uint256 startTime, uint256 collateralAmount, address collateralToken, uint8 status)",
  "function fundLoan(uint256 loanId) external payable"
];

const LendingDashboard = () => {
  const { provider, account, signer } = useWallet();
  const [isConnected, setIsConnected] = useState(!!account);
  const [walletLoading, setWalletLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [processing, setProcessing] = useState(false);
  const [openLoans, setOpenLoans] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const fetchOpenLoans = async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const openLoanIds = await contract.getOpenLoanIds();
      const loans = await Promise.all(
        openLoanIds.map(async (id) => {
          const loan = await contract.loans(id);
          return {
            id: Number(id),
            borrower: loan.borrower,
            loanAmount: ethers.formatEther(loan.amount),
            collateralAmount: ethers.formatEther(loan.collateralAmount),
            interestRate: loan.interest.toString(),
            duration: (Number(loan.duration) / 86400).toString(),
            timestamp: Number(loan.startTime)
              ? new Date(Number(loan.startTime) * 1000).toLocaleString()
              : "N/A",
            status: ["REQUESTED", "FUNDED", "REPAID", "DEFAULTED", "CANCELLED"][Number(loan.status)]
          };
        })
      );
      setOpenLoans(loans);
    } catch (error) {
      console.error("Error fetching open loans:", error);
      setStatus("Error fetching loans: " + error.message);
    }
  };

  useEffect(() => {
    if (provider) {
      fetchOpenLoans();
    }
  }, [provider]);

  const approveLoan = async (request) => {
    if (!signer) {
      setStatus('Please connect your wallet first');
      return;
    }
    setProcessing(true);
    setStatus('Processing loan approval...');
    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const tx = await contract.fundLoan(request.id, {
        value: ethers.parseEther(request.loanAmount)
      });
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("Loan approved and funded!");
      fetchOpenLoans();
      setSelectedRequest(null);
    } catch (error) {
      if (error.code === 4001) {
        setStatus('Transaction rejected by user');
      } else {
        setStatus('Error approving loan: ' + error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotalRepayment = (amount, rate, duration) => {
    const interest = (amount * rate * duration) / (365 * 100);
    return (amount + interest).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Lending Dashboard</h1>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={walletLoading}
            >
              {walletLoading ? "Connecting..." : "Connect MetaMask"}
            </button>
          ) : (
            <div className="text-white bg-gray-800 px-4 py-2 rounded">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </header>
        {status && (
          <Alert className="mb-6 bg-gray-800 text-white border border-blue-500">
            {status}
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openLoans.length === 0 ? (
            <p className="text-gray-400">No open loan requests at the moment.</p>
          ) : (
            openLoans.map((request) => (
              <Card 
                key={request.id} 
                className={`bg-gray-800 border ${
                  selectedRequest?.id === request.id 
                    ? 'border-blue-500' 
                    : 'border-gray-700'
                } cursor-pointer hover:border-blue-400 transition-colors`}
                onClick={() => setSelectedRequest(request)}
              >
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-center">
                    <span>{request.loanAmount} ETH</span>
                    <span className="text-sm text-gray-400">{request.timestamp}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <User className="w-4 h-4 mr-2" />
                      <span>Borrower: {request.borrower.slice(0, 6)}...{request.borrower.slice(-4)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Wallet className="w-4 h-4 mr-2" />
                      <span>Collateral: {request.collateralAmount} ETH</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Duration: {request.duration} days</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Interest: {request.interestRate}% APR</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-blue-400">
                        Total Repayment: {calculateTotalRepayment(
                          parseFloat(request.loanAmount),
                          parseFloat(request.interestRate),
                          parseFloat(request.duration)
                        )} ETH
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="bg-gray-800 border border-blue-500 w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-white">Approve Loan Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-300">
                  <p>Loan Amount: {selectedRequest.loanAmount} ETH</p>
                  <p>Collateral: {selectedRequest.collateralAmount} ETH</p>
                  <p>Duration: {selectedRequest.duration} days</p>
                  <p>Interest Rate: {selectedRequest.interestRate}% APR</p>
                  <p>Total Repayment: {calculateTotalRepayment(
                    parseFloat(selectedRequest.loanAmount),
                    parseFloat(selectedRequest.interestRate),
                    parseFloat(selectedRequest.duration)
                  )} ETH</p>
                  <div className="flex gap-4 mt-6">
                    <button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                      onClick={() => approveLoan(selectedRequest)}
                      disabled={processing || !isConnected}
                    >
                      {processing ? "Processing..." : "Approve & Fund Loan"}
                    </button>
                    <button
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                      onClick={() => setSelectedRequest(null)}
                      disabled={processing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LendingDashboard;
