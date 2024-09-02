// scripts/checkBalance.js

const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.attach(contractAddress);
    const balance = await token.balanceOf(contractAddress);
    console.log(`Contract balance: ${ethers.formatUnits(balance, 'ether')} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
