import { ethers } from "hardhat";
import { DAO, DAO__factory } from "../typechain-types/";

async function main() {
  const [owner] = await ethers.getSigners();
  const daoFactory = new DAO__factory(owner);
  const dao = await daoFactory.deploy();

  await dao.deployed();

  console.log("DAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
