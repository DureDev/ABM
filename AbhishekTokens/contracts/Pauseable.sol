//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ABHI.sol";

contract Pauseable is ABHI {
    
    constructor(string memory _name, string memory _symbole, uint _decimal, uint _totalSupply)
    ABHI(_name, _symbole, _decimal, _totalSupply)
    {
        roleP[msg.sender] = PAUSE_ROLE;
        admin[msg.sender] = true;
        
    }

    mapping(address => bytes32) roleP;
    mapping(address => bool) admin;

    bool internal pause = false;
    
    bytes32 PAUSE_ROLE = keccak256(abi.encode(PAUSE_ROLE));
    

    modifier hasPauseRole {
        require(roleP[msg.sender] == PAUSE_ROLE ||
                admin[msg.sender], "You don't have Pause role");
        _;
    }

    modifier hasAdmineRole {
        require(admin[msg.sender], "You don't have Admin role");
        _;
    }

    function transfer(address _to, uint _amount) external override {
        require(!pause, "System is paused please sorry for inconvenience");
        require(balance[msg.sender] >= _amount, "You don't have enough balance to send");
        _transfer(msg.sender, _to, _amount );
    }

    function transferFrom(address _owner,address _to, uint _amount) external override{
        require(!pause, "System is paused please sorry for inconvenience");
        uint currentAllowance = _allowance[_owner][msg.sender];
        require(currentAllowance >= _amount, "You don't have enough allownance to send");
        _transfer(_owner, _to, _amount);
        _allowance[_owner][msg.sender] = currentAllowance - _amount;   
    }
    
    function pauseSystem() external hasPauseRole {
        require(!pause, "System is already pause");
        pause = true;
    }

    function unpauseSystem() external hasPauseRole {
        require(pause, "System is already running");
        pause = false;
    }

    function givePauseRole(address _to) external hasAdmineRole {
        roleP[_to] = PAUSE_ROLE; 
    }

    function transferAdmineRole(address _to) external hasAdmineRole {
        admin[_to] = true;
        admin[msg.sender] = false;
    }

    function takeRole(address _from) external hasAdmineRole{
        delete roleP[_from];
    }

}