// deploy.js
const {ethers} = require("hardhat");

async function main() {
  // Compile the contract
  const [deployer] = await ethers.getSigners();
  console.log("deploying contract with the account", deployer.address);

  // Deploy the contract
  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();

 

  console.log("RealEstate contract deployed to:", realEstate.target);
}

// Handle errors and execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
