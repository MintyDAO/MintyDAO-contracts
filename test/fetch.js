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

describe("fetch", function () {

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

  it("deploy base fetch", async function () {
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
    minter = await BaseV1Minter.deploy(voter_gauge_factory.address, ve.address, ve_dist.address);
    await minter.deployed();
    await ve_dist.setDepositor(minter.address);
    await ve_underlying.setMinter(minter.address);

    // SKIPPED
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
    // SKIPPED


    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy()
    await treasury.deployed()

    const FetchFormula = await ethers.getContractFactory("FetchFormulaMock");
    fetch_formula = await FetchFormula.deploy();
    await fetch_formula.deployed();

    const Fetch = await ethers.getContractFactory("Fetch");

    fetch = await Fetch.deploy(
      router.address,
      ve_underlying.address,
      owner.address,
      minter.address,
      ve.address,
      treasury.address,
      fetch_formula.address
    );

    await fetch.deployed();

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
      fetch.address,
      ethers.BigNumber.from("10000000000000000000"),
      destributor.address,
      rewardsLocker.address,
      owner.address
    );

    expect(await fetch.dexRouter()).to.equal(router.address);

    const tokenLD = "1000000000000000000"
    const ethLD = "1000000000000000000"

    // await network.provider.send("evm_mine")

    await ve_underlying.approve(router.address, tokenLD)

    await wftm.deposit({value:"1000000000000000000"})

    await router.addLiquidityFTM(
      ve_underlying.address,
      false,
      tokenLD,
      1,
      1,
      owner.address,
      Date.now(),
      { value:ethLD }
    )

    ethPair = await router.pairFor(
      wftm.address,
      ve_underlying.address,
      false
    );

    ethPairToken = await token.attach(
      ethPair
    );
  });


  it("Fetch can convert FTM for mint and lock ve NFT and add LD", async function () {
    const userInput = "100000000000000000"
    console.log("Total LD before fetch", Number(Web3Utils.fromWei(String(await ethPairToken.totalSupply()))))
    console.log("User NFT balance before fetch", Number(await ve.balanceOf(owner.address)))
    console.log("Treasury LD before fetch", Number(Web3Utils.fromWei(String(await ethPairToken.balanceOf(treasury.address)))))
    // await network.provider.send("evm_mine")
    await fetch.convert({value:userInput})
    // await network.provider.send("evm_mine")
    console.log("Total LD after fetch", Number(Web3Utils.fromWei(String(await ethPairToken.totalSupply()))))
    console.log("User NFT balance after fetch", Number(await ve.balanceOf(owner.address)))
    console.log("Treasury LD after fetch", Number(Web3Utils.fromWei(String(await ethPairToken.balanceOf(treasury.address)))))
  });


  it("Fetch can deposit with token", async function () {
    const userInput = "100000000000000000"
    console.log("User NFT balance before fetch", Number(await ve.balanceOf(owner.address)))
    // await network.provider.send("evm_mine")
    await ve_underlying.approve(fetch.address, userInput);
    await fetch.depositToken(userInput)
    // await network.provider.send("evm_mine")
    console.log("User NFT balance after fetch", Number(await ve.balanceOf(owner.address)))
  });

  it("Owner can update formula ", async function () {
    await fetch.updateFormula(fetch.address)
  });

});
