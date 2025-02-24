    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    contract MicroLoan {
        enum LoanStatus { REQUESTED, FUNDED, REPAID, DEFAULTED, CANCELLED }

        struct LoanRequest {
            uint256 amount;
            uint256 interest;
            uint256 duration;
            uint256 collateralAmount;
            address collateralToken;
        }

        struct Loan {
            address borrower;
            address lender;
            uint256 amount;
            uint256 interest;
            uint256 duration;
            uint256 startTime;
            uint256 collateralAmount;
            address collateralToken;
            LoanStatus status;
        }

        uint256 public loanCounter;
        uint256 public constant PLATFORM_FEE = 1; // 1% platform fee
        address public owner;
        
        mapping(uint256 => Loan) public loans;
        mapping(address => uint256[]) public userLoans;
        
        event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 collateralAmount);
        event LoanFunded(uint256 indexed loanId, address indexed lender);
        event LoanRepaid(uint256 indexed loanId);
        event LoanDefaulted(uint256 indexed loanId);
        event CollateralClaimed(uint256 indexed loanId, address indexed lender);
        event LoanCancelled(uint256 indexed loanId);

        constructor() {
            owner = msg.sender;
        }

        function requestLoan(LoanRequest calldata request) external {
            require(request.amount > 0, "Invalid amount");
            require(request.duration > 0, "Invalid duration");
            require(request.interest <= 100, "High interest");
            require(request.collateralAmount > 0, "Invalid collateral");
            
            loanCounter++;
            
            loans[loanCounter] = Loan({
                borrower: msg.sender,
                lender: address(0),
                amount: request.amount,
                interest: request.interest,
                duration: request.duration,
                startTime: 0,
                collateralAmount: request.collateralAmount,
                collateralToken: request.collateralToken,
                status: LoanStatus.REQUESTED
            });
            
            userLoans[msg.sender].push(loanCounter);
            
            emit LoanRequested(loanCounter, msg.sender, request.amount, request.collateralAmount);
        }

        function fundLoan(uint256 loanId) external payable {
            Loan storage loan = loans[loanId];
            require(loan.status == LoanStatus.REQUESTED, "Not available");
            require(msg.value == loan.amount, "Wrong amount");
            require(msg.sender != loan.borrower, "Can't self fund");
            
            _transferCollateral(loan.collateralToken, loan.borrower, address(this), loan.collateralAmount);
            
            loan.lender = msg.sender;
            loan.startTime = block.timestamp;
            loan.status = LoanStatus.FUNDED;
            
            userLoans[msg.sender].push(loanId);
            payable(loan.borrower).transfer(msg.value);
            
            emit LoanFunded(loanId, msg.sender);
        }

        function repayLoan(uint256 loanId) external payable {
            Loan storage loan = loans[loanId];
            require(loan.status == LoanStatus.FUNDED, "Not funded");
            require(msg.sender == loan.borrower, "Not borrower");
            require(block.timestamp <= loan.startTime + loan.duration, "Defaulted");
            
            uint256 totalAmount = _calculateRepayment(loan.amount, loan.interest);
            require(msg.value == totalAmount, "Wrong amount");
            
            loan.status = LoanStatus.REPAID;
            
            _transferCollateral(loan.collateralToken, address(this), loan.borrower, loan.collateralAmount);
            _distributeRepayment(loan.lender, totalAmount);
            
            emit LoanRepaid(loanId);
        }

        function defaultLoan(uint256 loanId) external {
            Loan storage loan = loans[loanId];
            require(loan.status == LoanStatus.FUNDED, "Not funded");
            require(block.timestamp > loan.startTime + loan.duration, "Not expired");
            
            loan.status = LoanStatus.DEFAULTED;
            _transferCollateral(loan.collateralToken, address(this), loan.lender, loan.collateralAmount);
            
            emit LoanDefaulted(loanId);
        }

        function cancelLoan(uint256 loanId) external {
            Loan storage loan = loans[loanId];
            require(msg.sender == loan.borrower, "Not borrower");
            require(loan.status == LoanStatus.REQUESTED, "Can't cancel");
            
            loan.status = LoanStatus.CANCELLED;
            emit LoanCancelled(loanId);
        }

        function _calculateRepayment(uint256 amount, uint256 interest) private pure returns (uint256) {
            uint256 interestAmount = (amount * interest) / 100;
            uint256 platformFee = (amount * PLATFORM_FEE) / 100;
            return amount + interestAmount + platformFee;
        }

        function _distributeRepayment(address lender, uint256 totalAmount) private {
            uint256 platformFee = (totalAmount * PLATFORM_FEE) / (100 + PLATFORM_FEE);
            uint256 lenderAmount = totalAmount - platformFee;
            
            payable(lender).transfer(lenderAmount);
            payable(owner).transfer(platformFee);
        }

        function _transferCollateral(address token, address from, address to, uint256 amount) private {
            (bool success, bytes memory result) = token.call(
                abi.encodeWithSelector(0xa9059cbb, to, amount)
            );
            require(success && (result.length == 0 || abi.decode(result, (bool))), "Transfer failed");
        }

        function getUserLoans(address user) external view returns (uint256[] memory) {
            return userLoans[user];
        }
    }