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

