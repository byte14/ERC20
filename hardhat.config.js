require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { INFURA_API_KEY } = process.env;
const { PRIVATE_KEY } = process.env;
const { ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: INFURA_API_KEY,
      accounts: PRIVATE_KEY
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
