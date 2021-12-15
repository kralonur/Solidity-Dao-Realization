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

    it("Should vote", async function () {
        const ercContract = await getErcContract(owner, contract);

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);
        const mintUser = 500;
        ercContract.mint(accounts[1].address, mintUser);

        await contract.setErcContract(ercContract.address);

        // approve tokens for deposit
        await ercContract.approve(contract.address, mintOwner);
        await ercContract.connect(accounts[1]).approve(contract.address, mintUser);

        const description = "Standard voting";
        const recipient = ercContract.address;
        const callData = getApproveCallData(owner);

        // test before creating vote
        await expect(contract.vote(0, 1))
            .to.be.revertedWith("Voting not found");

        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        // test before depositing
        await expect(contract.vote(0, 1))
            .to.be.revertedWith("Balance is not enough for voting");

        // deposit tokens
        await contract.deposit(mintOwner);
        await contract.connect(accounts[1]).deposit(mintUser);

        // test invalid vote
        await expect(contract.vote(0, 0))
            .to.be.revertedWith("Invalid vote");

        // owner votes FOR
        await contract.vote(0, 1);
        // accounts[1] votes AGAINST
        await contract.connect(accounts[1]).vote(0, 2);

        expect((await contract.getVotingDetail(0)).totalFor)
            .to.equal(mintOwner);
        expect((await contract.getVotingDetail(0)).totalAgainst)
            .to.equal(mintUser);

        // test voting again
        await expect(contract.vote(0, 2))
            .to.be.revertedWith("The address already voted");

        await simulateVotingEnded();
        // test voting, after voting ended
        await expect(contract.vote(0, 1))
            .to.be.revertedWith("Voting is already ended");
    });
})

async function simulateVotingEnded() {
    const duration = 3 * (60 * 60 * 24); // 3days is standard
    await ethers.provider.send('evm_increaseTime', [duration]);
}

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

