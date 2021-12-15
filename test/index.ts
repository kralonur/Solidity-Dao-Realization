import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DAO, DAO__factory, ERC20Token, ERC20Token__factory } from "../typechain-types/";

describe("DAO", function () {

    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let contract: DAO;

    before(async function () {
        accounts = await ethers.getSigners();
        owner = accounts[0];
    });

    beforeEach(async function () {
        const tokenFactory = new DAO__factory(owner);
        contract = await tokenFactory.deploy();
        await contract.deployed();
    });

    it("Should change erc contract", async function () {
        const ercContract = await getErcContract(owner, contract);

        await contract.setErcContract(ercContract.address);

        expect(await contract.ercContract())
            .to.equal(ercContract.address);
    });
})

async function getErcContract(owner: SignerWithAddress, contract: DAO) {
    const ercTokenFactory = new ERC20Token__factory(owner);
    const ercContract = await ercTokenFactory.deploy();
    await contract.deployed();

    return ercContract;
}

