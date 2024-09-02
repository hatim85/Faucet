require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/0-1AhQ9wGWIiSC_QlmQOJJ-eIEY8l1-r",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    localhost:{
      url: "http://127.0.0.1:8545"
    }
  }
};
