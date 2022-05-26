const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');


describe("gauges-reward-destribution", function () {

  let token;
  let gauge_1;
  let gauge_2;
  let gauge_3;
  let destributor;

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

    GaugesRewardDestributor = await ethers.getContractFactory("GaugesRewardDestributor");

    destributor = await GaugesRewardDestributor.deploy(
      [gauge_1.address, gauge_2.address, gauge_3.address],
      [20,30,50]
    )

    destributor.deployed();

    expect(await destributor.totalShares()).to.be.equal(100);
  });


  it("Destribution", async function () {
    await token.transfer(destributor.address, "1000000000000000000")
    await destributor.destribute(token.address)

    expect(await token.balanceOf(gauge_1.address)).to.be.equal("200000000000000000");
    expect(await token.balanceOf(gauge_2.address)).to.be.equal("300000000000000000");
    expect(await token.balanceOf(gauge_3.address)).to.be.equal("500000000000000000");
  });

  it("Update destribution shares", async function () {
    await destributor.update([gauge_1.address, gauge_2.address], [100, 100])
    expect(await destributor.totalShares()).to.be.equal(200);
  });
});
