const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("name", function () {

  let ve_underlying;
  let ve;
  let owner;
  let vecontract;


  it("deploy base tokens", async function () {
    [owner] = await ethers.getSigners(1);
    vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    basev1 = await ethers.getContractFactory("BaseV1");

    ve_underlying = await basev1.deploy();
    ve = await vecontract.deploy(ve_underlying.address);
  });

  it("Token name correct ", async function () {
    expect(await ve_underlying.name()).to.be.equal("Minty DAO");
  });

  it("Token symbol correct ", async function () {
    expect(await ve_underlying.symbol()).to.be.equal("MINTS");
  });

  it("ve name correct ", async function () {
    expect(await ve.name()).to.be.equal("mintsNFT");
  });

  it("ve symbol correct ", async function () {
    expect(await ve.symbol()).to.be.equal("mintsNFT");
  });
});
