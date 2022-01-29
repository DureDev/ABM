const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Reflectionary", function () { 
  let owner;
  let addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("Reflectionary");
    
    hardhatAbhishek = await Abhishek.deploy();
    await hardhatAbhishek.deployed();
  });
  
  it("Name, Symbol and decimal of the tokens should be AbhishekToken, ABHI and 18", async function () {

    expect(await hardhatAbhishek.connect(addr1).name()).to.be.equal("AbhishekToken");
    expect(await hardhatAbhishek.connect(addr1).symbol()).to.be.equal("ABHI");
    expect(await hardhatAbhishek.connect(addr1).decimals()).to.be.equal(18);
    expect(await hardhatAbhishek.connect(addr1).tTotalFee()).to.be.equal(0);
   
  });

  it("Should transfer tokens to other account ", async function () {
    
    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(99);
       
    await expect(hardhatAbhishek.transfer(ethers.constants.AddressZero, 200)).to.be.revertedWith("You are sending Token to Zero address");
    await expect(hardhatAbhishek.connect(addr2).transfer(addr1.address, 1000)).to.be.revertedWith("You don't have Enough token to send");

    await hardhatAbhishek.excludeAccount(addr1.address);
    await hardhatAbhishek.transfer(addr1.address, BigNumber.from(10).pow(33))
    await hardhatAbhishek.reflectionFromToken(100000, true)
  });

   it("Should emit an event", async function () {
    
    await expect(hardhatAbhishek.connect(owner).transfer(addr1.address, 100))
    .to.emit(hardhatAbhishek, 'Transfer').withArgs(owner.address, addr1.address, 100);

    await expect(hardhatAbhishek.connect(owner).approve(addr1.address, 100))
    .to.emit(hardhatAbhishek, 'Approval').withArgs(owner.address, addr1.address, 100);


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

    await hardhatAbhishek.approve(addr1.address, 200);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(200);

    await hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 100);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(100);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(99);

    await expect(hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 200)).to.be.revertedWith("You don't have enough allownance to send")

  });

  it("Should show what is the Transfer amount will be", async function () {

    expect(await hardhatAbhishek.reflectionFromToken(1000, true)).to.equal(BigNumber.from("11463416834494303346933527515860102877473728020"));
    expect(await hardhatAbhishek.reflectionFromToken(1000, false)).to.equal(BigNumber.from("11579208923731619542357098500868790785326998000"));
    
    await expect(hardhatAbhishek.connect(addr1).reflectionFromToken(BigNumber.from(10).pow(40), false)).to.be.revertedWith("Your Token amount is Invalid")

  });

  it("Should Reflect their token", async function () {

    await hardhatAbhishek.transfer(addr1.address, 1000);

    await hardhatAbhishek.connect(addr1).reflect(100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(890);    
    
    await expect(hardhatAbhishek.connect(addr1).reflect(1000)).to.be.revertedWith("You don't have enough tokens");
  });
  
  it("Should show Excluded account", async function () {

    expect(await hardhatAbhishek.isExcludedAccount(addr1.address)).to.equal(false);
    
    await hardhatAbhishek.excludeAccount(addr1.address);
    expect(await hardhatAbhishek.isExcludedAccount(addr1.address)).to.equal(true);
        
  });

  it("Should Add Excluded account and include account", async function () {

    await hardhatAbhishek.transfer(addr1.address, 100);
    await hardhatAbhishek.excludeAccount(addr1.address);
    await expect(hardhatAbhishek.excludeAccount(addr1.address)).to.be.revertedWith("Account is already excluded");
    await expect(hardhatAbhishek.connect(addr2).excludeAccount(addr1.address)).to.be.revertedWith("You are not Owner");
    
    await hardhatAbhishek.excludeAccount(addr2.address);

    await hardhatAbhishek.includeAccount(addr2.address);
    await expect(hardhatAbhishek.includeAccount(addr2.address)).to.be.revertedWith("Account is not excluded");
    await expect(hardhatAbhishek.connect(addr2).includeAccount(addr1.address)).to.be.revertedWith("You are not Owner");

  });

  it("Should transfer token to excluded account", async function () {

    await hardhatAbhishek.excludeAccount(addr1.address);

    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(99);
    
  });

  it("Should transfer from Excluded account to normal account", async function () {

    await hardhatAbhishek.excludeAccount(addr1.address);
    await hardhatAbhishek.transfer(addr1.address, 1000);
    
    await hardhatAbhishek.connect(addr1).transfer(addr2.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(99);
    
  });

  it("Should transfer from Excluded account to Excluded account", async function () {

    await hardhatAbhishek.excludeAccount(addr1.address);
    await hardhatAbhishek.transfer(addr1.address, 1000);
    await hardhatAbhishek.excludeAccount(addr2.address);
    
    await hardhatAbhishek.connect(addr1).transfer(addr2.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(99);
    
  });

  it("Should Exclude account should not influence ", async function () {

    await hardhatAbhishek.excludeAccount(owner.address);
    await hardhatAbhishek.tokenFromReflection(10000000000);

  });

});
//await expect(tokenInstance.connect(<signer-account>).transfer(<addr-of-receipent>, <amount-BigNumber>))
//.to.emit(tokenInstance, 'Transfer').withArgs(<addr-of-signer-account>, <addr-of-receipent>, <amount-BigNumber>);
