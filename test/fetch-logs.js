const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;
const Web3Utils = require('web3-utils');

const minLockTime = 0 // 120 days in seconds

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

describe("fetch-logs", function () {

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
  let newFetch;

  it("deploy base fetch", async function () {
    [owner, secondAccount] = await ethers.getSigners(1);
    token = await ethers.getContractFactory("Token");
    basev1 = await ethers.getContractFactory("BaseV1");

    ve_underlying = await basev1.deploy();
    vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address);
    await ve_underlying.mint(owner.address, ethers.BigNumber.from("500000000000000000000000"));
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
    const gaugeWL = await GaugeWL.deploy();
    await gaugeWL.deployed();

    await gaugeWL.disableVerification()

    const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
    const voter_gauge_factory = await BaseV1Voter.deploy(
      ve.address,
      factory.address,
      gauges_factory.address,
      bribe_factory.address,
      gaugeWL.address
    );
    await voter_gauge_factory.deployed();


    await voter_gauge_factory.initialize([ve_underlying.address],owner.address);
    // SKIPPED
    // await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    // await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);
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
    // await ve_underlying.approve(voter_gauge_factory.address, ethers.BigNumber.from("500000000000000000000000000"));
    // await voter_gauge_factory.createGauge(pair);
    // expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("995063075414519385"));
    // expect(await ve_underlying.balanceOf(ve.address)).to.be.equal(ethers.BigNumber.from("1000000000000000000"));
    //
    // await voter_gauge_factory.vote(1, [pair], [5000]);
    // gauge_address = await voter_gauge_factory.gauges(pair);
    // SKIPPED

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy()
    await treasury.deployed()

    const FetchFormula = await ethers.getContractFactory("FetchFormula");
    fetch_formula = await FetchFormula.deploy();
    await fetch_formula.deployed();

    const OperWallet = await ethers.getContractFactory("OperWallet");
    operWallet = await OperWallet.deploy(ve_underlying.address);
    await operWallet.deployed();

    const Fetch = await ethers.getContractFactory("Fetch");

    fetch = await Fetch.deploy(
      router.address,
      ve_underlying.address,
      operWallet.address,
      minter.address,
      ve.address,
      treasury.address,
      fetch_formula.address,
      minLockTime
    );

    const RewardsLocker = await ethers.getContractFactory("VotersRewardsLock");
    rewardsLocker = await RewardsLocker.deploy(
      voter_gauge_factory.address,
      ve_underlying.address
    );
    rewardsLocker.deployed();

    const RewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
    rewardsFormula = await RewardsFormula.deploy(
      voter_gauge_factory.address,
      rewardsLocker.address,
      ve_underlying.address
    );
    rewardsFormula.deployed();

    rewardsLocker.updateFormula(rewardsFormula.address)

    GaugesRewardDistributor = await ethers.getContractFactory("GaugesRewardDistributor");

    destributor = await GaugesRewardDistributor.deploy(
      [],
      []
    )

    destributor.deployed();

    await minter.initialize(
      fetch.address,
      0,
      destributor.address,
      rewardsLocker.address,
      operWallet.address
    );

    expect(await fetch.dexRouter()).to.equal(router.address);

    const tokenLD = "500000000000000000000000"
    const ethLD =   "250000000000000000"

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
  });


  it("logs", async function () {
    const userInput = ["0.1", "10", "0.1"]
    const timeLock = [15552000, 7776000, 31536000]

    for(let i = 0; i < userInput.length; i++) {
      const ethInput = Web3Utils.toWei(userInput[i])
      const before = Number(Web3Utils.fromWei(String(await ve_underlying.balanceOf(ve.address)))).toFixed(2)
      await fetch.convert(
        timeLock[i],
        1,
        {value:ethInput}
      )

      await router.swapExactFTMForTokens(
        1,
        [{
          from: wftm.address,
          to: ve_underlying.address,
          stable: false
        }],
        owner.address,
        1111111111111111,
        {value:ethInput}
      )

      const received = Number(Web3Utils.fromWei(String(await ve_underlying.balanceOf(ve.address)))).toFixed(2) - before

       console.log(
         "Tx",
         i + 1,
         "Input",
         userInput[i],
         "ETH",
         "Time lock",
         timeLock[i],
         "Received",
         Number(received).toFixed(2)
       )
     }
  });

});
