const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');

function getCreate2Address(
  factoryAddress,
  [tokenA, tokenB],
  bytecode
) {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const create2Inputs = [
    '0xff',
    factoryAddress,
    keccak256(solidityPack(['address', 'address'], [token0, token1])),
    keccak256(bytecode)
  ]
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
}

describe("Minter destribution", function () {
  const teamLockPeriod = 10368000

  let token;
  let ve_underlying;
  let ve;
  let owner;
  let minter;
  let ve_dist;
  let wftm;
  let ethPair;
  let ethPairToken;
  let treasury;
  let gauge_address;
  let destributor;
  let teamWallet;

  it("deploy core ", async function () {
    [owner] = await ethers.getSigners(1);
    token = await ethers.getContractFactory("Token");
    basev1 = await ethers.getContractFactory("BaseV1");

    // SKIPPED
    mim = await token.deploy('MIM', 'MIM', 18, owner.address);
    await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    // SKIPPED

    ve_underlying = await basev1.deploy();
    vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address);
    await ve_underlying.mint(owner.address, ethers.BigNumber.from("10000000000000000000000000"));
    const BaseV1Factory = await ethers.getContractFactory("BaseV1Factory");
    factory = await BaseV1Factory.deploy();
    await factory.deployed();
    const WETH9 = await ethers.getContractFactory("WETH9");
    wftm = await WETH9.deploy()
    await wftm.deployed()
    const BaseV1Router = await ethers.getContractFactory("BaseV1Router01");
    router = await BaseV1Router.deploy(factory.address, wftm.address);
    await router.deployed();
    const BaseV1GaugeFactory = await ethers.getContractFactory("BaseV1GaugeFactory");
    gauges_factory = await BaseV1GaugeFactory.deploy();
    await gauges_factory.deployed();
    const BaseV1BribeFactory = await ethers.getContractFactory("BaseV1BribeFactory");
    const bribe_factory = await BaseV1BribeFactory.deploy();
    await bribe_factory.deployed();
    const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
    const voter_gauge_factory = await BaseV1Voter.deploy(ve.address, factory.address, gauges_factory.address, bribe_factory.address);
    await voter_gauge_factory.deployed();

    await voter_gauge_factory.initialize([mim.address, ve_underlying.address],owner.address);
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);

    const VeDist = await ethers.getContractFactory("contracts/ve_dist.sol:ve_dist");
    ve_dist = await VeDist.deploy(ve.address);
    await ve_dist.deployed();
    await ve.setVoter(voter_gauge_factory.address);

    const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");
    minter = await BaseV1Minter.deploy(
      voter_gauge_factory.address,
      ve.address,
      ve_dist.address,
      teamLockPeriod // 120 days in seconds
    );
    await minter.deployed();
    await ve_dist.setDepositor(minter.address);
    await ve_underlying.setMinter(minter.address);

    const mim_1 = ethers.BigNumber.from("1000000000000000000");
    const ve_underlying_1 = ethers.BigNumber.from("1000000000000000000");
    await ve_underlying.approve(router.address, ve_underlying_1);
    await mim.approve(router.address, mim_1);
    await router.addLiquidity(mim.address, ve_underlying.address, false, mim_1, ve_underlying_1, 0, 0, owner.address, Date.now());

    const pair = await router.pairFor(mim.address, ve_underlying.address, false);

    await ve_underlying.approve(voter_gauge_factory.address, ethers.BigNumber.from("500000000000000000000000"));
    await voter_gauge_factory.createGauge(pair);
    expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("995063075414519385"));
    expect(await ve_underlying.balanceOf(ve.address)).to.be.equal(ethers.BigNumber.from("1000000000000000000"));

    await voter_gauge_factory.vote(1, [pair], [5000]);
    gauge_address = await voter_gauge_factory.gauges(pair);


    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy()
    await treasury.deployed()

    const TeamWallet = await ethers.getContractFactory("TeamWallet");
    teamWallet = await TeamWallet.deploy(ve_underlying.address);
    await teamWallet.deployed();


    const RewardsLocker = await ethers.getContractFactory("VotersRewardsLock");
    rewardsLocker = await RewardsLocker.deploy(
      voter_gauge_factory.address,
      ve_underlying.address
    );
    rewardsLocker.deployed();

    const RewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
    rewardsFormula = await RewardsFormula.deploy(
      ve.address,
      rewardsLocker.address,
      ve_underlying.address
    );
    rewardsFormula.deployed();

    rewardsLocker.updateFormula(rewardsFormula.address)

    GaugesRewardDestributor = await ethers.getContractFactory("GaugesRewardDestributor");

    destributor = await GaugesRewardDestributor.deploy(
      [gauge_address],
      [100]
    )

    destributor.deployed();

    await minter.initialize(
      owner.address,  // should be fetch
      ethers.BigNumber.from("10000000000000000000"),
      destributor.address,
      rewardsLocker.address,
      teamWallet.address
    );

  });

  it("First destribution team wallet should not receive, 0x should", async function () {
    expect(await ve_underlying.balanceOf(destributor.address)).to.be.equal(0);
    expect(await ve_underlying.balanceOf(rewardsLocker.address)).to.be.equal(0);
    expect(await ve_underlying.balanceOf(teamWallet.address)).to.be.equal(0);
    expect(await ve_underlying.balanceOf("0x0000000000000000000000000000000000000000")).to.be.equal(0);

    await network.provider.send("evm_increaseTime", [86400 * 21])

    await minter.update_period()

    expect(await ve_underlying.balanceOf(destributor.address)).to.not.equal(0);
    expect(await ve_underlying.balanceOf(rewardsLocker.address)).to.not.equal(0);
    expect(await ve_underlying.balanceOf("0x0000000000000000000000000000000000000000")).to.not.equal(0);

    // team wallet should not receive any tokens yet
    expect(await ve_underlying.balanceOf(teamWallet.address)).to.be.equal(0);
  });


  it("Second destribution after increase time team wallet should receive, 0x should not", async function () {

    const zerroBalanceBefore = await ve_underlying.balanceOf("0x0000000000000000000000000000000000000000")

    await network.provider.send("evm_increaseTime", [teamLockPeriod])

    await minter.update_period()

    expect(await ve_underlying.balanceOf(destributor.address)).to.not.equal(0);
    expect(await ve_underlying.balanceOf(rewardsLocker.address)).to.not.equal(0);

    // zerro should not
    expect(await ve_underlying.balanceOf("0x0000000000000000000000000000000000000000")).to.be.equal(zerroBalanceBefore);

    // team wallet should receive now
    expect(await ve_underlying.balanceOf(teamWallet.address)).to.not.equal(0);
  });
});
