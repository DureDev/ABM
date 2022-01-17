const { expect } = require("chai");
const { ethers } = require("hardhat");

function a() {
  return Math.floor((Math.random() * 21) + 1);
}

describe("DeluxLottery Contract", function () {

    let owner;
    let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11;

    beforeEach(async function () {
      [owner, addr1, addr2, addr3, addr4, addr5,
        addr6, addr7, addr8, addr9, addr10, addr11] = await ethers.getSigners();
        DeluxLottery = await ethers.getContractFactory("DeluxLottery");
      hardhatDeluxLottery = await DeluxLottery.deploy({
        value: ethers.utils.parseEther("500"),});
      await hardhatDeluxLottery.deployed();
  
    });

    it ("Should Reject Deployment if token amount is not satisfy", async function (){
      const [addr12] = await ethers.getSigners();
      DeluxLottery = await ethers.getContractFactory("DeluxLottery");
      await expect(DeluxLottery.deploy({
        value: ethers.utils.parseEther("0.00000000000001"),})).to.be.revertedWith("Please Deploy with atleast 100 Billon Token");
      //await hardhatDeluxLottery.deployed();
    })

    it("Should create new user and Give error msg for existing one", async function(){
        
        await hardhatDeluxLottery.connect(addr1).createNewUser();
        
        expect(await hardhatDeluxLottery.connect(addr1).userId(addr1.address)).to.deep.equal(0);
        
        expect(await hardhatDeluxLottery.connect(addr1).userLine(addr1.address)).to.deep.equal(3);

        expect(await hardhatDeluxLottery.connect(addr1).userOwnedTicket(addr1.address)).to.deep.equal(0);
    
        await expect(hardhatDeluxLottery.connect(addr1).createNewUser()).to.be.revertedWith("You already have an account");
    
    });

    it("Existing user Should buy new line and non existing user can't buy", async function(){
        
        await expect(hardhatDeluxLottery.connect(addr1).buyLine(2,{
            value: ethers.utils.parseEther('2'),})).to.be.revertedWith("You don't have an account please make one");
        
        await hardhatDeluxLottery.connect(addr1).createNewUser();

        await expect(hardhatDeluxLottery.connect(addr1).buyLine(1,{
            value: ethers.utils.parseEther('2'),})).to.be.revertedWith("Line Price is not equal");

        await expect(hardhatDeluxLottery.connect(addr1).buyLine(10,{
                value: ethers.utils.parseEther('10'),})).to.be.revertedWith("Only maximum 10 lines are allowed");
        
        await hardhatDeluxLottery.connect(addr1).buyLine(1,{
                    value: ethers.utils.parseEther('1'),});
        
        expect(await hardhatDeluxLottery.connect(addr1).userLine(addr1.address)).to.deep.equal(4);
                  
    });

  it("Should add Multiple People", async function () {

    await expect(hardhatDeluxLottery.connect(addr1).buyTicket(a(), a(), a(), a(), a(),{
        value: ethers.utils.parseEther('1'),})).to.be.revertedWith("You don't have enough line to fill");

    await hardhatDeluxLottery.connect(addr1).createNewUser();
    await hardhatDeluxLottery.connect(addr2).createNewUser();
    await hardhatDeluxLottery.connect(addr3).createNewUser();
    await hardhatDeluxLottery.connect(addr4).createNewUser();
    await hardhatDeluxLottery.connect(addr5).createNewUser();
    await hardhatDeluxLottery.connect(addr6).createNewUser();
    await hardhatDeluxLottery.connect(addr7).createNewUser();
    await hardhatDeluxLottery.connect(addr8).createNewUser();
    await hardhatDeluxLottery.connect(addr9).createNewUser();
    await hardhatDeluxLottery.connect(addr10).createNewUser();
    await hardhatDeluxLottery.connect(addr11).createNewUser();


    await expect(hardhatDeluxLottery.connect(addr1).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('0.1'),})).to.be.revertedWith("Lottery Price is not equal");
           
    await hardhatDeluxLottery.connect(addr1).buyTicket(a(), a(), a(), a(), a(),{
      value: ethers.utils.parseEther('1'),});

    expect(await hardhatDeluxLottery.connect(addr1).userOwnedTicket(addr1.address)).to.deep.equal(1);

    for(let i =0 ; i < 3; i++){
          await hardhatDeluxLottery.connect(addr2).buyTicket(a(), a(), a(), a(), a(),{
              value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr3).buyTicket(a(), a(), a(), a(), a(),{
                value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr4).buyTicket(a(), a(), a(), a(), a(),{
            value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr5).buyTicket(a(), a(), a(), a(), a(),{
              value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr6).buyTicket(a(), a(), a(), a(), a(),{
                value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr7).buyTicket(a(), a(), a(), a(), a(),{
            value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr8).buyTicket(a(), a(), a(), a(), a(),{
              value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr9).buyTicket(a(), a(), a(), a(), a(),{
                value: ethers.utils.parseEther('1'),});

          await hardhatDeluxLottery.connect(addr10).buyTicket(a(), a(), a(), a(), a(),{
            value: ethers.utils.parseEther('1'),});
    }
      
    expect(await hardhatDeluxLottery.players(0)).to.deep.include(addr1.address);    
    expect(await hardhatDeluxLottery.players(1)).to.deep.include(addr2.address);
    expect(await hardhatDeluxLottery.players(2)).to.deep.include(addr3.address);
    expect(await hardhatDeluxLottery.players(3)).to.deep.include(addr4.address);
    expect(await hardhatDeluxLottery.players(4)).to.deep.include(addr5.address);
    expect(await hardhatDeluxLottery.players(5)).to.deep.include(addr6.address);
    expect(await hardhatDeluxLottery.players(6)).to.deep.include(addr7.address);
    expect(await hardhatDeluxLottery.players(7)).to.deep.include(addr8.address);
    expect(await hardhatDeluxLottery.players(8)).to.deep.include(addr9.address);
    expect(await hardhatDeluxLottery.players(9)).to.deep.include(addr10.address);
    
    expect(await hardhatDeluxLottery.connect(addr10).getPlayers()).to.not.be.null;
  
    await hardhatDeluxLottery.connect(owner).pickWinner();

    expect(await hardhatDeluxLottery.connect(owner).getLastWinners()).to.not.be.null;

    expect(await hardhatDeluxLottery.connect(owner).getLastRandNumber()).to.not.be.null;

    expect(await hardhatDeluxLottery.connect(addr1).userOwnedTicket(addr1.address)).to.deep.equal(0);

  });

  it("Manager should Change linePrice and amount of buyTicket", async function () {
    
    await hardhatDeluxLottery.connect(owner).setLotteryTicket(ethers.utils.parseEther('0.020'));
    expect(await hardhatDeluxLottery.connect(owner).lotteryTicket()).to.equal(ethers.utils.parseEther('0.020'));

    await hardhatDeluxLottery.connect(owner).setLinePrice(ethers.utils.parseEther('0.020'));
    expect(await hardhatDeluxLottery.connect(owner).lotteryTicket()).to.equal(ethers.utils.parseEther('0.020'));
  
    await expect(hardhatDeluxLottery.connect(addr10).setLotteryTicket(ethers.utils.parseEther('2'))).to.be.revertedWith("You are not Manager");
    await expect(hardhatDeluxLottery.connect(addr10).setLinePrice(ethers.utils.parseEther('2'))).to.be.revertedWith("You are not Manager");
  
  });
  
 
 

});
/*

  function a() {
    a = Math.floor((Math.random() * 100) + 1);
    b = Math.floor((Math.random() * 100) + 1);
    c = Math.floor((Math.random() * 100) + 1);
    d = Math.floor((Math.random() * 100) + 1);
    e = Math.floor((Math.random() * 100) + 1);
    const f = {1, a, b, c, d, e};
    return f;
}
  
  
  }); */
