//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ABHI.sol";

contract Burnable is ABHI {

    constructor(string memory _name, string memory _symbole, uint _decimal, uint _totalSupply)
    ABHI(_name, _symbole, _decimal, _totalSupply)
    {
    }

    function burn(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "You don't have enough to burn");
        _transfer(msg.sender, address(0), _amount);
        totalSupply -= _amount; 
    }

    function burnFrom(address _owner, uint _amount) external {
        require(balanceOf(_owner) >= _amount, "You don't have allowance to burn");
        _transfer(_owner, address(0), _amount);
        _allowance[_owner][msg.sender] -= _amount;
        totalSupply -= _amount;   
    }

}