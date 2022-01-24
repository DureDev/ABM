const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("DeflectionaryWithTax", function () { 
  let owner;
  let addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("AllMix");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000, 1200);
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
    
    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(96);

    await expect(hardhatAbhishek.connect(addr1).transfer(owner.address, 200)).to.be.revertedWith("You don't have enough balance to send");

  });

   it("Should emit an event", async function () {
    
    await expect(hardhatAbhishek.transfer(addr1.address, 100))
    .to.emit(hardhatAbhishek, 'Transfer').withArgs(owner.address, addr1.address, 96, 1, 1, 2);

    await expect(hardhatAbhishek.approve(addr1.address, 20))
    .to.emit(hardhatAbhishek, 'Approval').withArgs(owner.address, addr1.address, 20);


  });

  it("Main account should provide allowance and can increase it and decress it ", async function () {

    await hardhatAbhishek.approve(addr1.address, 20);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(20);

    await hardhatAbhishek.increaseAllowance(addr1.address, 30);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(50);

    await hardhatAbhishek.decreaseAllowance(addr1.address, 10);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(40);

    await expect(hardhatAbhishek.connect(addr1).approve(owner.address, 200)).to.be.revertedWith("You don't have enough token for allowance");
    await expect(hardhatAbhishek.connect(addr1).increaseAllowance(owner.address, 20)).to.be.revertedWith("You don't have enough token to give allowance to other");
  });

  it("Allowed user should spend his allowance not more than that", async function () {

    await hardhatAbhishek.approve(addr1.address, 300);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(300);

    await hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 200);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(100);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(192);

    await expect(hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 110)).to.be.revertedWith("You don't have enough allownance to send");

  });

  it("Tax account should get amounts", async function () {

    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(96);

    const taxAddr1 = await hardhatAbhishek.taxAddr1();
    expect(await hardhatAbhishek.balanceOf(taxAddr1)).to.be.equal(1);

    const taxAddr2 = await hardhatAbhishek.taxAddr2();
    expect(await hardhatAbhishek.balanceOf(taxAddr2)).to.be.equal(2);

  });

  it("User should able to burn their Tokens", async function () {

    await hardhatAbhishek.burn(30);
    expect(await hardhatAbhishek.balanceOf(owner.address)).to.equal(970);

    await hardhatAbhishek.approve(addr1.address, 30);
    await hardhatAbhishek.connect(addr1).burnFrom(owner.address, 10);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(20);

    await expect(hardhatAbhishek.connect(addr1).burnFrom(owner.address, 1000)).to.be.revertedWith("You don't have allowance to burn");
    await expect(hardhatAbhishek.burn(100000)).to.be.revertedWith("You don't have enough to burn");
  });

  it("Admin should give Minter role or take the role", async function () {

    
    await hardhatAbhishek.giveMinterRole(addr1.address);
    await hardhatAbhishek.connect(addr1).mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);

    await hardhatAbhishek.takeMinetRole(addr1.address);
    await expect(hardhatAbhishek.connect(addr1).mint(addr1.address, 30)).to.be.revertedWith("You don't have Miner role");
    
  });

  it("Admin should transfer his roll to other", async function () {
    
    await hardhatAbhishek.transferAdmineRole(addr1.address);
    await expect(hardhatAbhishek.giveMinterRole(addr1.address)).to.be.revertedWith("You don't have Admin role");
       
  });

  it("Cap should be greater than zero", async function () {

    Abhishek = await ethers.getContractFactory("AllMix");
    
    await expect(Abhishek.connect(addr1).deploy('AbhishekToken', 'ABHI', 18, 1000, 0)).to.be.revertedWith("Cap should be greater than 0");

        
  });

  it("Should show the cap of token", async function () {

    expect(await hardhatAbhishek._cap()).to.equal(1200);
    
  });

  it("Should mint token according to capp limit", async function () {

    
    await hardhatAbhishek.mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);

    await expect(hardhatAbhishek.mint(addr1.address, 3000000)).to.be.revertedWith("Mint amount willl excide Cap");
    
  });
 
  it("Admin should give Pause role or take the role", async function () {

    
    await hardhatAbhishek.givePauseRole(addr1.address);
    await hardhatAbhishek.connect(addr1).pauseSystem();
    await expect(hardhatAbhishek.pauseSystem()).to.be.revertedWith("System is already pause");

    await hardhatAbhishek.takePauserRole(addr1.address);
    await expect(hardhatAbhishek.connect(addr1).pauseSystem()).to.be.revertedWith("You don't have Pause role");
    
  });

  it("Pause role should pause and unpause the token", async function () {
    
    await expect(hardhatAbhishek.unpauseSystem()).to.be.revertedWith("System is already running");

    await hardhatAbhishek.pauseSystem();
    await expect(hardhatAbhishek.transfer(addr1.address, 100)).to.be.revertedWith("System is paused please sorry for inconvenience");
    
    await hardhatAbhishek.approve(addr1.address, 200);
    await expect(hardhatAbhishek.transferFrom(owner.address, addr2.address, 100)).to.be.revertedWith("System is paused please sorry for inconvenience");

    await hardhatAbhishek.unpauseSystem();
    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.be.equal(96);
  });

  it("Admin should give Minter role or take the role", async function () {

    
    await hardhatAbhishek.giveMinterRole(addr1.address);
    await hardhatAbhishek.connect(addr1).mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);

    await hardhatAbhishek.takeMinetRole(addr1.address);
    await expect(hardhatAbhishek.connect(addr1).mint(addr1.address, 30)).to.be.revertedWith("You don't have Miner role");
    
  });

  it("Admin should transfer his roll to other", async function () {
    
    await hardhatAbhishek.transferAdmineRole(addr1.address);
    await expect(hardhatAbhishek.giveMinterRole(addr1.address)).to.be.revertedWith("You don't have Admin role");
   
  });










  




});
