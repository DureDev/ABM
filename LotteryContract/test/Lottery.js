const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

describe("Lottery", function () { 
  let owner;
  let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11;
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5,
      addr6, addr7, addr8, addr9, addr10, addr11] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    hardhatLottery = await Lottery.deploy();
    await hardhatLottery.deployed();

  });
  
  it("Should Multiple people buy ticket", async function () {
 
    await hardhatLottery.connect(owner).setMaxPlayers(10);
    expect(await hardhatLottery.getMaxPlayers()).to.equal(10);

    await expect(hardhatLottery.connect(addr1).buyTicket({
      value: ethers.utils.parseEther('0.020'),})).to.be.revertedWith("Lottery Price is not equal");
      
    await hardhatLottery.connect(addr1).buyTicket({
      value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr2).buyTicket({
        value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr3).buyTicket({
          value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr4).buyTicket({
      value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr5).buyTicket({
        value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr6).buyTicket({
          value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr7).buyTicket({
      value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr8).buyTicket({
        value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr9).buyTicket({
          value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(addr10).buyTicket({
      value: ethers.utils.parseEther('0.010'),});
      
    await expect(hardhatLottery.connect(addr11).buyTicket(
      {value: ethers.utils.parseEther('0.010')})).to.be.revertedWith("Max players are allotted");
    
    expect(await hardhatLottery.getPlayers()).to.include(addr1.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr2.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr3.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr4.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr5.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr6.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr7.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr8.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr9.address);
    expect(await hardhatLottery.getPlayers()).to.include(addr10.address);
  });

  it("Manager should Change maxPlayers and amount of buyTicket", async function () {
    
    await hardhatLottery.connect(owner).setMaxPlayers(12);
    expect(await hardhatLottery.getMaxPlayers()).to.equal(12);        

    await hardhatLottery.connect(owner).setLotteryTicket(ethers.utils.parseEther('0.020'));
    expect(await hardhatLottery.connect(owner).getLotteryTicketPrice()).to.equal(ethers.utils.parseEther('0.020'));

    await expect(hardhatLottery.connect(addr1).setMaxPlayers(13)).to.be.revertedWith("You are not Manager");
    await expect(hardhatLottery.connect(addr1).setLotteryTicket(ethers.utils.parseEther('0.020'))).to.be.revertedWith("You are not Manager");

  });

  it("Should Choose a winner", async function () {
    
    await expect(hardhatLottery.connect(owner).pickWinner()).to.be.revertedWith("Max player limit are not reached");

    await hardhatLottery.connect(owner).setMaxPlayers(1);
    expect(await hardhatLottery.getMaxPlayers()).to.equal(1);
   
    await hardhatLottery.connect(owner).buyTicket({
      value: ethers.utils.parseEther('0.010'),});

    await hardhatLottery.connect(owner).pickWinner();
    expect(await hardhatLottery.connect(owner).lastWinner()).to.equal(owner.address);
  });




});