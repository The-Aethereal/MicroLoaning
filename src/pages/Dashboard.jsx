import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Banknote, Clock, Lock, Coins, BarChart, ScrollText } from 'lucide-react';

const MicroLoanDashboard = () => {
  // Sample data with actual values
  const dashboardData = {
    totalLoans: '1',
    activeLoans: '1',
    totalValueLocked: '2',
    platformFees: '0.05'
  };

  const userMetrics = {
    borrowedAmount: '2',
    lentAmount: '0',
    totalCollateral: '4'
  };

  const loanHistory = [
    { 
      id: '1', 
      amount: '2', 
      interest: '2.5', 
      collateralAmount: '4', 
      status: 'FUNDED', 
      isBorrower: true 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-center mb-10">
          Microloan Overview
        </h1>
        
        {/* Platform Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard 
            title="Total Agreements"
            value={dashboardData.totalLoans}
            icon={<Banknote className="w-6 h-6" />}
            color="indigo"
          />
          <MetricCard 
            title="Active Contracts"
            value={dashboardData.activeLoans}
            icon={<Clock className="w-6 h-6" />}
            color="cyan"
          />
          <MetricCard 
            title="Value Secured"
            value={`${dashboardData.totalValueLocked} ETH`}
            icon={<Lock className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard 
            title="Service Fee"
            value={`${dashboardData.platformFees}%`}
            icon={<Coins className="w-6 h-6" />}
            color="emerald"
          />
        </div>

        {/* User Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <MetricCard 
            title="My Credit Position"
            value={`${userMetrics.borrowedAmount} ETH`}
            icon={<BarChart className="w-6 h-6" />}
            color="amber"
            variant="secondary"
          />
          <MetricCard 
            title="My Liquidity"
            value={`${userMetrics.lentAmount} ETH`}
            icon={<Coins className="w-6 h-6" />}
            color="sky"
            variant="secondary"
          />
          <MetricCard 
            title="Collateral Held"
            value={`${userMetrics.totalCollateral} ETH`}
            icon={<Lock className="w-6 h-6" />}
            color="violet"
            variant="secondary"
          />
        </div>

        {/* Contract History Table */}
        <Card className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 transition-colors">
          <CardHeader className="border-b border-gray-700">
            <div className="flex items-center gap-3">
              <ScrollText className="w-6 h-6 text-cyan-400" />
              <CardTitle className="text-cyan-400">Agreement History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <HeaderCell>Contract ID</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Rate</HeaderCell>
                    <HeaderCell>Collateral</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell>Position</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {loanHistory.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-900/30 transition-colors">
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.amount} ETH</TableCell>
                      <TableCell>{loan.interest}%</TableCell>
                      <TableCell>{loan.collateralAmount} ETH</TableCell>
                      <TableCell>
                        <StatusBadge status={loan.status} />
                      </TableCell>
                      <TableCell>
                        <RolePill isBorrower={loan.isBorrower} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, variant = 'primary' }) => {
  const colors = {
    indigo: 'from-indigo-600 to-indigo-400',
    cyan: 'from-cyan-600 to-cyan-400',
    purple: 'from-purple-600 to-purple-400',
    emerald: 'from-emerald-600 to-emerald-400',
    amber: 'from-amber-600 to-amber-400',
    sky: 'from-sky-600 to-sky-400',
    violet: 'from-violet-600 to-violet-400',
  };

  return (
    <Card className={`group relative overflow-hidden ${
      variant === 'primary' 
        ? 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30'
        : 'bg-gray-900/30 border border-gray-800 hover:border-cyan-500/20'
    } transition-colors`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5 text-white' })}
          </div>
          <CardTitle className="text-gray-300 text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-semibold bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

const HeaderCell = ({ children }) => (
  <th className="px-4 py-3 text-left text-sm font-medium text-cyan-400">
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-4 py-3 text-sm text-gray-300">{children}</td>
);

const StatusBadge = ({ status }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
    {status}
  </span>
);

const RolePill = ({ isBorrower }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400">
    {isBorrower ? 'Borrower' : 'Lender'}
  </span>
);

export default MicroLoanDashboard;