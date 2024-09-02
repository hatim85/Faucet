// scripts/deployFaucet.js
const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  // Define the token address and withdrawal limit
  const tokenAddress = "0xBac55D78D3c43b949c3B82AB74e75b2cae579506"; // Replace with the actual token address
  const withdrawalLimit = ethers.parseEther("0.5"); // 1 ETH

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
