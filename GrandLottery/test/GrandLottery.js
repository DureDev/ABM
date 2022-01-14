const { expect } = require("chai");
const { ethers } = require("hardhat");

function a() {
  return Math.floor((Math.random() * 100) + 1);
}

describe("GrandLottery Contract", function () {

    let owner;
    let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11;

    beforeEach(async function () {
      [owner, addr1, addr2, addr3, addr4, addr5,
        addr6, addr7, addr8, addr9, addr10, addr11] = await ethers.getSigners();
      GrandLottery = await ethers.getContractFactory("GrandLottery");
      hardhatGrandLottery = await GrandLottery.deploy({
        value: ethers.utils.parseEther("500"),});
      await hardhatGrandLottery.deployed();
  
    });

  it("Should add Multiple People", async function () {

    await hardhatGrandLottery.connect(owner).setMaxPlayers(10);
    expect(await hardhatGrandLottery.maxPlayers()).to.equal(10);

    await expect(hardhatGrandLottery.connect(addr1).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('0.1'),})).to.be.revertedWith("Lottery Price is not equal");
      
    await hardhatGrandLottery.connect(addr1).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr2).buyTicket(a(), a(), a(), a(), a(),{
        value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr3).buyTicket(a(), a(), a(), a(), a(),{
          value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr4).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr5).buyTicket(a(), a(), a(), a(), a(),{
        value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr6).buyTicket(a(), a(), a(), a(), a(),{
          value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr7).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr8).buyTicket(a(), a(), a(), a(), a(),{
        value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr9).buyTicket(a(), a(), a(), a(), a(),{
          value: ethers.utils.parseEther('1'),});

    await hardhatGrandLottery.connect(addr10).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('1'),});
      
    await expect(hardhatGrandLottery.connect(addr11).buyTicket(a(), a(), a(), a(), a(),
      {value: ethers.utils.parseEther('1')})).to.be.revertedWith("Max players are allotted");
    
    expect(await hardhatGrandLottery.players(0)).to.deep.include(addr1.address);
    expect(await hardhatGrandLottery.players(1)).to.deep.include(addr2.address);
    expect(await hardhatGrandLottery.players(2)).to.deep.include(addr3.address);
    expect(await hardhatGrandLottery.players(3)).to.deep.include(addr4.address);
    expect(await hardhatGrandLottery.players(4)).to.deep.include(addr5.address);
    expect(await hardhatGrandLottery.players(5)).to.deep.include(addr6.address);
    expect(await hardhatGrandLottery.players(6)).to.deep.include(addr7.address);
    expect(await hardhatGrandLottery.players(7)).to.deep.include(addr8.address);
    expect(await hardhatGrandLottery.players(8)).to.deep.include(addr9.address);
    expect(await hardhatGrandLottery.players(9)).to.deep.include(addr10.address);

    expect(await hardhatGrandLottery.connect(addr10).getPlayers()).to.not.be.null;
  
    await hardhatGrandLottery.connect(owner).pickWinner();

    expect(await hardhatGrandLottery.connect(owner).getLastWinners()).to.not.be.null;

  });

  it("Manager should Change maxPlayers and amount of buyTicket", async function () {
    
    await hardhatGrandLottery.connect(owner).setMaxPlayers(12);
    expect(await hardhatGrandLottery.maxPlayers()).to.equal(12);        
  
    await hardhatGrandLottery.connect(owner).setLotteryTicket(ethers.utils.parseEther('0.020'));
    expect(await hardhatGrandLottery.connect(owner).lotteryTicket()).to.equal(ethers.utils.parseEther('0.020'));
  
    await expect(hardhatGrandLottery.connect(addr10).setMaxPlayers(13)).to.be.revertedWith("You are not Manager");
    await expect(hardhatGrandLottery.connect(addr10).setLotteryTicket(ethers.utils.parseEther('2'))).to.be.revertedWith("You are not Manager");
  
  });
  
 
 

});
/*


  it("Should add Multiple People", async function () {
    const [owner] = await ethers.getSigners();
    const GrandLottery = await ethers.getContractFactory("GrandLottery");
    expect(await GrandLottery.deploy()).to.be.revertWith("Please Deploy with atleast 100 Billon Token");
    await hardhatGrandLottery.deployed();
  }); */
