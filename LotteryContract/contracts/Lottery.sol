
pragma solidity ^0.8.0;

contract Lottery {
    address  manager;
    address[] public players;
    address public lastWinner;


    uint256 lotteryTicket = 0.01 ether;
    uint maxPlayers = 10;
    
   
    
    constructor() {
        manager = msg.sender;
    }

    modifier onlyManger() {
        require(msg.sender == manager, "You are not Manager");
        _;
    }
            
    function _generateRandomNumber() internal view onlyManger returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % maxPlayers;
    } 

    function pickWinner() public onlyManger returns (address) {
        require(players.length == maxPlayers, "Max player limit are not reached");
        uint winner = _generateRandomNumber();
        payable(players[winner]).transfer(maxPlayers*lotteryTicket);
        lastWinner = players[winner];
        delete players;
        return lastWinner;        
    }

    function setLotteryTicket(uint _ticketPrice) external onlyManger {
        lotteryTicket = _ticketPrice;
    }

    function setMaxPlayers(uint _maxPlayer) external onlyManger {
        maxPlayers = _maxPlayer;
    }

    function getLotteryTicketPrice() public view returns (uint) {
        return lotteryTicket;
    }

    function getMaxPlayers() public view returns (uint){
        return maxPlayers;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    function buyTicket() public payable{
        require(players.length < maxPlayers, "Max players are allotted");
        require(msg.value == lotteryTicket, "Lottery Price is not equal");
        players.push(msg.sender);

    }
    
    //receive() external payable {
        
    //}

    
    
} 
//0x9ecEA68DE55F316B702f27eE389D10C2EE0dde84
//import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";