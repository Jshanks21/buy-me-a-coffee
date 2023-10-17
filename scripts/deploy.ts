import { ethers } from "hardhat";

async function main() {

  const TipJar = await ethers.getContractFactory("BuyMeACoffee");
  const tipjar = await TipJar.deploy();

  console.log('deploying...');

  await tipjar.deployed();

  console.log(
    `TipJar deployed to: ${tipjar.address}`
  );

  console.log(`view in block explorer: https://sepolia.etherscan.io/address/${tipjar.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
