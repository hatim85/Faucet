// scripts/fundContract.js

const { ethers } = require("hardhat");

async function main() {
    // Get the contract address and amount to fund
    const contractAddress = "0x991c5Cded504cEB18FEC7CB33f0d057D9071266c";
    const amount = ethers.parseEther("10"); // Amount to fund in Ether

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
