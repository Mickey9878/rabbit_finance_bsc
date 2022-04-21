require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-etherscan');

require('dotenv').config();
let {  PrivateKey} = process.env;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      timeout:200000000,
      gasPrice: 5100000000,
      gas: 5000000,
      accounts: [PrivateKey]
    },
    hardhat: {
      forking: {
        // url: "https://eth-mainnet.alchemyapi.io/v2/2gFIk0YnN7Mg_iKQHVNZ-GMmp69VUVhc"
        url: "https://bsc-dataseed4.defibit.io/",
        // blockNumber: 12270411,
        throwOnTransactionFailures: true,
        throwOnCallFailures: true
      }
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 5100000000,
      gas: 5000000,
      accounts: [PrivateKey]
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gas: 4500000,
      gasPrice: 5200000000,
      gasMultiplier: 1,
      timeout:200000000,
      accounts: [PrivateKey]
    },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: {mnemonic: MNEMONIC}
    // },
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // kovan: {
    //   url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 2000000000
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  }
};
