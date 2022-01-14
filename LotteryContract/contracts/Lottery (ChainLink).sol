// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    address manager;
    address[] public players;

    uint lotteryTicket = 1;
    uint maxPlayer = 2;

    //For chainlink
    bytes32 internal keyHash;
    uint256 internal fee;    
        
    uint public winner;
    
    constructor()
    VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator for Rinkeby
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
        ) 
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
        manager = msg.sender;
    }
    
    modifier onlyManger() {
        require(msg.sender == manager);
        _;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        //randomResult = randomness;
        winner = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players, randomness, requestId))) % maxPlayer;
        //payable(players[winner]).transfer(maxPlayer*lotteryTicket);
        //delete players;
                
    }
           
    function pickWinner() public onlyManger {
        require(players.length == maxPlayer);
        require(msg.sender == manager);
        getRandomNumber();
                
    }

    function setLotteryTicket(uint _ticketPrice) external onlyManger {
        lotteryTicket = _ticketPrice;
    }

    function setMaxPlayer(uint _maxPlayer) external onlyManger {
        maxPlayer = _maxPlayer;
    }

    function getLotteryTicketPrice() public view returns (uint) {
        return lotteryTicket;
    }

    function getMaxPlayer() public view returns (uint){
        return maxPlayer;
    }

    function getPlayer() public view returns (address[] memory) {
        return players;
    }
    
    function buyTicket(uint _price) public {
        require(players.length < 10);
        require(_price == lotteryTicket);
        players.push(msg.sender);

    }
        
    receive() external payable {
        
    }

    
    
} 

