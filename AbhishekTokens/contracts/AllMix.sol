//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "./DeflectionaryWithTax.sol";


contract AllMix is  DeflectionaryWithTax{

    constructor(string memory _name, string memory _symbol, uint _decimals, uint _totalSupply, uint cap_) 
    DeflectionaryWithTax(_name, _symbol, _decimals, _totalSupply){
        require(cap_ > 0, "Cap should be greater than 0");
        _cap = cap_;
        roleM[msg.sender] = MINTER_ROLE;
        roleP[msg.sender] = PAUSE_ROLE;
        admin[msg.sender] = true;
    }
    
    mapping(address => bytes32) roleM;
    mapping(address => bytes32) roleP;
    mapping(address => bool) admin;
    bool internal pause = false;
     
    
    bytes32 PAUSE_ROLE = keccak256(abi.encode(PAUSE_ROLE));    
    bytes32 MINTER_ROLE = keccak256(abi.encode(MINTER_ROLE));

    uint public immutable _cap;
    
    
    modifier hasPauseRole {
        require(roleP[msg.sender] == PAUSE_ROLE ||
                admin[msg.sender], "You don't have Pause role");
        _;
    }

    modifier hasMinterRole {
        require(roleM[msg.sender] == MINTER_ROLE ||
                admin[msg.sender], "You don't have Miner role");
        _;
    }

    modifier hasAdmineRole {
        require(admin[msg.sender], "You don't have Admin role");
        _;
    }

    function giveMinterRole(address _to) external hasAdmineRole {
        roleM[_to] = MINTER_ROLE; 
    }

    function transferAdmineRole(address _to) external hasAdmineRole {
        admin[_to] = true;
        admin[msg.sender] = false;
    }

    function takeMinetRole(address _from) external hasAdmineRole{
        delete roleM[_from];
    }

     function takePauserRole(address _from) external hasAdmineRole{
        delete roleP[_from];
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

    function transfer(address _to, uint _amount) external override {
        require(!pause, "System is paused please sorry for inconvenience");
        require(balance[msg.sender] >= _amount, "You don't have enough balance to send");
        uint burned = (_amount * burnRate )/ 100;
        uint taxAmount1 = (_amount * tax1)/ 100;
        uint taxAmount2 = (_amount * tax2)/ 100;
        _transfer(msg.sender, _to, _amount - burned - taxAmount1 - taxAmount2, burned, taxAmount1, taxAmount2 );
        
    }

    function transferFrom(address _owner,address _to, uint _amount) external override{
        require(!pause, "System is paused please sorry for inconvenience");
        uint currentAllowance = _allowance[_owner][msg.sender];
        require(currentAllowance >= _amount, "You don't have enough allownance to send");
        uint burned = (_amount * burnRate)/ 100;
        uint taxAmount1 = (_amount * tax1)/ 100;
        uint taxAmount2 = (_amount * tax2)/ 100;
        _transfer(msg.sender, _to, (_amount - burned - taxAmount1 - taxAmount2), burned, taxAmount1, taxAmount2 );
        _allowance[_owner][msg.sender] = currentAllowance - _amount;
    }

    function mint(address _to, uint _amount) external hasMinterRole {
        require(totalSupply + _amount <= _cap, "Mint amount willl excide Cap");
        balance[_to] += _amount;
        totalSupply += _amount;
    }

    function burn(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "You don't have enough to burn");
        _transfer(msg.sender, address(0), _amount, 0, 0, 0);
        totalSupply -= _amount; 
    }

    function burnFrom(address _owner, uint _amount) external {
        require(balanceOf(_owner) >= _amount, "You don't have allowance to burn");
        _transfer(_owner, address(0), _amount, 0, 0, 0);
        _allowance[_owner][msg.sender] -= _amount;
        totalSupply -= _amount;   
    }




}