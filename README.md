# MicroLoan - A Decentralized Micro-Loaning Platform

MicroLoan is a cutting-edge decentralized micro-loaning platform built on Ethereum. It empowers users to request and fund loans directly on-chain without intermediaries. The platform leverages smart contracts for secure and automated loan lifecycle management while providing an engaging, modern React-based user interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

MicroLoan transforms the microfinance space by enabling:
- **On-chain loan requests:** Borrowers can submit loan requests via blockchain transactions.
- **Decentralized lending:** Lenders can browse open loan requests and fund them directly on-chain.
- **Secure collateralization:** Digital assets serve as collateral, ensuring a secure lending environment.

---

## Features

- **Blockchain-Powered Loans:** Leverages Ethereum smart contracts to manage every stage of the loan lifecycle (Requested, Funded, Repaid, Defaulted, Cancelled).
- **Peer-to-Peer Lending:** Eliminates intermediaries for a seamless, decentralized experience.
- **Dynamic Dashboard:** Real-time display of open loan requests and personal loan history.
- **Wallet Integration:** Easy MetaMask connectivity with a robust wallet context for account management.
- **Modern UI/UX:** Built with React, Vite, and Tailwind CSS, featuring dynamic animations (like GeometricWeb) for an engaging user experience.

---

## Architecture

- **Smart Contract (`p2p.sol`):**  
  - Manages loan requests, funding, repayments, defaults, and cancellations.
  - Includes helper functions like `getOpenLoanIds` for fetching unsettled loans.
  - Implements strict checks (e.g., "Can't self fund") to enforce proper user roles.
  
- **Frontend (React):**  
  - **Borrowing Page:** Allows users to create on-chain loan requests.
  - **Lending Dashboard:** Lists open loan requests and enables lenders to fund loans.
  - **Dashboard & Auth Pages:** Provide an overview of user activity and wallet authentication.
  - **About Page:** Details the platform's decentralized approach and benefits.
  
- **Wallet Context (`wallet.jsx`):**  
  - Manages connection to MetaMask, account switching, and network changes.
  
- **Visual Effects:**  
  - The `GeometricWeb.jsx` component creates an animated canvas background for a modern, dynamic interface.

---

## Technologies

- **Blockchain:** Ethereum, Solidity, ethers.js (v6)
- **Frontend:** React, Vite, Tailwind CSS, lucide-react icons
- **Wallet Integration:** MetaMask
- **Development Tools:** Vite, Node.js, npm

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **MetaMask** browser extension

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/microloan.git
   cd microloan
   ```

Install Dependencies:

npm install

Configure Environment Variables:

Create a .env file in the project root and add your deployed contract address:

    VITE_MICRO_LOAN_ADDRESS=0xYourDeployedContractAddress

Running the Project

Start the development server with:
```bash

npm run dev
```
Then open your browser at http://localhost:5173 (or the URL provided by Vite).

Smart Contract Deployment

    Compile the Contract: Use your preferred Solidity development tool (e.g., Hardhat or Remix) to compile p2p.sol.

    Deploy the Contract: Deploy the contract to your desired Ethereum network (e.g., a testnet like Rinkeby or Polygon).

    Update Environment Variables: Replace the placeholder in your .env file with the deployed contract address.

Usage

    Borrowing:
    Connect your wallet and submit a loan request on the Borrowing page. The transaction will call the requestLoan function on-chain.

    Lending:
    Using a different account (lender), navigate to the Lending Dashboard. Here, open loans are fetched from the blockchain. Approve and fund loans by calling the fundLoan function.

    Dashboard:
    Monitor your active loans and view the status of each transaction.

    About & Auth:
    Learn more about the platform’s decentralized architecture and test wallet connectivity.
