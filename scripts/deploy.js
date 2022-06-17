const owner = "";


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
  const gauges = await Gauges.deploy();
  const bribes = await Bribes.deploy();

  const core = await Core.deploy();
  const weth = await WETH9.deploy();
  const router = await Router.deploy(core.address, weth.address);

  const ve = await Ve.deploy(token.address);
  const ve_dist = await Ve_dist.deploy(ve.address);
  const voter = await BaseV1Voter.deploy(ve.address, core.address, gauges.address, bribes.address);
  const minter = await BaseV1Minter.deploy(voter.address, ve.address, ve_dist.address);

  await token.setMinter(minter.address);
  await ve.setVoter(voter.address);
  await ve_dist.setDepositor(minter.address);

  // await voter.initialize();

  const treasury = await Treasury.deploy();

  const fetch_formula = await FetchFormula.deploy();

  const fetch = await Fetch.deploy(
    router.address,
    token.address,
    owner,
    minter.address,
    ve.address,
    treasury.address,
    fetch_formula.address
  );

  const rewardsLocker = await RewardsLocker.deploy(
    voter.address,
    token.address
  );

  const rewardsFormula = await RewardsFormula.deploy(
    ve.address,
    rewardsLocker.address,
    token.address
  );

  await rewardsLocker.updateFormula(rewardsFormula.address)

  // DO MANUALY
  
  // const destributor = await GaugesRewardDestributor.deploy(
  //   [gauge_address],
  //   [100]
  // )
  //
  // await minter.initialize();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
