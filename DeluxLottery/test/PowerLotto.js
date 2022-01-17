const { expect } = require("chai");
const { ethers } = require("hardhat");



function a() {
  return Math.floor((Math.random() * 21) + 1);
}

describe("PowerLotto Contract", function () {

    let owner;
    let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11;

    beforeEach(async function () {
      [owner, addr1, addr2, addr3, addr4, addr5,
        addr6, addr7, addr8, addr9, addr10, addr11] = await ethers.getSigners();
        PowerLotto = await ethers.getContractFactory("PowerLotto");
      hardhatPowerLotto = await PowerLotto.deploy({
        value: ethers.utils.parseEther("500"),});
      await hardhatPowerLotto.deployed();
  
    });

    it ("Should Reject Deployment if token amount is not satisfy", async function (){
      const [addr12] = await ethers.getSigners();
      PowerLotto = await ethers.getContractFactory("PowerLotto");
      await expect(PowerLotto.deploy({
        value: ethers.utils.parseEther("0.00000000000001"),})).to.be.revertedWith("Please Deploy with atleast 100 Billon Token");
      //await hardhatPowerLotto.deployed();
    })

    it("Should create new user and Give error msg for existing one", async function(){
        
        await hardhatPowerLotto.connect(addr1).createNewUser();
        
        expect(await hardhatPowerLotto.connect(addr1).userId(addr1.address)).to.deep.equal(0);
        
        expect(await hardhatPowerLotto.connect(addr1).userLine(addr1.address)).to.deep.equal(3);

        expect(await hardhatPowerLotto.connect(addr1).userOwnedTicket(addr1.address)).to.deep.equal(0);
    
        await expect(hardhatPowerLotto.connect(addr1).createNewUser()).to.be.revertedWith("You already have an account");
    
    });

    it("Existing user Should buy new line and non existing user can't buy", async function(){
        
        await expect(hardhatPowerLotto.connect(addr1).buyLine(2,{
            value: ethers.utils.parseEther('2'),})).to.be.revertedWith("You don't have an account please make one");
        
        await hardhatPowerLotto.connect(addr1).createNewUser();

        await expect(hardhatPowerLotto.connect(addr1).buyLine(1,{
            value: ethers.utils.parseEther('2'),})).to.be.revertedWith("Line Price is not equal");

        await expect(hardhatPowerLotto.connect(addr1).buyLine(10,{
                value: ethers.utils.parseEther('10'),})).to.be.revertedWith("Only maximum 10 lines are allowed");
        
        await hardhatPowerLotto.connect(addr1).buyLine(1,{
                    value: ethers.utils.parseEther('1'),});
        
        expect(await hardhatPowerLotto.connect(addr1).userLine(addr1.address)).to.deep.equal(4);
                  
    });

  it("Should add Multiple People", async function () {

    await expect(hardhatPowerLotto.connect(addr1).buyTicket(a(), a(), a(), a(), a(), a(), {
        value: ethers.utils.parseEther('1'),})).to.be.revertedWith("You don't have enough line to fill");

    await hardhatPowerLotto.connect(addr1).createNewUser();
    await hardhatPowerLotto.connect(addr2).createNewUser();
    await hardhatPowerLotto.connect(addr3).createNewUser();
    await hardhatPowerLotto.connect(addr4).createNewUser();
    await hardhatPowerLotto.connect(addr5).createNewUser();
    await hardhatPowerLotto.connect(addr6).createNewUser();
    await hardhatPowerLotto.connect(addr7).createNewUser();
    await hardhatPowerLotto.connect(addr8).createNewUser();
    await hardhatPowerLotto.connect(addr9).createNewUser();
    await hardhatPowerLotto.connect(addr10).createNewUser();
    await hardhatPowerLotto.connect(addr11).createNewUser();


    await expect(hardhatPowerLotto.connect(addr1).buyTicket(a(), a(), a(), a(), a(), a(), {
      value: ethers.utils.parseEther('0.1'),})).to.be.revertedWith("Lottery Price is not equal");
           
    for (let k = 0 ; k < 5 ; k++) {
    for(let i =0 ; i < 3; i++){

          await hardhatPowerLotto.connect(addr1).buyTicket(a(), a(), a(), a(), a(), a(), {
            value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr2).buyTicket(a(), a(), a(), a(), a(), a(), {
              value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr3).buyTicket(a(), a(), a(), a(), a(), a(), {
                value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr4).buyTicket(a(), a(), a(), a(), a(), a(), { 
            value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr5).buyTicket(a(), a(), a(), a(), a(), a(), {
              value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr6).buyTicket(a(), a(), a(), a(), a(), a(), {
                value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr7).buyTicket(a(), a(), a(), a(), a(), a(), {
            value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr8).buyTicket(a(), a(), a(), a(), a(), a(), {
              value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr9).buyTicket(a(), a(), a(), a(), a(), a(), {
                value: ethers.utils.parseEther('1'),});

          await hardhatPowerLotto.connect(addr10).buyTicket(a(), a(), a(), a(), a(), a(), {
            value: ethers.utils.parseEther('1'),});
    }
      
    expect(await hardhatPowerLotto.players(0)).to.deep.include(addr1.address);    
    expect(await hardhatPowerLotto.players(1)).to.deep.include(addr2.address);
    expect(await hardhatPowerLotto.players(2)).to.deep.include(addr3.address);
    expect(await hardhatPowerLotto.players(3)).to.deep.include(addr4.address);
    expect(await hardhatPowerLotto.players(4)).to.deep.include(addr5.address);
    expect(await hardhatPowerLotto.players(5)).to.deep.include(addr6.address);
    expect(await hardhatPowerLotto.players(6)).to.deep.include(addr7.address);
    expect(await hardhatPowerLotto.players(7)).to.deep.include(addr8.address);
    expect(await hardhatPowerLotto.players(8)).to.deep.include(addr9.address);
    expect(await hardhatPowerLotto.players(9)).to.deep.include(addr10.address);
    
      
    await hardhatPowerLotto.connect(owner).pickWinner();

    await expect( hardhatPowerLotto.connect(owner).getLastWinners()).to.not.be.null;

    expect(await hardhatPowerLotto.connect(addr1).userOwnedTicket(addr1.address)).to.deep.equal(0);
    }
  });

  it("Manager should Change linePrice and amount of buyTicket", async function () {
    
    await hardhatPowerLotto.connect(owner).setLotteryTicket(ethers.utils.parseEther('0.020'));
    expect(await hardhatPowerLotto.connect(owner).lotteryTicket()).to.equal(ethers.utils.parseEther('0.020'));

    await hardhatPowerLotto.connect(owner).setLinePrice(ethers.utils.parseEther('0.020'));
    expect(await hardhatPowerLotto.connect(owner).lotteryTicket()).to.equal(ethers.utils.parseEther('0.020'));
  
    await expect(hardhatPowerLotto.connect(addr10).setLotteryTicket(ethers.utils.parseEther('2'))).to.be.revertedWith("You are not Manager");
    await expect(hardhatPowerLotto.connect(addr10).setLinePrice(ethers.utils.parseEther('2'))).to.be.revertedWith("You are not Manager");
  
  });
  
 
 

});

