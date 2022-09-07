const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');


describe("gauges-reward-destribution", function () {

  let token;
  let gauge_1;
  let gauge_2;
  let gauge_3;
  let distributor;

  it("deploy base", async function () {
    [owner] = await ethers.getSigners(1);

    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy('MIM', 'MIM', 18, owner.address);
    await token.mint(owner.address, "100000000000000000000");

    GaugeMockTransfer = await ethers.getContractFactory("GaugeMockTransfer");

    gauge_1 = await GaugeMockTransfer.deploy();
    await gauge_1.deployed();

    gauge_2 = await GaugeMockTransfer.deploy();
    await gauge_2.deployed();

    gauge_3 = await GaugeMockTransfer.deploy();
    await gauge_3.deployed();

    GaugesRewardDistributor = await ethers.getContractFactory("GaugesRewardDistributor");

    distributor = await GaugesRewardDistributor.deploy(
      [gauge_1.address, gauge_2.address, gauge_3.address],
      [20,30,50]
    )

    distributor.deployed();

    expect(await distributor.totalShares()).to.be.equal(100);
  });


  it("Destribution", async function () {
    await token.transfer(distributor.address, "1000000000000000000")
    await distributor.destribute(token.address)

    expect(await token.balanceOf(gauge_1.address)).to.be.equal("200000000000000000");
    expect(await token.balanceOf(gauge_2.address)).to.be.equal("300000000000000000");
    expect(await token.balanceOf(gauge_3.address)).to.be.equal("500000000000000000");
  });

  it("Update destribution shares", async function () {
    await distributor.update([gauge_1.address, gauge_2.address], [100, 100])
    expect(await distributor.totalShares()).to.be.equal(200);
    expect(await distributor.totalGauges()).to.be.equal(2);
  });

  it("Owner can not set wrong shares length", async function () {
    await expect(distributor.update([gauge_1.address, gauge_2.address], [100, 100, 100]))
       .to.be.revertedWith('Wrong length');
  });

  it("Not owner can not update destribution shares", async function () {
    await distributor.transferOwnership(distributor.address)
    await expect(distributor.update([gauge_1.address, gauge_2.address], [100, 100]))
       .to.be.revertedWith('Ownable: caller is not the owner');
  });
});
