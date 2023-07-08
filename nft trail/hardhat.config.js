require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/zhzz6ev93c4pmXVm85hDk21FKHG2Wl0N",
      accounts: [ "0x15cd36fec7747fe65c23f03caa059c11e429bbbd8982905ac8afeefd433392d8" ]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
// url: "https://eth-sepolia.g.alchemy.com/v2/zhzz6ev93c4pmXVm85hDk21FKHG2Wl0N",
//accounts: [ "15cd36fec7747fe65c23f03caa059c11e429bbbd8982905ac8afeefd433392d8" ]