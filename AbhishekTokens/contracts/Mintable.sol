//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ABHI.sol";

contract Mintable is ABHI {
    
    constructor(string memory _name, string memory _symbole, uint _decimal, uint _totalSupply)
    ABHI(_name, _symbole, _decimal, _totalSupply)
    {
        roleM[msg.sender] = MINTER_ROLE;
        admin[msg.sender] = true;
        
    }

    mapping(address => bytes32) roleM;
    mapping(address => bool) admin;
    
    bytes32 MINTER_ROLE = keccak256(abi.encode(MINTER_ROLE));
    

    modifier hasMinterRole {
        require(roleM[msg.sender] == MINTER_ROLE ||
                admin[msg.sender], "You don't have Miner role");
        _;
    }

    modifier hasAdmineRole {
        require(admin[msg.sender], "You don't have Admin role");
        _;
    }

    function mint(address _to, uint _amount) external hasMinterRole {
        balance[_to] += _amount;
        totalSupply += _amount;
    }

    function giveMinterRole(address _to) external hasAdmineRole {
        roleM[_to] = MINTER_ROLE; 
    }

    function transferAdmineRole(address _to) external hasAdmineRole {
        admin[_to] = true;
        admin[msg.sender] = false;
    }

    function takeRole(address _from) external hasAdmineRole{
        delete roleM[_from];
    }

}