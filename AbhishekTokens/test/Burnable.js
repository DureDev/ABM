const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Burnable", function () { 
  let owner;
  let addr1;
  let accounts;
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

   
    Abhishek = await ethers.getContractFactory("Burnable");
    
    hardhatAbhishek = await Abhishek.deploy('AbhishekToken', 'ABHI', 18, 1000);
    await hardhatAbhishek.deployed();
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
  
});
