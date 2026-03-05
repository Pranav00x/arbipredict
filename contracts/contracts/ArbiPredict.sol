// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ArbiPredict is Ownable, ReentrancyGuard {
    AggregatorV3Interface public priceFeed;

    uint256 public constant TICKET_PRICE = 0.0005 ether;
    uint256 public constant EPOCH_DURATION = 24 hours;
    uint256 public constant BETTING_DURATION = 12 hours;
    uint256 public constant FEE_PERCENTAGE = 50; // 0.5% (50 basis points)
    uint256 public constant REFERRAL_PERCENTAGE = 1000; // 10% (1000 basis points)

    struct Epoch {
        uint256 epochId;
        uint256 startTimestamp;
        int256 bettingPrice;
        int256 finalPrice;
        uint256 totalHighTickets;
        uint256 totalLowTickets;
        uint256 totalHighAmount;
        uint256 totalLowAmount;
        bool resolved;
    }

    uint256 public currentEpochId;
    mapping(uint256 => Epoch) public epochs;
    
    // User => Epoch => High Tickets
    mapping(address => mapping(uint256 => uint256)) public userHighTickets;
    // User => Epoch => Low Tickets
    mapping(address => mapping(uint256 => uint256)) public userLowTickets;
    
    // User => Claimable Reward
    mapping(address => uint256) public claimableRewards;
    
    // Referrals
    mapping(address => address) public referrers;
    // Points (1 ETH wagered = 1 point, so we store points in wei scale)
    mapping(address => uint256) public points;

    event EpochStarted(uint256 indexed epochId, uint256 startTimestamp, int256 bettingPrice);
    event TicketsBought(uint256 indexed epochId, address indexed user, uint256 amount, bool isHigh);
    event EpochResolved(uint256 indexed epochId, int256 finalPrice, bool highWon);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ReferralSet(address indexed user, address indexed referrer);
    event PointsAwarded(address indexed user, uint256 points);

    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function _getLatestPrice() internal view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function setReferrer(address _referrer) external {
        require(referrers[msg.sender] == address(0), "Referrer already set");
        require(_referrer != msg.sender, "Cannot refer yourself");
        referrers[msg.sender] = _referrer;
        emit ReferralSet(msg.sender, _referrer);
    }

    function startEpoch() external onlyOwner {
        if (currentEpochId != 0) {
            require(epochs[currentEpochId].resolved, "Previous epoch not resolved");
        }
        
        currentEpochId++;
        int256 currentPrice = _getLatestPrice();
        
        epochs[currentEpochId] = Epoch({
            epochId: currentEpochId,
            startTimestamp: block.timestamp,
            bettingPrice: currentPrice,
            finalPrice: 0,
            totalHighTickets: 0,
            totalLowTickets: 0,
            totalHighAmount: 0,
            totalLowAmount: 0,
            resolved: false
        });

        emit EpochStarted(currentEpochId, block.timestamp, currentPrice);
    }

    function _buyTickets(uint256 _amount, bool _isHigh) internal {
        require(_amount > 0, "Amount must be > 0");
        require(msg.value == _amount * TICKET_PRICE, "Incorrect payment");
        
        Epoch storage epoch = epochs[currentEpochId];
        require(block.timestamp < epoch.startTimestamp + BETTING_DURATION, "Betting closed");

        if (_isHigh) {
            epoch.totalHighTickets += _amount;
            epoch.totalHighAmount += msg.value;
            userHighTickets[msg.sender][currentEpochId] += _amount;
        } else {
            epoch.totalLowTickets += _amount;
            epoch.totalLowAmount += msg.value;
            userLowTickets[msg.sender][currentEpochId] += _amount;
        }

        // Award points based on amount
        uint256 awardedPoints = msg.value; 
        points[msg.sender] += awardedPoints;
        emit PointsAwarded(msg.sender, awardedPoints);

        if (referrers[msg.sender] != address(0)) {
            uint256 refPoints = (awardedPoints * REFERRAL_PERCENTAGE) / 10000;
            points[referrers[msg.sender]] += refPoints;
            emit PointsAwarded(referrers[msg.sender], refPoints);
        }

        emit TicketsBought(currentEpochId, msg.sender, _amount, _isHigh);
    }

    function buyHighTickets(uint256 _amount) external payable nonReentrant {
        _buyTickets(_amount, true);
    }

    function buyLowTickets(uint256 _amount) external payable nonReentrant {
        _buyTickets(_amount, false);
    }

    // Resolves the current epoch and calculates winnings.
    // Can be called by anybody to decentralize execution when time is up.
    function resolveEpoch() external nonReentrant {
        Epoch storage epoch = epochs[currentEpochId];
        require(!epoch.resolved, "Already resolved");
        require(block.timestamp >= epoch.startTimestamp + EPOCH_DURATION, "Epoch still running");

        int256 finalPrice = _getLatestPrice();
        epoch.finalPrice = finalPrice;
        epoch.resolved = true;

        bool highWon = finalPrice > epoch.bettingPrice;
        
        // Fee goes to owner
        uint256 totalPool = epoch.totalHighAmount + epoch.totalLowAmount;
        if (totalPool > 0) {
            uint256 platformFee = (totalPool * FEE_PERCENTAGE) / 10000;
            claimableRewards[owner()] += platformFee;
        }

        emit EpochResolved(currentEpochId, finalPrice, highWon);
    }

    // Helper to claim winnings from a specific epoch
    function claimEpochWinnings(uint256 _epochId) external nonReentrant {
        Epoch storage epoch = epochs[_epochId];
        require(epoch.resolved, "Epoch not resolved");
        
        uint256 userHigh = userHighTickets[msg.sender][_epochId];
        uint256 userLow = userLowTickets[msg.sender][_epochId];
        
        require(userHigh > 0 || userLow > 0, "No tickets");

        bool highWon = epoch.finalPrice > epoch.bettingPrice;
        
        uint256 payout = 0;
        uint256 totalPool = epoch.totalHighAmount + epoch.totalLowAmount;
        uint256 netPool = totalPool - ((totalPool * FEE_PERCENTAGE) / 10000);

        if (highWon && epoch.totalHighTickets > 0 && userHigh > 0) {
            uint256 payoutPerTicket = netPool / epoch.totalHighTickets;
            payout = userHigh * payoutPerTicket;
        } else if (!highWon && epoch.totalLowTickets > 0 && userLow > 0) {
            uint256 payoutPerTicket = netPool / epoch.totalLowTickets;
            payout = userLow * payoutPerTicket;
        }

        // Reset user tickets to prevent double claiming
        userHighTickets[msg.sender][_epochId] = 0;
        userLowTickets[msg.sender][_epochId] = 0;

        if (payout > 0) {
            claimableRewards[msg.sender] += payout;
        }
    }

    function claimRewards() external nonReentrant {
        uint256 amount = claimableRewards[msg.sender];
        require(amount > 0, "Nothing to claim");
        
        claimableRewards[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit RewardsClaimed(msg.sender, amount);
    }

    function getUserTickets(address _user, uint256 _epochId) external view returns (uint256 high, uint256 low) {
        return (userHighTickets[_user][_epochId], userLowTickets[_user][_epochId]);
    }

    function getEpochData(uint256 _epochId) external view returns (Epoch memory) {
        return epochs[_epochId];
    }
}
