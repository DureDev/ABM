pragma solidity ^0.8.4;

contract GrandLottery {

    address manager;
    uint public lotteryTicket = 1 ether;
    uint public maxPlayers = 10;
        
    struct player{
        address pAddr;
        uint number1;
        uint number2;
        uint number3;
        uint number4;
        uint number5;
    }
    player[] public players;

    struct winner {
        address wAddr;
        uint correctGuesses;
        uint winAmount;
    }
    winner[] public winners; // it should be internal

    //temprary variables
    uint number;

    constructor() payable {
        require(msg.value >= 500000000000, "Please Deploy with atleast 100 Billon Token");
        manager = msg.sender;
    }

    modifier onlyManger() {
        require(msg.sender == manager, "You are not Manager");
        _;
    }

    function _getRandomNumber() internal view returns (uint) {
       
       return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % 10000000000;
    }

    function buyTicket(uint _number1, uint _number2, uint _number3, uint _number4, uint _number5) public payable{
        require(players.length < maxPlayers, "Max players are allotted");
        require(msg.value == lotteryTicket, "Lottery Price is not equal");
        players.push(player(msg.sender, _number1, _number2, _number3, _number4, _number5));
    }

    function pickWinner() public onlyManger {
        delete winners;
        number = _getRandomNumber();
        uint[] memory randNumbers = new uint[](5);
        randNumbers[0] = (number) % 100;
        randNumbers[1] = (number/100) % 100;
        randNumbers[2] = (number/10000) % 100; 
        randNumbers[3] = (number/1000000) % 100;
        randNumbers[4] = (number/100000000) % 100;

        for (uint i ; i < maxPlayers ; i++){
            uint correct = 0;

            for ( uint j ; j < 5 ; j++){
                
                if ( players[i].number1 == randNumbers[j]){
                    correct++;
                    continue;
                }

                if ( players[i].number2 == randNumbers[j]){
                    correct++;
                    continue;
                }

                if ( players[i].number3 == randNumbers[j]){
                    correct++;
                    continue;
                }

                if ( players[i].number4 == randNumbers[j]){
                    correct++;
                    continue;
                }

                if ( players[i].number5 == randNumbers[j]){
                    correct++;
                    continue;
                }
            }

            if(correct > 0){
                winners.push(winner(players[i].pAddr, correct, ((((address(this).balance) * 1)/100)*correct)/100));
            }          
        }
        delete players;
        if(winners.length > 0){
            prizeDest();
        }
    }

    function prizeDest() internal {
        for (uint i ; i < winners.length ; i++){
            payable(winners[i].wAddr).transfer(winners[i].winAmount);
        }
    }

    function getPlayers() public view returns (player[] memory) {
        return players;
    } 

    function getLastWinners() public view returns (winner[] memory){
        return winners;
    }

    function setLotteryTicket(uint _ticket) public onlyManger {
        lotteryTicket = _ticket;
    }

    function setMaxPlayers(uint _player) public onlyManger {
        maxPlayers = _player;
    }        
}
