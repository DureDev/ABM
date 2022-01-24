const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Puseable", function () { 
  let owner;
  let addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("Pauseable");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000);
    await hardhatAbhishek.deployed();
  });
    
  it("Admin should give Pause role or take the role", async function () {

    
    await hardhatAbhishek.givePauseRole(addr1.address);
    await hardhatAbhishek.connect(addr1).pauseSystem();
    await expect(hardhatAbhishek.pauseSystem()).to.be.revertedWith("System is already pause");

    await hardhatAbhishek.takeRole(addr1.address);
    await expect(hardhatAbhishek.connect(addr1).pauseSystem()).to.be.revertedWith("You don't have Pause role");
    
  });

  it("Admin should transfer his roll to other", async function () {
    
    await hardhatAbhishek.transferAdmineRole(addr1.address);
    await expect(hardhatAbhishek.givePauseRole(addr1.address)).to.be.revertedWith("You don't have Admin role");
       
  });

  it("Pause role should pause and unpause the token", async function () {
    
    await expect(hardhatAbhishek.unpauseSystem()).to.be.revertedWith("System is already running");

    await hardhatAbhishek.pauseSystem();
    await expect(hardhatAbhishek.transfer(addr1.address, 100)).to.be.revertedWith("System is paused please sorry for inconvenience");
    
    await hardhatAbhishek.approve(addr1.address, 200);
    await expect(hardhatAbhishek.transferFrom(owner.address, addr2.address, 100)).to.be.revertedWith("System is paused please sorry for inconvenience");

    await hardhatAbhishek.unpauseSystem();
    await hardhatAbhishek.transfer(addr1.address, 100);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.be.equal(100);
  });

  it("Allowed user should spend his allowance not more than that when unpaused", async function () {

    await hardhatAbhishek.approve(addr1.address, 30);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(30);

    await hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 20);
    expect(await hardhatAbhishek.allowance(owner.address, addr1.address)).to.equal(10);
    expect(await hardhatAbhishek.balanceOf(addr2.address)).to.equal(20);

    await expect(hardhatAbhishek.connect(addr1).transferFrom(owner.address, addr2.address, 20)).to.be.revertedWith("You don't have enough allownance to send")
    await expect(hardhatAbhishek.connect(addr1).transfer(addr2.address, 20)).to.be.revertedWith("You don't have enough balance to send")

  });
    
});
