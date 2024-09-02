// scripts/deployGSMCToken.js
const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  // Define the initial supply (in tokens with 18 decimals)
  const initialSupply = ethers.parseUnits("1000000", 18); // Example: 1,000,000 tokens

  // Get the GSMCToken contract factory
  const myToken = await ethers.getContractFactory("MyToken");

  // Deploy the GSMCToken contract
  const token = await myToken.deploy(initialSupply);

  console.log("Deploying GSMCToken Contract...");
  await token.waitForDeployment();

  console.log("GSMCToken deployed to:", token.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
