// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract PowerLotto {
    
    address manager;
    uint public lotteryTicket = 1 ether;
    uint public linePrice = 1 ether;
    
    
    mapping(address => uint) public userId;
    mapping(address => uint) public userLine;
    mapping(address => uint) public userOwnedTicket;
    address[] users;

    uint public weekPass;
    bool grandLotto;
    uint passAmount;

    struct line{
        address tkAddr;
        
        uint8 number1;
        uint8 number2;
        uint8 number3;
        uint8 number4;
        uint8 number5;

        uint8 powerBall;

        bool finding1;
        bool finding2;
        bool finding3;
        bool finding4;
        bool finding5;        
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

    function buyTicket(uint8 _number1, uint8 _number2, uint8 _number3, uint8 _number4, uint8 _number5, uint8 _powerBall) public payable{
        require(msg.value == lotteryTicket, "Lottery Price is not equal");
        require(userOwnedTicket[msg.sender] < userLine[msg.sender], "You don't have enough line to fill");
        players.push(line(msg.sender, _number1, _number2, _number3, _number4, _number5, _powerBall, true, true, true, true, true));
        userOwnedTicket[msg.sender]++;
    }

    function _getRandomNumber() internal returns (uint) {
        delete randNumber;
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % 1000000000000;
    }

    function pickWinner() public onlyManger {
        delete winners;
        grandLotto = false;
        uint number = _getRandomNumber();
        randNumber.push(((number) % 21) + 1);
        randNumber.push(((number/100) % 21) + 1);
        randNumber.push(((number/10000) % 21) + 1); 
        randNumber.push(((number/1000000) % 21) + 1);
        randNumber.push(((number/100000000) % 21) + 1);
        uint _powerBall = (((number/10000000000) % 21) + 1);

        for (uint8 i = 0 ; i < players.length ; i++){
            uint8 correct = 0; 
            bool bingo1 = false;
            bool bingo2 = false;
            bool bingo3 = false;
            bool bingo4 = false;
            bool bingo5 = false;
            
            bool playerPower = false;
            

            for ( uint8 j = 0 ; j < 5 ; j++ ){

                address playerAddr = players[i].tkAddr;
                if ( userOwnedTicket[playerAddr] > 2 ){

                    if(players[i].powerBall == _powerBall){
                        playerPower = true;
                    }

                            
                    if ( players[i].number1 == randNumber[j] && players[i].finding1  ){
                        correct++;
                        bingo1 = true;
                        players[i].finding1 = false;
                        continue;
                    }

                    if ( players[i].number2 == randNumber[j] && players[i].finding2 ){
                        correct++;
                        bingo2 = true;
                        players[i].finding2 = false;
                        continue;
                    }

                    if ( players[i].number3 == randNumber[j] && players[i].finding3 ){
                        correct++;
                        bingo3 = true;
                        players[i].finding3 = false;
                        continue;
                    }

                    if ( players[i].number4 == randNumber[j] && players[i].finding4 ){
                        correct++;
                        bingo4 = true;
                        players[i].finding4 = false;
                        continue;
                    }

                    if ( players[i].number5 == randNumber[j] && players[i].finding5 ){
                        correct++;
                        bingo5 = true;
                        players[i].finding5 = false;
                        continue;
                    }
                }   
            }

            if((bingo1 && bingo2 && bingo3 && bingo4 && bingo5 && playerPower)){
                weekPass = 0;
                grandLotto = true;
                winners.push(winner(players[i].tkAddr, correct, false, true, (((((address(this).balance) * 1) / 100) * 70 )/ 100) + passAmount )); 
                passAmount = 0; 
            }
            else if( (bingo1 && bingo2 && bingo3 && bingo4 && bingo5) ){
                winners.push(winner(players[i].tkAddr, correct, true, false, ((((address(this).balance) * 1) / 100) * 50 )/ 100 ));
            }

            else if(( bingo1 && bingo2 && bingo3 && bingo4 && playerPower) || ( bingo2 && bingo3 && bingo4 && bingo5 && playerPower) ) {
                winners.push(winner(players[i].tkAddr, correct, false, true, ((((address(this).balance) * 1) / 100) * 40 )/ 100 ));
            }
            
            else if(( bingo1 && bingo2 && bingo3 && bingo4 ) || ( bingo2 && bingo3 && bingo4 && bingo5 ) ) {
                winners.push(winner(players[i].tkAddr, correct, true, false, ((((address(this).balance) * 1) / 100) * 30 )/ 100 ));
            }
            
            else if(correct > 3 ){
                winners.push(winner(players[i].tkAddr, correct, false, false, ((((address(this).balance) * 1) / 100) * 4 )/ 100 ));
            }
            
            else if(correct > 2 ){
                winners.push(winner(players[i].tkAddr, correct, false, false, ((((address(this).balance) * 1) / 100) * 3 )/ 100 ));
            }

            userOwnedTicket[players[i].tkAddr] = 0;          
        }
        delete players;
        prizeDest();
        
    }
    
    function prizeDest() internal {
        
        if ( grandLotto == false ){
            weekPass++;
            passAmount = passAmount + (((((address(this).balance) * 1) / 100) * 70 )/ 100) ;
        }

        if( weekPass > 3 ){
            for (uint i ; i < winners.length ; i++){
            payable(winners[i].wAddr).transfer((winners[i].winAmount) + (passAmount/winners.length) );
            weekPass = 0;
            passAmount = 0;
        }    
        }
        else{        
        for (uint i ; i < winners.length ; i++){
            payable(winners[i].wAddr).transfer(winners[i].winAmount);
        }
        }
        
    }

    function getLastWinners() public view returns (winner[] memory){
        return winners;
    }

    function setLotteryTicket(uint _ticket) public onlyManger {
        lotteryTicket = _ticket;
    }

    function buyLine(uint _number) public payable {
        require(msg.value == _number * linePrice, "Line Price is not equal");
        require(userLine[msg.sender] > 0, "You don't have an account please make one");
        require(userLine[msg.sender] + _number < 11, "Only maximum 10 lines are allowed");
        userLine[msg.sender]++;
    }

    function setLinePrice(uint _amount) public onlyManger {
        linePrice = _amount;
    }

}



