// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DeluxLottery {
    
    address manager;
    uint public lotteryTicket = 1 ether;
    uint public linePrice = 1 ether;
    
    
    mapping(address => uint) public userId;
    mapping(address => uint) public userLine;
    mapping(address => uint) public userOwnedTicket;
    address[] public users;
 
    struct line{
        address tkAddr;
        uint number1;
        uint number2;
        uint number3;
        uint number4;
        uint number5;
    }
    line[] public players;

    struct winner {
        address wAddr;
        uint8 correctGuesses;
        bool strike;
        bool lotto;
        uint winAmount;
    }
    winner[] winners;
        
    uint[] randNumber;

    constructor() payable {
        require(msg.value >= 10000000000000, "Please Deploy with atleast 100 Billon Token");
        manager = msg.sender;
    }

    modifier onlyManger() {
        require(msg.sender == manager, "You are not Manager");
        _;
    }
    
    function createNewUser() public {
        require(userLine[msg.sender] == 0, "You already have an account");
        userLine[msg.sender] = 3;
        users.push(msg.sender);
        uint id = users.length -1;
        userId[msg.sender] = id;

    } 

    function buyTicket( uint8 _number1, uint8 _number2, uint8 _number3, uint8 _number4, uint8 _number5) public payable{
        require(msg.value == lotteryTicket, "Lottery Price is not equal");
        require(userOwnedTicket[msg.sender] < userLine[msg.sender], "You don't have enough line to fill");
        players.push(line(msg.sender, _number1, _number2, _number3, _number4, _number5));
        userOwnedTicket[msg.sender]++;
    }

    function _getRandomNumber() internal returns (uint) {
        delete randNumber;
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % 10000000000;
    }

    function pickWinner() public onlyManger {
        delete winners;
        uint number = _getRandomNumber();
        randNumber.push(((number) % 21) + 1);
        randNumber.push(((number/100) % 21) + 1);
        randNumber.push(((number/10000) % 21) + 1); 
        randNumber.push(((number/1000000) % 21) + 1);
        randNumber.push(((number/100000000) % 21) + 1);

        for (uint i = 0 ; i < players.length ; i++){
            uint8 correct = 0; 
            bool bingo1 = false;
            bool bingo2 = false;
            bool bingo3 = false;
            bool bingo4 = false;
            bool bingo5 = false;
            bool finding1 = true;
            bool finding2 = true;
            bool finding3 = true;
            bool finding4 = true;
            bool finding5 = true;

            for ( uint8 j = 0 ; j < 5 ; j++ ){


                address playerAddr = players[i].tkAddr;
                if ( userOwnedTicket[playerAddr] > 2 ){
                
                    if ( players[i].number1 == randNumber[j] && finding1 ){
                        correct++;
                        bingo1 = true;
                        finding1 = false;
                        continue;
                    }

                    if ( players[i].number2 == randNumber[j] && finding2 ){
                        correct++;
                        bingo2 = true;
                        finding2 = false;
                        continue;
                    }

                    if ( players[i].number3 == randNumber[j] && finding3 ){
                        correct++;
                        bingo3 = true;
                        finding3 = false;
                        continue;
                    }

                    if ( players[i].number4 == randNumber[j] && finding4 ){
                        correct++;
                        bingo4 = true;
                        finding4 = false;
                        continue;
                    }

                    if ( players[i].number5 == randNumber[j] && finding5 ){
                        correct++;
                        bingo5 = true;
                        finding5 = false;
                        continue;
                    }
                }   
            }

            if( ( bingo1 && bingo2 && bingo3 && bingo4 && bingo5 )){
                winners.push(winner(players[i].tkAddr, correct, false, true, ((((address(this).balance) * 1) / 100) * 50 )/ 100 ));
            }
            else if(( bingo1 && bingo2 && bingo3 ) || ( bingo2 && bingo3 && bingo4 ) || ( bingo3 && bingo4 && bingo5 )) {
                winners.push(winner(players[i].tkAddr, 3, true, false, ((((address(this).balance) * 1)/ 100) * 25 )/ 100 ));
            }else if(correct > 3 ){
                winners.push(winner(players[i].tkAddr, correct, false, false, ((((address(this).balance) * 1)/ 100) * 2 )/ 100 ));
            }else if(correct > 2 ){
                winners.push(winner(players[i].tkAddr, correct, false, false, ((((address(this).balance) * 1)/ 100) * 1 )/ 100 ));
            }

            userOwnedTicket[players[i].tkAddr] = 0;          
        }
        delete players;
        prizeDest();
        
    }
    
    function prizeDest() internal {
        for (uint i ; i < winners.length ; i++){
            payable(winners[i].wAddr).transfer(winners[i].winAmount);
        }
    }

    function getPlayers() public view returns (line[] memory) {
        return players;
    } 

    function getLastWinners() public view returns (winner[] memory){
        return winners;
    }

    function setLotteryTicket(uint _ticket) public onlyManger {
        lotteryTicket = _ticket;
    }

    function setLinePrice(uint _amount) public onlyManger {
        linePrice = _amount;
    }

    function getLastRandNumber() public view returns (uint[] memory){
        return randNumber;
    }

    function buyLine(uint _number) public payable {
        require(msg.value  == _number * linePrice, "Line Price is not equal");
        require(userLine[msg.sender] > 0, "You don't have an account please make one");
        require(( userLine[msg.sender] + _number ) < 11, "Only maximum 10 lines are allowed");
        userLine[msg.sender]++;
    }

}

