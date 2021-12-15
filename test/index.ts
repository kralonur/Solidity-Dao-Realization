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


    it("Should create no recipient voting", async function () {
        const ercContract = await getErcContract(owner, contract);

        const totalSupply = 1000;
        ercContract.mint(owner.address, totalSupply);

        await contract.setErcContract(ercContract.address);

        const description = "No recipient voting";
        await contract["createVoting(string)"](description);

        expect((await contract.getVotingDetail(0)).description)
            .to.equal(description);

        // Voting type 2 stands for NO_RECIPIENT
        expect((await contract.getVotingDetail(0)).votingType)
            .to.equal(2);
        // No call data
        expect((await contract.getVotingDetail(0)).callData)
            .to.equal('0x');
        // No recipient
        expect((await contract.getVotingDetail(0)).recipient)
            .to.equal(ethers.constants.AddressZero);
        // Total supply should be equal to minted amount
        expect((await contract.getVotingDetail(0)).totalSupplyAtCreation)
            .to.equal(totalSupply);
    });

    it("Should create standard voting", async function () {
        const ercContract = await getErcContract(owner, contract);

        const totalSupply = 1000;
        ercContract.mint(owner.address, totalSupply);

        await contract.setErcContract(ercContract.address);

        const description = "Standard voting";
        const recipient = ercContract.address;
        const callData = getApproveCallData(owner);

        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        expect((await contract.getVotingDetail(0)).description)
            .to.equal(description);

        // Voting type 1 stands for STANDARD
        expect((await contract.getVotingDetail(0)).votingType)
            .to.equal(1);
        // callData
        expect((await contract.getVotingDetail(0)).callData)
            .to.equal(callData);
        // recipient
        expect((await contract.getVotingDetail(0)).recipient)
            .to.equal(recipient);
        // Total supply should be equal to minted amount
        expect((await contract.getVotingDetail(0)).totalSupplyAtCreation)
            .to.equal(totalSupply);
    });
})

function getApproveCallData(owner: SignerWithAddress) {
    let ABI = [
        "function approve(address spender, uint256 amount)"
    ];
    let iface = new ethers.utils.Interface(ABI);
    return iface.encodeFunctionData("approve", [owner.address, 100]);
}

async function getErcContract(owner: SignerWithAddress, contract: DAO) {
    const ercTokenFactory = new ERC20Token__factory(owner);
    const ercContract = await ercTokenFactory.deploy();
    await contract.deployed();

    return ercContract;
}

