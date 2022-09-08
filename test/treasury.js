const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("treasury", function () {

  let treasury;
  let token;

  it("deploy base treasury", async function () {
    [owner] = await ethers.getSigners(1);
    basev1 = await ethers.getContractFactory("BaseV1");

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy()
    await treasury.deployed()

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy('TOKEN', 'TKN', 18, owner.address);

    await token.mint(treasury.address, 2);
  });

  it("Owner can manage treasury", async function () {
    await treasury.manage(1, token.address, owner.address)
    expect(await token.balanceOf(owner.address)).to.be.equal(1);
  });

  it("Not owner can not manage treasury", async function () {
    await treasury.transferOwnership(treasury.address)
    await expect(treasury.manage(1, token.address, owner.address))
       .to.be.revertedWith('Ownable: caller is not the owner');
    expect(await token.balanceOf(owner.address)).to.be.equal(1);
  });
});
