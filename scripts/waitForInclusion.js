const hre = require('hardhat')
const wait = require('wait')
const { CrossChainMessenger, MessageStatus, StandardBridgeAdapter } = require('@eth-optimism/sdk')
const hardhatConfig = require('../hardhat.config')
require('dotenv').config()

async function main() {
  console.log('Waiting for L2 root inclusion (this may take up to 5 minutes)...')
  while (true) {
    const l2TxHash = process.env.L2_TX_HASH

    const ccm = new CrossChainMessenger({
      l1ChainId: 5,
      l2ChainId: 420,
      l1SignerOrProvider: new hre.ethers.providers.StaticJsonRpcProvider(hardhatConfig.networks.goerli.url),
      l2SignerOrProvider: new hre.ethers.providers.StaticJsonRpcProvider(hardhatConfig.networks.optimism.url),
      bedrock: true
    })

    const messageStatus = await ccm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      console.log('L1 message ready to prove')
      break
    }
    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('L1 message ready for relay')
      break
    }
    if (messageStatus === MessageStatus.RELAYED) {
      console.log('L1 message relayed')
      break
    }

    await wait (10 * 1000)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
