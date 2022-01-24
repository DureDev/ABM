const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Mintable", function () { 
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("Mintable");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000);
    await hardhatAbhishek.deployed();
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

  it("Should mint token ", async function () {

    
    await hardhatAbhishek.mint(addr1.address, 30);
    expect(await hardhatAbhishek.balanceOf(addr1.address)).to.equal(30);
        
  });

    
});
