const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');

const csv = require('csv-parser');
const fs = require('fs');

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

describe("supply", function () {

  let token;
  let ve_underlying;
  let ve;
  let owner;
  let minter;
  let ve_dist;
  let fetch;
  let wftm;
  let ethPair;
  let ethPairToken;
  let treasury;
  let gauge_address;
  let destributor;

  const ve_initial = ethers.BigNumber.from("1000000000000000000000");

  it("deploy base", async function () {
    [owner] = await ethers.getSigners(1);
    token = await ethers.getContractFactory("Token");
    basev1 = await ethers.getContractFactory("BaseV1");
    mim = await token.deploy('MIM', 'MIM', 18, owner.address);
    await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    ve_underlying = await basev1.deploy();
    vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address);
    await ve_underlying.mint(owner.address, ve_initial);
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
    const gauge_factory = await BaseV1Voter.deploy(
      ve.address,
      factory.address,
      gauges_factory.address,
      bribe_factory.address,
      gaugeWL.address
    );
    await gauge_factory.deployed();

    await gauge_factory.initialize([mim.address, ve_underlying.address],owner.address);
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);
    const VeDist = await ethers.getContractFactory("contracts/ve_dist.sol:ve_dist");
    ve_dist = await VeDist.deploy(ve.address);
    await ve_dist.deployed();
    await ve.setVoter(gauge_factory.address);

    const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");
    minter = await BaseV1Minter.deploy(
      gauge_factory.address,
      ve.address,
      ve_dist.address,
      10368000 // 120 days in seconds
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

    await ve_underlying.approve(gauge_factory.address, ethers.BigNumber.from("500000000000000000000000"));
    await gauge_factory.createGauge(pair);
    expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("995063075414519385"));
    expect(await ve_underlying.balanceOf(ve.address)).to.be.equal(ethers.BigNumber.from("1000000000000000000"));

    await gauge_factory.vote(1, [pair], [5000]);

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy();
    await treasury.deployed();

    const FetchFormula = await ethers.getContractFactory("FetchFormula");
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
      fetch_formula.address,
      0 // min lock time
    );

    gauge_address = await gauge_factory.gauges(pair);

    await fetch.deployed();

    GaugesRewardDestributor = await ethers.getContractFactory("GaugesRewardDestributor");

    destributor = await GaugesRewardDestributor.deploy(
      [gauge_address],
      [100]
    )

    destributor.deployed();

    await minter.initialize(
      fetch.address,
      0,
      destributor.address,
      owner.address, // should be vote locker
      owner.address // should be team wallet
    );

    expect(await fetch.dexRouter()).to.equal(router.address);

    const tokenLD = await ve_underlying.balanceOf(owner.address)
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

  it("Test supply", async function () {

    const week = 604800

    console.log("Supply before tests", Web3Utils.fromWei(String(await ve_underlying.totalSupply())))

    const row = []

    for(let i = 0; i < 7; i++){
      console.log(`Week ${i + 1}`,"_______________________________________________________________________________________")
      const supplyBefore = Number(Web3Utils.fromWei(String(await ve_underlying.totalSupply()))).toFixed(2)
      console.log(`Supply before`, supplyBefore)
      // increase time
      await network.provider.send("evm_increaseTime", [week])
      await network.provider.send("evm_mine")
      // console.log(`Weekly emmision`, Number(Web3Utils.fromWei(String(await minter.weekly_emission()))))
      // trigger minter
      await minter.update_period()
      const supplyAfter = Number(Web3Utils.fromWei(String(await ve_underlying.totalSupply()))).toFixed(2)
      console.log(`Supply after`, supplyAfter)
      console.log("_______________________________________________________________________________________")

      row.push(
        {
          week:i+1,
          supplyBefore,
          supplyAfter
        }
      )
    }

    const fs = require('fs')
    fs.writeFileSync('file.json', JSON.stringify(row));

    console.log("Supply after tests", Web3Utils.fromWei(String(await ve_underlying.totalSupply())))
  });

});
