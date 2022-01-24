//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ABHI.sol";

contract Capped is ABHI {
    
    constructor(string memory _name, string memory _symbole, uint _decimal, uint _totalSupply, uint cap_)
    ABHI(_name, _symbole, _decimal, _totalSupply)
    {   
        require(cap_ > 0, "Cap should be greater than 0");
        role[msg.sender] = MINTER_ROLE;
        admin[msg.sender] = true;
        _cap = cap_;
        
    }

    uint public immutable _cap;

    mapping(address => bytes32) role;
    mapping(address => bool) admin;
    
    bytes32 MINTER_ROLE = keccak256(abi.encode(MINTER_ROLE));
    

    modifier hasMinterRole {
        require(role[msg.sender] == MINTER_ROLE ||
                admin[msg.sender], "You don't have Miner role");
        _;
    }

    modifier hasAdmineRole {
        require(admin[msg.sender], "You don't have Admin role");
        _;
    }

    function mint(address _to, uint _amount) external hasMinterRole {
        require(totalSupply + _amount <= _cap, "Mint amount willl excide Cap");
        balance[_to] += _amount;
        totalSupply += _amount;
    }

    function giveMinterRole(address _to) external hasAdmineRole {
        role[_to] = MINTER_ROLE; 
    }

    function transferAdmineRole(address _to) external hasAdmineRole {
        admin[_to] = true;
        admin[msg.sender] = false;
    }

    function takeRole(address _from) external hasAdmineRole{
        delete role[_from];
    }

}