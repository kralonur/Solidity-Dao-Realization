import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { DAO, DAO__factory, ERC20Token, ERC20Token__factory } from "../typechain-types/";

task("set-erc-contract", "Sets erc contract")
    .addParam("contract", "The address of the contract")
    .addParam("erccontract", "The address of the erc contract")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.setErcContract(taskArgs.erccontract);
        console.log("ERC20 contract address set to: " + taskArgs.erccontract);
    });

task("deposit", "Deposits amount to contract")
    .addParam("contract", "The address of the contract")
    .addParam("amount", "The amount to deposit")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.deposit(taskArgs.amount);
        console.log("Deposited amount: " + taskArgs.amount);
    });

task("withdraw", "Withdraws all funds from contract")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.withdraw();
        console.log("Funds withdraw");
    });

task("create-voting", "Creates standard voting")
    .addParam("contract", "The address of the contract")
    .addParam("description", "The description of voting")
    .addParam("recipient", "The recipient of call data")
    .addParam("calldata", "The call data")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract["createVoting(string,address,bytes)"](taskArgs.description, taskArgs.recipient, taskArgs.calldata);
        console.log("Standard voting created");
    });

task("create-voting-no-recipient", "Creates no recipient voting")
    .addParam("contract", "The address of the contract")
    .addParam("description", "The description of voting")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract["createVoting(string)"](taskArgs.recipient);
        console.log("No recipient voting created");
    });

task("vote", "Votes to voting")
    .addParam("contract", "The address of the contract")
    .addParam("votingid", "The voting id")
    .addParam("option", "The voting option (1-FOR, 2-AGAINST)")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.vote(taskArgs.votingid, taskArgs.option);
        console.log("Voted: " + taskArgs.option + " to voting id: " + taskArgs.votingid);
    });

task("vote-for", "Votes to voting for someone else")
    .addParam("contract", "The address of the contract")
    .addParam("votingid", "The voting id")
    .addParam("address", "The address to vote for")
    .addParam("option", "The voting option (1-FOR, 2-AGAINST)")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.voteFor(taskArgs.votingid, taskArgs.address, taskArgs.option);
        console.log("Voted: " + taskArgs.option + " for address: " + taskArgs.address + " to voting id: " + taskArgs.votingid);
    });

task("delegate", "Delegates votes to given address")
    .addParam("contract", "The address of the contract")
    .addParam("address", "The address to delegate to")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.delegateVotesTo(taskArgs.address);
        console.log("Delegated votes to address: " + taskArgs.address);
    });

task("finish-voting", "Finishes voting")
    .addParam("votingid", "The voting id")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        await contract.finishVoting(taskArgs.votingid);
        const result = (await contract.getVotingDetail(taskArgs.votingid)).result;
        console.log("Voting: " + taskArgs.votingid + " finished with result: " + result);
    });

task("address-vote", "Gets the address vote")
    .addParam("votingid", "The voting id")
    .addParam("address", "The address to query vote")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        const vote = await contract.getAddressVote(taskArgs.votingid, taskArgs.address);
        console.log("Address: " + taskArgs.address + " voted: " + vote);
    });

task("voting-detail", "Gets voting detail")
    .addParam("votingid", "The voting id")
    .setAction(async (taskArgs, hre) => {
        const MyContract: DAO__factory = <DAO__factory>await hre.ethers.getContractFactory("DAO");
        const contract: DAO = MyContract.attach(taskArgs.contract);

        console.log(await contract.getVotingDetail(taskArgs.votingid));
    });