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
  let voter_gauge_factory;

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
    voter_gauge_factory = await BaseV1Voter.deploy(ve.address, factory.address, gauges_factory.address, bribe_factory.address);
    await voter_gauge_factory.deployed();


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
    await voter_gauge_factory.initialize([mim.address, ve_underlying.address], minter.address);

  });

  it("Can migrate", async function () {
    expect(await ve_dist.depositor()).to.be.equal(minter.address);
    expect(await ve_underlying.minter()).to.be.equal(minter.address);
    expect(await voter_gauge_factory.minter()).to.be.equal(minter.address);

    await minter.migrate(owner.address)

    expect(await ve_dist.depositor()).to.be.equal(owner.address);
    expect(await ve_underlying.minter()).to.be.equal(owner.address);
    expect(await voter_gauge_factory.minter()).to.be.equal(owner.address);
  });

});
