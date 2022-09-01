const hre = require("hardhat");
const fs = require("fs")
async function main() {
  
  const Amm = await hre.ethers.getContractFactory("AMM");
  const amm = await Amm.deploy();

  await amm.deployed();

  console.log("Automated Market Maker deployed to:", amm.address);

  let Address = JSON.stringify(amm.address)
  fs.writeFileSync("./client/src/artifacts/Address.json",Address)

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
