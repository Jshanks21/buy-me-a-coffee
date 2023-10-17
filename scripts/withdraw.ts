import { ethers } from "hardhat";
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider:any, address:string) {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress="0xeb9F9E77D656015c915eC4FD602f440A2cC924de";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);
  
  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as any, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("current balance of contract: ", contractBalance, "ETH... at", buyMeACoffee.address);

  // Withdraw funds if there are funds to withdraw.
  if (Number(contractBalance) > 0) {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("new balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });