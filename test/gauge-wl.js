const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;
const Web3Utils = require('web3-utils');

const minLockTime = 10368000 // 120 days in seconds

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

describe("Gauge WL", function () {

  let token;
  let ve_underlying;
  let ve;
  let owner;
  let minter;
  let ve_dist;
  let fetch_formula;
  let fetch;
  let wftm;
  let ethPair;
  let ethPairToken;
  let treasury;
  let gauge_address;
  let destributor;
  let operWallet;
  let voter_gauge_factory;
  let gaugeWL;
  let pair;

  it("deploy base gauge", async function () {
    [owner, secondAccount] = await ethers.getSigners(1);
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

    const GaugeWL = await ethers.getContractFactory("GaugeWhiteList");
    gaugeWL = await GaugeWL.deploy();
    await gaugeWL.deployed();

    const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
    voter_gauge_factory = await BaseV1Voter.deploy(
      ve.address,
      factory.address,
      gauges_factory.address,
      bribe_factory.address,
      gaugeWL.address
    );
    await voter_gauge_factory.deployed();

    // SKIPPED
    await voter_gauge_factory.initialize([mim.address, ve_underlying.address],owner.address);
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);
    // SKIPPED

    const VeDist = await ethers.getContractFactory("contracts/ve_dist.sol:ve_dist");
    ve_dist = await VeDist.deploy(ve.address);
    await ve_dist.deployed();
    await ve.setVoter(voter_gauge_factory.address);

    const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");
    minter = await BaseV1Minter.deploy(
      voter_gauge_factory.address,
      ve.address,
      ve_dist.address,
      10368000 // 120 days in seconds
    );
    await minter.deployed();
    await ve_dist.setDepositor(minter.address);
    await ve_underlying.setMinter(minter.address);

    // SKIPPED
    const mim_1 = ethers.BigNumber.from("1000000000000000000");
    const ve_underlying_1 = ethers.BigNumber.from("1000000000000000000");
    await ve_underlying.approve(router.address, ve_underlying_1);
    await mim.approve(router.address, mim_1);
    await router.addLiquidity(mim.address, ve_underlying.address, false, mim_1, ve_underlying_1, 0, 0, owner.address, Date.now());
    pair = await router.pairFor(mim.address, ve_underlying.address, false);
  });

  it("can not create gauge if one of tokens not in WL", async function () {
    await ve_underlying.approve(voter_gauge_factory.address, ethers.BigNumber.from("500000000000000000000000"));
    await expect(voter_gauge_factory.createGauge(pair))
       .to.be.revertedWith('!Gauge WhiteListed');
  })

  it("can create gauge if one of tokens in WL", async function () {
    await gaugeWL.addToken(ve_underlying.address)
    await voter_gauge_factory.createGauge(pair)
  })

  it("can remove token from WL", async function () {
    expect(await gaugeWL.isWhitelistedToken(ve_underlying.address)).to.be.equal(true);
    await gaugeWL.removeToken(ve_underlying.address)
    expect(await gaugeWL.isWhitelistedToken(ve_underlying.address)).to.be.equal(false);
  })

  it("can add pool to WL", async function () {
    expect(await gaugeWL.isWhitelistedPool(pair)).to.be.equal(false);
    await gaugeWL.addPool(pair)
    expect(await gaugeWL.isWhitelistedPool(pair)).to.be.equal(true);
  })

  it("can remove pool from WL", async function () {
    expect(await gaugeWL.isWhitelistedPool(pair)).to.be.equal(true);
    await gaugeWL.removePool(pair)
    expect(await gaugeWL.isWhitelistedPool(pair)).to.be.equal(false);
  })

  it("not owner can not add pool to WL", async function () {
    await gaugeWL.transferOwnership(gaugeWL.address)
    await expect(gaugeWL.addPool(pair))
       .to.be.revertedWith('Ownable: caller is not the owner');
  })

  it("not owner can not remove pool from WL", async function () {
    await expect(gaugeWL.removePool(pair))
       .to.be.revertedWith('Ownable: caller is not the owner');
  })

  it("not owner can not add token to WL", async function () {
    await expect(gaugeWL.addToken(ve_underlying.address))
       .to.be.revertedWith('Ownable: caller is not the owner');
  })

  it("not owner can not remove token from WL", async function () {
    await expect(gaugeWL.removeToken(ve_underlying.address))
       .to.be.revertedWith('Ownable: caller is not the owner');
  })
});
