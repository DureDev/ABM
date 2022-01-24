//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract DeflectionaryWithTax {

    mapping(address => uint) balance;
    mapping(address => mapping(address => uint)) internal _allowance;

    string public name;
    string public symbol;
    uint public decimals;
    uint public totalSupply;

    constructor(string memory _name, string memory _symbol, uint _decimals, uint _totalSupply){
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balance[msg.sender] = totalSupply;
    }

    uint public burnRate = 1;
    uint public tax1 = 1;
    uint public tax2 = 2;
    address public taxAddr1 = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address public taxAddr2 = 0x583031D1113aD414F02576BD6afaBfb302140225;

    event Transfer(address indexed from, address indexed to, uint amount, uint burned, uint tax1, uint tax2);
    event Approval(address indexed from, address indexed to, uint amount);

    function balanceOf(address _owner) public view returns(uint){
        return balance[_owner];
    }

    function transfer(address _to, uint _amount) external virtual{
        require(balance[msg.sender] >= _amount, "You don't have enough balance to send");
        uint burned = (_amount * burnRate )/ 100;
        uint taxAmount1 = (_amount * tax1)/ 100;
        uint taxAmount2 = (_amount * tax2)/ 100;
        _transfer(msg.sender, _to, _amount - burned - taxAmount1 - taxAmount2, burned, taxAmount1, taxAmount2 );
    }

    function transferFrom(address _owner,address _to, uint _amount) external virtual{
        uint currentAllowance = _allowance[_owner][msg.sender];
        require(currentAllowance >= _amount, "You don't have enough amount to send");
        uint burned = (_amount * burnRate)/ 100;
        uint taxAmount1 = (_amount * tax1)/ 100;
        uint taxAmount2 = (_amount * tax2)/ 100;
        _transfer(msg.sender, _to, (_amount - burned - taxAmount1 - taxAmount2), burned, taxAmount1, taxAmount2 );
        _allowance[_owner][msg.sender] = currentAllowance - _amount;   
    }

    function _transfer(address _from, address _to, uint _amount, uint _burned, uint _tax1, uint _tax2) internal {
        unchecked{
            balance[_from] -= (_amount + _burned + _tax1 + _tax2);
            balance[_to] += _amount;
            balance[taxAddr1] += _tax1;
            balance[taxAddr2] += _tax2;
        }
        totalSupply -= _burned;
        emit Transfer(_from, _to, _amount, _burned, _tax1, _tax2);
    }
    
    function approve(address _to, uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "You don't have enough token for allowance");
        _approve(_to, _amount);
    }

    function _approve(address _to, uint _amount) internal {
        _allowance[msg.sender][_to] = _amount;
        emit Approval(msg.sender, _to, _amount);
    }

    function allowance(address _owner, address _allowedTo) public view returns(uint){
        return _allowance[_owner][_allowedTo];
    }

    function increaseAllowance(address _allowedTo, uint _amount) external {
        uint increasedAllowance = _allowance[msg.sender][_allowedTo] + _amount;
        require(balanceOf(msg.sender) >= increasedAllowance, "You don't have enough token to give allowance to other");
        _allowance[msg.sender][_allowedTo] = increasedAllowance;
    }

    function decreaseAllowance(address _allowedTo, uint _amount) external {
        _allowance[msg.sender][_allowedTo] -= _amount;
    }
        
}
