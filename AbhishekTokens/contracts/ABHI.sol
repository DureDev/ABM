//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract ABHI {

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

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed from, address indexed to, uint amount);

    function balanceOf(address _owner) public view returns(uint){
        return balance[_owner];
    }

    function transfer(address _to, uint _amount) external virtual{
        require(balance[msg.sender] >= _amount, "You don't have enough balance to send");
        _transfer(msg.sender, _to, _amount );
    }

    function transferFrom(address _owner,address _to, uint _amount) external virtual{
        uint currentAllowance = _allowance[_owner][msg.sender];
        require(currentAllowance >= _amount, "You don't have enough allownance to send");
        _transfer(_owner, _to, _amount);
        _allowance[_owner][msg.sender] = currentAllowance - _amount;   
    }

    function _transfer(address _from, address _to, uint _amount) internal {
        balance[_from] -= _amount;
        balance[_to] += _amount;
        emit Transfer(_from, _to, _amount);
    }
    
    function approve(address _to, uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "You don't have enough token to give allowance to other");
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
