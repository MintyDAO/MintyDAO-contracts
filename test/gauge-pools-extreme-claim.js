// claim ater 365 days works
// claim with set rescue formula works 

const { expect } = require("chai");
const { ethers } = require("hardhat");

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

describe("gauge-pools-big-delay-claim", function () {

  let token;
  let ve_underlying;
  let ve;
  let owner;
  let minter;
  let ve_dist;
  let gauge_address;
  let destributor;
  let rewardsLocker;
  let rewardsFormula;
  let gauge_factory;
  let pair;
  let votersRewardsRescue;

  it("deploy base", async function () {
    [owner] = await ethers.getSigners(1);
    token = await ethers.getContractFactory("Token");
    basev1 = await ethers.getContractFactory("BaseV1");
    mim = await token.deploy('MIM', 'MIM', 18, owner.address);
    await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000000000000"));
    ve_underlying = await basev1.deploy();
    vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address);
    await ve_underlying.mint(owner.address, ethers.BigNumber.from("10000000000000000000000000"));
    const BaseV1Factory = await ethers.getContractFactory("BaseV1Factory");
    factory = await BaseV1Factory.deploy();
    await factory.deployed();
    const BaseV1Router = await ethers.getContractFactory("BaseV1Router01");
    router = await BaseV1Router.deploy(factory.address, owner.address);
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
    gauge_factory = await BaseV1Voter.deploy(
      ve.address,
      factory.address,
      gauges_factory.address,
      bribe_factory.address,
      gaugeWL.address
    );
    await gauge_factory.deployed();


    await gauge_factory.initialize([mim.address, ve_underlying.address],owner.address);
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000000000"), 4 * 365 * 86400);

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

    pair = await router.pairFor(mim.address, ve_underlying.address, false);

    await ve_underlying.approve(gauge_factory.address, ethers.BigNumber.from("500000000000000000000000"));
    await gauge_factory.createGauge(pair);
    expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("995063075414519385"));

    await gauge_factory.vote(1, [pair], [5000]);

    gauge_address = await gauge_factory.gauges(pair);

    GaugesRewardDistributor = await ethers.getContractFactory("GaugesRewardDistributor");

    destributor = await GaugesRewardDistributor.deploy(
      [gauge_address],
      [100]
    )

    destributor.deployed();

    const RewardsLocker = await ethers.getContractFactory("VotersRewardsLock");
    rewardsLocker = await RewardsLocker.deploy(
      gauge_factory.address,
      ve_underlying.address
    );
    rewardsLocker.deployed();

    const RewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
    rewardsFormula = await RewardsFormula.deploy(
      gauge_factory.address,
      rewardsLocker.address,
      ve_underlying.address
    );
    rewardsFormula.deployed();

    await rewardsLocker.updateFormula(rewardsFormula.address)

    const VotersRewardsRescue = await ethers.getContractFactory("VotersRewardsRescue")
    votersRewardsRescue = await VotersRewardsRescue.deploy(
      rewardsLocker.address,
      ve_underlying.address
    )
    votersRewardsRescue.deployed();
  });

  it("initialize veNFT", async function () {
    await minter.initialize(
      owner.address,
      ethers.BigNumber.from("20000000000000000000000000"),
      destributor.address,
      rewardsLocker.address,
      owner.address // should be team wallet
    )
    await network.provider.send("evm_mine")
  });

  it("gauges can claim ", async function () {
    await minter.update_period();
    await network.provider.send("evm_increaseTime", [86400 * 365])
    await network.provider.send("evm_mine")
    await minter.update_period();

    expect(await ve_underlying.balanceOf(rewardsLocker.address)).to.be.above(0)
    expect(await ve_underlying.balanceOf(gauge_factory.address)).to.equal(0)

    const claimAmount = await rewardsFormula.computeRewards()

    console.log("Total weight ", Number(await gauge_factory.totalWeight() / 10**18))
    console.log("Total rewards ", Number(await ve_underlying.balanceOf(rewardsLocker.address) / 10**18))
    console.log("Allow to claim ", Number(claimAmount / 10**18))

    await rewardsLocker.destributeRewards()

    console.log("Claimed ", Number(await ve_underlying.balanceOf(gauge_factory.address) / 10**18))
    expect(await ve_underlying.balanceOf(gauge_factory.address)).to.equal(claimAmount)
  });

  it("platfom pools can claim ", async function () {
    expect(await ve_underlying.balanceOf(gauge_address)).to.equal(0)
    console.log("Platform pools rewards ", Number(await ve_underlying.balanceOf(destributor.address) / 10**18))
    await destributor.destribute(ve_underlying.address)
    console.log("Platform pools claimed ", Number(await ve_underlying.balanceOf(gauge_address) / 10**18))
    expect(await ve_underlying.balanceOf(gauge_address)).to.be.above(0)
  });

  it("Owner can rescue money by distribute by new formula if bug in old ", async function () {
    const claimAmount = await rewardsFormula.computeRewards()
    const totalRewards = await ve_underlying.balanceOf(rewardsLocker.address)
    await network.provider.send("evm_increaseTime", [86400 * 7])
    await network.provider.send("evm_mine")

    console.log("Total weight ", Number(await gauge_factory.totalWeight() / 10**18))
    console.log("Total rewards ", Number(totalRewards / 10**18))
    console.log("Allow to claim ", Number(claimAmount / 10**18))

    await rewardsLocker.updateFormula(votersRewardsRescue.address)

    await rewardsLocker.destributeRewards()
    expect(await ve_underlying.balanceOf(gauge_factory.address)).to.be.above(totalRewards)

    console.log("Claimed ", Number(await ve_underlying.balanceOf(gauge_factory.address) / 10**18))
  });

});
