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
