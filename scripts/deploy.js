const { ethers } = require("hardhat");

const initialYMeta = "1000000000000000000000000"
const ldYmeta = "1000000000000000000000000"
const ldETH = "100000000000000000"
const WRAPPED_ETH = null
const teamLockTime = 10368000 // 120 days in seconds
const fetchMinTime = 604800 // 7 days


async function main() {
  const [_owner] = await ethers.getSigners(1);
  const owner = _owner.address;
  let wrappedETH

  const Token = await ethers.getContractFactory("BaseV1");
  const Gauges = await ethers.getContractFactory("BaseV1GaugeFactory");
  const Bribes = await ethers.getContractFactory("BaseV1BribeFactory");
  const Core = await ethers.getContractFactory("BaseV1Factory");
  const WETH9 = await ethers.getContractFactory("WETH9");
  const Router = await ethers.getContractFactory("BaseV1Router01");
  const Ve = await ethers.getContractFactory("contracts/ve.sol:ve");
  const Ve_dist = await ethers.getContractFactory("contracts/ve_dist.sol:ve_dist");
  const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
  const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");
  const Treasury = await ethers.getContractFactory("Treasury");
  const FetchFormula = await ethers.getContractFactory("FetchFormula");
  const Fetch = await ethers.getContractFactory("Fetch");
  const RewardsLocker = await ethers.getContractFactory("VotersRewardsLock");
  const RewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
  const GaugesRewardDistributor = await ethers.getContractFactory("GaugesRewardDistributor");
  const Library = await ethers.getContractFactory("solidly_library");
  const TeamWallet = await ethers.getContractFactory("TeamWallet");
  const GaugeWL = await ethers.getContractFactory("GaugeWhiteList");

  console.log("Admin ", owner)

  const token = await Token.deploy();
  await token.deployed();
  console.log("MintyDAO ", token.address)

  // pre mint some for add LD to yMeta/ETH pool
  await token.mint(owner, ldYmeta);
  console.log("call mint")

  const gauges = await Gauges.deploy();
  await gauges.deployed();
  console.log("gauges ", gauges.address)

  const bribes = await Bribes.deploy();
  await bribes.deployed();
  console.log("bribes ", bribes.address)


  const core = await Core.deploy();
  await core.deployed();
  console.log("factory ", core.address)


  if(!WRAPPED_ETH){
    const weth = await WETH9.deploy();
    await weth.deployed();
    wrappedETH = weth.address
  }else{
    wrappedETH = WRAPPED_ETH
  }
  console.log("weth ", wrappedETH)


  const router = await Router.deploy(core.address, wrappedETH);
  await router.deployed();
  console.log("router ", router.address)


  const library = await Library.deploy(router.address)
  await library.deployed();
  console.log("library ", library.address)


  const ve = await Ve.deploy(token.address);
  await ve.deployed();
  console.log("ve ", ve.address)


  const ve_dist = await Ve_dist.deploy(ve.address);
  await ve_dist.deployed();
  console.log("ve_dist ", ve_dist.address)


  const gaugeWL = await GaugeWL.deploy();
  await gaugeWL.deployed();
  console.log("gaugeWL ", gaugeWL.address)

  await gaugeWL.addToken(token.address)
  console.log("Call ADD token")

  const voter = await BaseV1Voter.deploy(
    ve.address,
    core.address,
    gauges.address,
    bribes.address,
    gaugeWL.address
  );
  await voter.deployed();
  console.log("voter ", voter.address)

  const minter = await BaseV1Minter.deploy(voter.address, ve.address, ve_dist.address, teamLockTime);
  await minter.deployed();
  console.log("minter ", minter.address)

  await token.setMinter(minter.address);
  console.log("call setMinter")

  await ve.setVoter(voter.address);
  console.log("call setVoter")

  await ve_dist.setDepositor(minter.address);
  console.log("call setDepositor")

  await voter.initialize([token.address, wrappedETH], minter.address);
  console.log("call initialize")

  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log("treasury ", treasury.address)

  const teamWallet = await TeamWallet.deploy(
    token.address
  )
  await teamWallet.deployed();
  console.log("teamWallet", teamWallet.address)


  const fetch_formula = await FetchFormula.deploy();
  await fetch_formula.deployed();
  console.log("fetch_formula ", fetch_formula.address)


  const fetch = await Fetch.deploy(
    router.address,
    token.address,
    teamWallet.address,
    minter.address,
    ve.address,
    treasury.address,
    fetch_formula.address,
    fetchMinTime
  );
  await fetch.deployed();
  console.log("fetch ", fetch.address)


  const rewardsLocker = await RewardsLocker.deploy(
    voter.address,
    token.address
  );

  await rewardsLocker.deployed();
  console.log("rewardsLocker ", rewardsLocker.address)

  const rewardsFormula = await RewardsFormula.deploy(
    ve.address,
    rewardsLocker.address,
    token.address
  );

  await rewardsFormula.deployed();
  console.log("rewardsFormula ", rewardsFormula.address)

  await rewardsLocker.updateFormula(rewardsFormula.address);
  console.log("call updateFormula")


  await core.createPair(token.address, wrappedETH, false)

  console.log("call updateFormula")

  await router.createPair(token.address, wrappedETH, false)
  console.log("call createPair")

  const pair = await router.pairFor(token.address, wrappedETH, false)
  console.log("pair ", pair)

  await voter.createGauge(pair);
  console.log("call createGauge")


  // await voter.vote(1, [pair], [5000]);
  gauge_address = await voter.gauges(pair);
  console.log("gauge_address ", gauge_address)

  const destributor = await GaugesRewardDistributor.deploy(
    [gauge_address],
    [100]
  )
  await destributor.deployed();
  console.log("destributor", destributor.address)


  await minter.initialize(
    fetch.address,
    initialYMeta,
    destributor.address,
    rewardsLocker.address,
    teamWallet.address
  );

  console.log("call initialize")

  // SKIP add ld so far

  // // ADD SOME LD
  // await token.approve(router.address, ldYmeta)
  // await router.addLiquidityFTM(
  //   token.address,
  //   false,
  //   ldYmeta,
  //   1,
  //   1,
  //   owner,
  //   Date.now(),
  //   { value:ldETH }
  // )
  //
  // console.log("add LD")


  /*
    For deploy DAO treasury check this repo
    https://github.com/MintyDAO/MintyDAO-DAO-treasury
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
