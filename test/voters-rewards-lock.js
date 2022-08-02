const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');


describe("gauges-reward-destribution", function () {

  let token;
  let voter;
  let rewardsFormula;
  let voterRewardsLock;


  it("deploy base", async function () {
    [owner] = await ethers.getSigners(1);

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy('MIM', 'MIM', 18, owner.address);
    await token.deployed();
    await token.mint(owner.address, "100000000000000000000");

    const VoterMock = await ethers.getContractFactory("voter_test");
    voter = await VoterMock.deploy();
    await voter.deployed();

    const VotersRewardsLock = await ethers.getContractFactory("VotersRewardsLock");
    voterRewardsLock = await VotersRewardsLock.deploy(voter.address, token.address);
    await voterRewardsLock.deployed();

    const VotersRewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
    rewardsFormula = await VotersRewardsFormula.deploy(
      voter.address,
      voterRewardsLock.address,
      token.address
    );
    await rewardsFormula.deployed();

    await voterRewardsLock.updateFormula(rewardsFormula.address)
  });


  it("Destribution", async function () {
    await token.transfer(voterRewardsLock.address, "1000000000000000000")
    expect(await voterRewardsLock.computeRewards()).to.be.equal(0)
    await voter.setTotalWeight(String(1000000000000000000 * 10))
    expect(await voterRewardsLock.computeRewards()).to.not.equal(0)
    await voterRewardsLock.destributeRewards()
  });
});
