const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },

  // Configure networks
  networks: {
    // Development network (local)
    development: {
      host: "10.105.63.205",
      port: 8545, // Ganache GUI default port
      network_id: "*", // Any network (default: none)
      gas: 6721975,
      gasPrice: 20000000000
    },

    // Your Ganache CLI on VM
    ganache: {
      host: process.env.VM_IP || "192.168.1.100",
      port: process.env.GANACHE_PORT || 8545,
      network_id: 1337,
      gas: 6000000,
      gasPrice: 20000000000,
      from: process.env.DEPLOYER_ADDRESS, // Account to deploy from
    },

    // Ganache with HD Wallet Provider (if you want to use private keys)
    ganache_hd: {
      provider: () => new HDWalletProvider({
        privateKeys: [
          process.env.PRIVATE_KEY_1 || "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
          process.env.PRIVATE_KEY_2 || "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
          process.env.PRIVATE_KEY_3 || "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c"
        ],
        providerOrUrl: `http://${process.env.VM_IP || "192.168.1.100"}:${process.env.GANACHE_PORT || 8545}`,
        numberOfAddresses: 3
      }),
      network_id: 1337,
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 0,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // Sepolia testnet
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 11155111,
      gas: 4000000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    timeout: 100000
  },

  // Configure your plugins
  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};