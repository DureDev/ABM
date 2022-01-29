//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;


contract Reflectionary { 

    address public owner;

    mapping(address => uint) internal rOwned;
    mapping(address => uint) internal tOwned;
    mapping(address => mapping(address => uint)) internal _allowance;

    mapping(address => bool) internal isExcluded;

    address[] excluded;

    uint constant MAX = ~uint(0);
    uint constant tTotal = 10**16 * 10**18;
    uint rTotal = MAX - (MAX % tTotal);
    uint public tTotalFee;

    string public name = "AbhishekToken";
    string public symbol = "ABHI";
    uint public decimals = 18;

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed from, address indexed to, uint amount);
    
    constructor(){
                
        rOwned[msg.sender] = rTotal;
        owner = msg.sender;

        emit Transfer(address(0), owner, tTotal);
    }

    modifier onlyOwner{
        require(msg.sender == owner, "You are not Owner");
        _;
    }
    
    function balanceOf(address _owner) public view returns(uint){
        if ( isExcluded[_owner] ) return tOwned[_owner];
        return tokenFromReflection(rOwned[_owner]);
    }

    function transfer(address _to, uint _amount) external virtual{
        _transfer(msg.sender, _to, _amount );
    }

    function transferFrom(address _owner,address _to, uint _amount) external virtual{
        uint currentAllowance = _allowance[_owner][msg.sender];
        require(currentAllowance >= _amount, "You don't have enough allownance to send");
        _transfer(_owner, _to, _amount);
        _allowance[_owner][msg.sender] = currentAllowance - _amount;   
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

    function tokenFromReflection(uint rAmount) public view returns (uint){
        uint rate = getRate();
        uint rTransferAmount = rAmount/rate;
        return rTransferAmount;
    }

    function reflect(uint tAmount) public {
        require(balanceOf(msg.sender) >= tAmount, "You don't have enough tokens");
         (uint rAmount,,uint rFee,, uint tFee) = getValues(tAmount);
        _reflectFee(rFee, tFee);
        rOwned[msg.sender] -= rAmount;
    }

    function reflectionFromToken(uint tAmount, bool deductFee) public view returns (uint){
        require(tAmount <= tTotal, "Your Token amount is Invalid");
        (uint rAmount, uint rTransferAmount,,,) = getValues(tAmount);
       
        if( deductFee ) {
            return rTransferAmount;
        }
        else {
            return rAmount;
        }
    }

    function isExcludedAccount(address _account) public view returns(bool){
        return isExcluded[_account];
    } 

    function excludeAccount(address _account) public onlyOwner{
        require(!isExcluded[_account], "Account is already excluded");
        if(rOwned[_account] > 0){
            tOwned[_account] = balanceOf(_account);
        }
            isExcluded[_account] = true;
            excluded.push(_account);
        
    }

    function includeAccount(address _account) public onlyOwner{
        require(isExcluded[_account], "Account is not excluded");
        for( uint i=0 ; i < excluded.length ; i++ ){
            if(excluded[i] == _account){
                excluded[i] = excluded[excluded.length - 1];
                isExcluded[excluded[i]] = false;
                tOwned[excluded[i]] = 0;
                excluded.pop;
                break;
            }
        }
    }


    function _transfer(address _from, address _to, uint _amount) internal {
       require(_to != address(0), "You are sending Token to Zero address");
       require(balanceOf(_from) >= _amount, "You don't have Enough token to send");
       if( !isExcluded[_from] && isExcluded[_to]){
           _transferToExcluded(_from, _to, _amount);
       }
        if (isExcluded[_from] && !isExcluded[_to]){
           _transferFromExcluded(_from, _to, _amount);
       }
        if (isExcluded[_from] && isExcluded[_to]){
           _transferBothExcluded(_from, _to, _amount);
       }
        if (!isExcluded[_from] && !isExcluded[_to]){
           _transferStanderd(_from, _to, _amount);
       }
       
       emit Transfer(_from, _to, _amount);
    }

    function _transferToExcluded(address _from, address _to, uint _amount) internal {
        (uint rAmount, uint rTransferAmount, uint rFee, uint tTransferAmount, uint tFee) = getValues(_amount);
        rOwned[_from] -= rAmount;
        rOwned[_to] += rTransferAmount;
        tOwned[_to] += tTransferAmount;
        _reflectFee(rFee, tFee);
    }

    function _transferFromExcluded(address _from, address _to, uint _amount) internal{
        (uint rAmount, uint rTransferAmount, uint rFee,, uint tFee) = getValues(_amount);
        rOwned[_from] -= rAmount;
        tOwned[_from] -= _amount;
        rOwned[_to] += rTransferAmount;
        _reflectFee(rFee, tFee);
    }

    function _transferBothExcluded(address _from, address _to, uint _amount) internal{
        (uint rAmount, uint rTransferAmount, uint rFee, uint tTransferAmount, uint tFee) = getValues(_amount);
        rOwned[_from] -= rAmount;
        tOwned[_from] -= _amount;
        rOwned[_to] += rTransferAmount;
        tOwned[_to] += tTransferAmount;
        _reflectFee(rFee, tFee);
    }

    function _transferStanderd(address _from, address _to, uint _amount) internal{
        (uint rAmount, uint rTransferAmount, uint rFee, , uint tFee) = getValues(_amount);
        rOwned[_from] -= rAmount;
        rOwned[_to] += rTransferAmount;
        _reflectFee(rFee, tFee);
    }

    function _reflectFee(uint rFee, uint tFee) internal {
        rTotal -= rFee;
        tTotalFee += tFee;
    } 


    function getValues(uint tAmount) internal view returns (uint, uint, uint, uint, uint) {
        (uint tTransferAmount, uint tFee) = getTValue(tAmount);
        uint currentRate = getRate();
        (uint rAmount, uint rTransferAmount, uint rFee) = getRValue(tAmount, tFee, currentRate);
        return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee);
    }

    function getTValue(uint tAmount) internal pure returns (uint, uint){
        uint tFee = tAmount/100;
        uint tTransferAmount = tAmount - tFee;
        return (tTransferAmount, tFee);
    }

    function getRValue(uint tAmount, uint tFee, uint currentRate) internal pure returns (uint, uint, uint){
        uint rAmount = tAmount * currentRate;
        uint rFee = tFee * currentRate;
        uint rTransferAmount = rAmount - rFee;
        return (rAmount, rTransferAmount, rFee);
    }

    function getRate() internal view returns (uint) {
        (uint rSupply, uint tSupply,) = getSupply();
         uint rate = rSupply/tSupply;
         return rate;
    }

    function getSupply() internal view returns (uint, uint, uint){
        uint rSupply = rTotal;
        uint tSupply = tTotal;
        uint a;

        for(uint i = 0 ; i < excluded.length ; i++){
            if ( rOwned[excluded[i]] > rSupply || tOwned[excluded[i]] > tSupply ) return (rTotal, tTotal, a=1);
            rSupply -= rOwned[excluded[i]];
            tSupply -= tOwned[excluded[i]];
        }

        if(rSupply < rTotal/tTotal) return (rTotal, tTotal, a=2);
        return (rSupply, tSupply, a=0);
    }
    
}