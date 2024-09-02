// scripts/fundContract.js

const { ethers } = require("hardhat");

async function main() {
    // Get the contract address and amount to fund
    const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    const amount = ethers.parseEther("100"); // Amount to fund in Ether

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Funding contract with account:", deployer.address);

    // Send Ether to the contract
    const tx = await deployer.sendTransaction({
        to: contractAddress,
        value: amount
    });

    await tx.wait();
    console.log(`Contract funded with ${ethers.formatEther(amount)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
