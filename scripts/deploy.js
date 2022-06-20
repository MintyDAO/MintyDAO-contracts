require('dotenv').config();

const owner = process.env.ADMIN_ADDRESS
const initialYMeta = "10000000000000000000"

async function main() {
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
  const FetchFormula = await ethers.getContractFactory("FetchFormulaMock");
  const Fetch = await ethers.getContractFactory("Fetch");
  const RewardsLocker = await ethers.getContractFactory("VotersRewardsLock");
  const RewardsFormula = await ethers.getContractFactory("VotersRewardsFormula");
  const GaugesRewardDestributor = await ethers.getContractFactory("GaugesRewardDestributor");


  const token = await Token.deploy();
  await token.deployed();

  const gauges = await Gauges.deploy();
  await gauges.deployed();

  const bribes = await Bribes.deploy();
  await bribes.deployed();

  const core = await Core.deploy();
  await core.deployed();

  const weth = await WETH9.deploy();
  await weth.deployed();

  const router = await Router.deploy(core.address, weth.address);
  await router.deployed();

  const ve = await Ve.deploy(token.address);
  await ve.deployed();

  const ve_dist = await Ve_dist.deploy(ve.address);
  await ve_dist.deployed();

  const voter = await BaseV1Voter.deploy(ve.address, core.address, gauges.address, bribes.address);
  await voter.deployed();

  const minter = await BaseV1Minter.deploy(voter.address, ve.address, ve_dist.address);
  await minter.deployed();

  await token.setMinter(minter.address);
  await ve.setVoter(voter.address);
  await ve_dist.setDepositor(minter.address);

  await voter.initialize([weth.address, token.address], owner);

  const treasury = await Treasury.deploy();
  await treasury.deployed();

  const fetch_formula = await FetchFormula.deploy();
  await fetch_formula.deployed();

  const fetch = await Fetch.deploy(
    router.address,
    token.address,
    owner,
    minter.address,
    ve.address,
    treasury.address,
    fetch_formula.address
  );

  await fetch.deployed();

  const rewardsLocker = await RewardsLocker.deploy(
    voter.address,
    token.address
  );

  await rewardsLocker.deployed();

  const rewardsFormula = await RewardsFormula.deploy(
    ve.address,
    rewardsLocker.address,
    token.address
  );

  await rewardsFormula.deployed();

  await rewardsLocker.updateFormula(rewardsFormula.address);

  await core.createPair(weth.address, token.address, false)

  const pair = await router.pairFor(token.address, weth.address, false);

  await voter.createGauge(pair);

  // await voter.vote(1, [pair], [5000]);
  gauge_address = await voter.gauges(pair);

  const destributor = await GaugesRewardDestributor.deploy(
    [gauge_address],
    [100]
  )

  await minter.initialize(
    fetch.address,
    initialYMeta,
    destributor.address,
    rewardsLocker.address,
    rewardsLocker.address,
    treasury.address
  );

  console.log("Admin ", owner)
  console.log("yMeta ", token.address)
  console.log("gauges ", gauges.address)
  console.log("bribes ", bribes.address)
  console.log("factory ", core.address)
  console.log("weth ", weth.address)
  console.log("router ", router.address)
  console.log("ve ", ve.address)
  console.log("ve_dist ", ve_dist.address)
  console.log("minter ", minter.address)
  console.log("treasury ", treasury.address)
  console.log("fetch_formula ", fetch_formula.address)
  console.log("fetch ", fetch.address)
  console.log("rewardsLocker ", rewardsLocker.address)
  console.log("rewardsFormula ", rewardsFormula.address)
  console.log("pair ", pair)
  console.log("gauge_address ", gauge_address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
