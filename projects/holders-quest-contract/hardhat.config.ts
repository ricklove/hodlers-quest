import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task(`accounts`, `Prints the list of accounts`, async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_KEY = process.env.ALCHEMI_API_KEY as string;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY as string;
const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
} as const;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  // Your type-safe config goes here
  solidity: {
    version: `0.8.7`,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: `hardhat`,
  networks: {
    hardhat: {},
    rinkeby: {
      chainId: chainIds.rinkeby,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};

export default config;
