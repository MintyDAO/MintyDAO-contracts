const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');

describe("poolfactory", function () {

    let poolfactory;
    let token;
    let ust;
    let yMeta;
    let pool;

    it("deploy base", async function () {
        [owner] = await ethers.getSigners(1);
        const PoolFactory = await ethers.getContractFactory("PoolFactory");
        poolfactory = await PoolFactory.deploy();
        const Pool = await ethers.getContractFactory("yMetaPool");
        pool = await Pool.deploy();
        token = await ethers.getContractFactory("Token");
        yMeta = await token.deploy('yMeta', 'YMETA', 18, owner.address)
        ust = await token.deploy('ust', 'ust', 6, owner.address);
        await ust.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000"));
        await ust.connect(owner).approve(poolfactory.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        const allowance = await ust.allowance(owner.address, poolfactory.address);
        const balance = await ust.balance(owner.address);
        await poolfactory.connect(owner).create(
            pool.address,
            ust.address,
            ust.address,
            yMeta.address,
            "1000",
            ["0", "0"],
            ethers.utils.parseEther("1000"),
            "365",
            '0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52',
            [],
            [yMeta.address, ust.address],
            true)
    });
});
