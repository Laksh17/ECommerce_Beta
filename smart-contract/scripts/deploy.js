const { ethers } = require('hardhat')

const main = async () => {
  const warrantyFactory = await ethers.getContractFactory('WarrantyERC721')
  const warrantyContract = await warrantyFactory.deploy()

  console.log('Address of the Warranty Contract is ', warrantyContract.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log('Error in deploying the contract: ', error)
    process.exit(1)
  })