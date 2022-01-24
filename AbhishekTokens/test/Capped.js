const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Capped", function () { 
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("Capped");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000, 10000);
    await hardhatAbhishek.deployed();
  });

  it("Cap should be greater than zero", async function () {

    Abhishek = await ethers.getContractFactory("Capped");
    
    await expect(Abhishek.connect(addr1).deploy('AbhishekToken', 'ABHI', 18, 1000, 0)).to.be.revertedWith("Cap should be greater than 0");

        
  });

  it("Should show the cap of token", async function () {

    expect(await hardhatAbhishek._cap()).to.equal(10000);
    
  });

  it("Should mint token according to capp limit", async function () {

    
    await hardhatAbhishek.mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);

    await expect(hardhatAbhishek.mint(addr1.address, 3000000)).to.be.revertedWith("Mint amount willl excide Cap");
    
  });

  it("Admin should give Minter role or take the role", async function () {

    
    await hardhatAbhishek.giveMinterRole(addr1.address);
    await hardhatAbhishek.connect(addr1).mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);

    await hardhatAbhishek.takeRole(addr1.address);
    await expect(hardhatAbhishek.connect(addr1).mint(addr1.address, 30)).to.be.revertedWith("You don't have Miner role");
    
  });

  it("Admin should transfer his roll to other", async function () {
    
    await hardhatAbhishek.transferAdmineRole(addr1.address);
    await expect(hardhatAbhishek.giveMinterRole(addr1.address)).to.be.revertedWith("You don't have Admin role");
       
  });

    
});
