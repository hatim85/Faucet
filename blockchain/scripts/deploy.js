// scripts/deployFaucet.js
const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  // Define the token address and withdrawal limit
  const tokenAddress = "0xB99323577C304720dBA8a558C96c72A32852FB02"; // Replace with the actual token address
  const withdrawalLimit = ethers.parseEther("10000"); 

  // Get the Faucet contract factory
  const Faucet = await ethers.getContractFactory("Faucet");

  // Deploy the Faucet contract
  const faucet = await Faucet.deploy(tokenAddress, withdrawalLimit);

  console.log("Deploying Faucet Contract...");
  await faucet.waitForDeployment();

  console.log("Faucet deployed to:", faucet.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
