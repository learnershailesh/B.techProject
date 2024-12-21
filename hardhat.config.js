require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia:{
      url: "https://eth-sepolia.g.alchemy.com/v2/H_sgjjdJ09HExobYITd9_gyaT_jqD9C_",
      accounts: ["34acb25355db5a7b8d061cb9ea1a0554d0c3dfa214387856211f7677b25214d8"]
    }
  }
};
