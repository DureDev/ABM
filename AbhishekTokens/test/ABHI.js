const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("ABHI", function () { 
  let owner;
  let addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("ABHI");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000);
    await hardhatAbhishek.deployed();
  });
  
  it("Name, Symbol and decimal of the tokens should be AbhishekToken, ABHI and 18", async function () {

    expect(await hardhatAbhishek.connect(addr1).name()).to.be.equal("AbhishekToken");
    expect(await hardhatAbhishek.connect(addr1).symbol()).to.be.equal("ABHI");
    expect(await hardhatAbhishek.connect(addr1).decimals()).to.be.equal(18);
   
  });

  it("Total supply should be 1000", async function () {

    expect(await hardhatAbhishek.totalSupply()).to.equal(1000);   

  });

  it("Should give balance of the owner 1000", async function () {
    
    expect(await hardhatAbhishek.balanceOf(owner.address)).to.equal(1000);

  });

  it("Should transfer tokens to other account ", async function () {
    
    await hardhatAbhishek.connect(owner).transfer(addr1.address, 20);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(20);

    await expect(hardhatAbhishek.connect(addr1).transfer(owner.address, 200)).to.be.revertedWith("You don't have enough balance to send");

  });

   it("Should emit an event", async function () {
    
    await expect(hardhatAbhishek.connect(owner).transfer(addr1.address, 20))
    .to.emit(hardhatAbhishek, 'Transfer').withArgs(owner.address, addr1.address, 20);

    await expect(hardhatAbhishek.connect(owner).approve(addr1.address, 20))
    .to.emit(hardhatAbhishek, 'Approval').withArgs(owner.address, addr1.address, 20);


  });

  it("Main account should provide allowance and can increase it and decress it ", async function () {

    await hardhatAbhishek.approve(addr1.address, 20);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(20);

    await hardhatAbhishek.increaseAllowance(addr1.address, 30);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(50);

    await hardhatAbhishek.decreaseAllowance(addr1.address, 10);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(40);

    await expect(hardhatAbhishek.connect(addr1).approve(owner.address, 20)).to.be.revertedWith("You don't have enough token to give allowance to other");
    await expect(hardhatAbhishek.connect(addr1).increaseAllowance(owner.address, 20)).to.be.revertedWith("You don't have enough token to give allowance to other");
  });

  it("Allowed user should spend his allowance not more than that", async function () {

    await hardhatAbhishek.approve(addr1.address, 30);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(30);

    await hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 20);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(10);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(20);

    await expect(hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 20)).to.be.revertedWith("You don't have enough allownance to send")

  });

  




});
//await expect(tokenInstance.connect(<signer-account>).transfer(<addr-of-receipent>, <amount-BigNumber>))
//.to.emit(tokenInstance, 'Transfer').withArgs(<addr-of-signer-account>, <addr-of-receipent>, <amount-BigNumber>);
