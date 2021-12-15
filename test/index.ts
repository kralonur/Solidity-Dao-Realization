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

    it("Should deposit", async function () {
        const ercContract = await getErcContract(owner, contract);

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);
        const mintUser = 500;
        ercContract.mint(accounts[1].address, mintUser);

        await contract.setErcContract(ercContract.address);

        // approve tokens for deposit
        await ercContract.approve(contract.address, mintOwner);
        await ercContract.connect(accounts[1]).approve(contract.address, mintUser);

        // before deposit
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(mintOwner);
        expect(await ercContract.balanceOf(accounts[1].address))
            .to.equal(mintUser);

        // deposit owner
        await contract.deposit(mintOwner);
        // after deposit owner
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(0);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(mintOwner);


        // deposit accounts[1]
        await contract.connect(accounts[1]).deposit(mintUser);
        // after deposit accounts[1]
        expect(await ercContract.balanceOf(accounts[1].address))
            .to.equal(0);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(mintOwner + mintUser);
    });

    it("Should withdraw", async function () {
        const ercContract = await getErcContract(owner, contract);

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);

        await contract.setErcContract(ercContract.address);

        // approve tokens for deposit
        await ercContract.approve(contract.address, mintOwner);

        // deposit owner
        await contract.deposit(mintOwner);
        // after deposit owner
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(0);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(mintOwner);

        // withdraw accounts[1]
        await expect(contract.connect(accounts[1]).withdraw())
            .to.be.revertedWith("This address balance is empty");

        // withdraw owner
        await contract.withdraw();
        // after withdraw owner
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(mintOwner);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(0);
    });

    it("Should withdraw after voting", async function () {
        const ercContract = await getErcContract(owner, contract);

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);

        await contract.setErcContract(ercContract.address);

        await ercContract.approve(contract.address, mintOwner);
        await contract.deposit(mintOwner);

        const description = "Standard voting";
        const recipient = ercContract.address;
        const callData = getApproveCallData(owner);
        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        // new voting with later end time
        await ethers.provider.send('evm_increaseTime', [(60 * 60 * 24)]); // simulate 1 day passed
        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        // owner votes FOR
        await contract.vote(1, 1);
        // owner votes FOR
        await contract.vote(0, 1);

        // withdraw before voting ends
        await expect(contract.withdraw())
            .to.be.revertedWith("Too early to withdraw");

        // before withdraw
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(0);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(mintOwner);

        // after voting ended
        await simulateVotingEnded();
        await contract.withdraw();

        // after withdraw
        expect(await ercContract.balanceOf(owner.address))
            .to.equal(mintOwner);
        expect(await ercContract.balanceOf(contract.address))
            .to.equal(0);
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

    it("Should vote for someone else", async function () {
        const ercContract = await getErcContract(owner, contract);

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);
        const mintUser = 500;
        ercContract.mint(accounts[1].address, mintUser);

        await contract.setErcContract(ercContract.address);

        await ercContract.approve(contract.address, mintOwner);
        await ercContract.connect(accounts[1]).approve(contract.address, mintUser);
        await contract.deposit(mintOwner);
        await contract.connect(accounts[1]).deposit(mintUser);

        const description = "Standard voting";
        const recipient = ercContract.address;
        const callData = getApproveCallData(owner);

        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        await expect(contract.connect(accounts[1]).voteFor(0, owner.address, 1))
            .to.be.revertedWith("This address did not delegate his votes to any address yet");

        await contract.delegateVotesTo(accounts[1].address);

        await expect(contract.connect(accounts[2]).voteFor(0, owner.address, 1))
            .to.be.revertedWith("You cannot vote for this address");

        // accounts[1] votes FOR, for himself
        await contract.connect(accounts[1]).vote(0, 1);
        // accounts[1] votes AGAINST, for owner
        await contract.connect(accounts[1]).voteFor(0, owner.address, 2);

        // accounts[1] vote should be equal to FOR
        expect((await contract.getAddressVote(0, accounts[1].address)))
            .to.equal(1);
        // owner vote should be equal to AGAINST
        expect((await contract.getAddressVote(0, owner.address)))
            .to.equal(2);
    });

    it("Should finish voting", async function () {
        const ercContract = await getErcContract(owner, contract);

        const user1 = accounts[1];
        const user2 = accounts[2];

        const mintOwner = 1000;
        ercContract.mint(owner.address, mintOwner);
        const mintUser1 = 500;
        ercContract.mint(user1.address, mintUser1);
        const mintUser2 = 500;
        ercContract.mint(user2.address, mintUser2);

        await contract.setErcContract(ercContract.address);

        await ercContract.approve(contract.address, mintOwner);
        await ercContract.connect(user1).approve(contract.address, mintUser1);
        await ercContract.connect(user2).approve(contract.address, mintUser2);
        await contract.deposit(mintOwner);
        await contract.connect(user1).deposit(mintUser1);
        await contract.connect(user2).deposit(mintUser2);

        let description = "Standard voting accepted";
        let recipient = ercContract.address;
        let callData = getApproveCallData(owner);
        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        description = "Standard voting rejected";
        recipient = ercContract.address;
        callData = getApproveCallData(owner);
        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        description = "Standard voting accepted call error";
        recipient = ercContract.address;
        callData = getApproveCallDataError(owner);
        await contract["createVoting(string,address,bytes)"](description, recipient, callData);

        description = "No recipient voting";
        await contract["createVoting(string)"](description);

        description = "No recipient voting invalid";
        await contract["createVoting(string)"](description);

        const standardAccepted = 0;
        const standardRejected = 1;
        const standardCallError = 2;
        const noRecipient = 3;
        const noRecipientInvalid = 4;

        // Standard voting accepted
        await contract.vote(standardAccepted, 1);
        await contract.connect(user1).vote(standardAccepted, 2);

        // Standard voting rejected
        await contract.vote(standardRejected, 2);
        await contract.connect(user1).vote(standardRejected, 1);

        // Standard voting accepted call error
        await contract.vote(standardCallError, 1);
        await contract.connect(user1).vote(standardCallError, 2);

        // No recipient voting
        await contract.vote(noRecipient, 1);
        await contract.connect(user1).vote(noRecipient, 2);

        // No recipient voting invalid
        await contract.connect(user1).vote(noRecipientInvalid, 2);

        // before time up
        await expect(contract.finishVoting(standardAccepted))
            .to.be.revertedWith("Too early to finish");

        // simulate voting time ended (3 days passed)
        await simulateVotingEnded();

        // Standard voting accepted - result
        await contract.finishVoting(standardAccepted);
        expect((await contract.getVotingDetail(standardAccepted)).result)
            .to.equal(1);
        // check if calldata worked (approve amount from contract to owner should be 100)
        expect((await ercContract.allowance(contract.address, owner.address)))
            .to.equal(100);
        // finish voting again
        await expect(contract.finishVoting(standardAccepted))
            .to.be.revertedWith("Voting already finished");

        // Standard voting rejected - result
        await contract.finishVoting(standardRejected);
        expect((await contract.getVotingDetail(standardRejected)).result)
            .to.equal(2);

        // Standard voting accepted call error - result
        await expect(contract.finishVoting(standardCallError))
            .to.be.revertedWith("Voting finished unsuccessfully");
        expect((await contract.getVotingDetail(standardCallError)).result)
            .to.equal(0);

        // No recipient voting - result
        await contract.finishVoting(noRecipient);
        expect((await contract.getVotingDetail(noRecipient)).result)
            .to.equal(1);

        // No recipient voting invalid - result
        await contract.finishVoting(noRecipientInvalid);
        expect((await contract.getVotingDetail(noRecipientInvalid)).result)
            .to.equal(3);
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

function getApproveCallDataError(owner: SignerWithAddress) {
    let ABI = [
        "function approve(address spender, uint256 amount)"
    ];
    let iface = new ethers.utils.Interface(ABI);
    return iface.encodeFunctionData("approve", [ethers.constants.AddressZero, 100]);
}

async function getErcContract(owner: SignerWithAddress, contract: DAO) {
    const ercTokenFactory = new ERC20Token__factory(owner);
    const ercContract = await ercTokenFactory.deploy();
    await contract.deployed();

    return ercContract;
}

