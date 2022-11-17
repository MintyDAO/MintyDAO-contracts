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

describe("fetch formula", function () {

  let fetch_formula;

  const oneDay = 86400

  it("deploy fetch formula", async function () {
    const FetchFormula = await ethers.getContractFactory("FetchFormula");
    fetch_formula = await FetchFormula.deploy();
    await fetch_formula.deployed();
  });

  it("1 days equal to 1% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 1)).to.be.equal(1);
  });

  it("7 days equal to 5% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 7)).to.be.equal(5);
  });

  it("14 days equal to 10% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 14)).to.be.equal(10);
  });

  it("30 days equal to 20% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 30)).to.be.equal(20);
  });

  it("90 days equal to 50% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 90)).to.be.equal(50);
  });

  it("180 days equal to 100% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 180)).to.be.equal(100);
  });

  it("365 days equal to 100% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 365)).to.be.equal(100);
  });

  it("730 days equal to 100% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 730)).to.be.equal(100);
  });

  it("1095 days equal to 100% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 1095)).to.be.equal(100);
  });

  it("1460 days equal to 100% ", async function () {
    expect(await fetch_formula.bonusPercent(oneDay * 1460)).to.be.equal(100);
  });
});
