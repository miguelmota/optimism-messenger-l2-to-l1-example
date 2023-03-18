const hre = require('hardhat')
const wait = require('wait')
const { CrossChainMessenger, MessageStatus, StandardBridgeAdapter } = require('@eth-optimism/sdk')
const hardhatConfig = require('../hardhat.config')
require('dotenv').config()

async function main() {
  while (true) {
    const l2TxHash = process.env.L2_TX_HASH

    const ccm = new CrossChainMessenger({
      l1ChainId: 5,
      l2ChainId: 420,
      l1SignerOrProvider: await hre.ethers.getSigner(),
      l2SignerOrProvider: new hre.ethers.providers.StaticJsonRpcProvider(hardhatConfig.networks.optimism.url),
      bedrock: true
    })

    const messageStatus = await ccm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      const tx = await ccm.proveMessage(l2TxHash)
      console.log('prove message tx:', tx.hash)
      console.log(`https://goerli.etherscan.io/tx/${tx.hash}`)
      await tx.wait()
    }
    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      await wait(10 * 1000)
    }
    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      const tx = await ccm.finalizeMessage(l2TxHash)
      console.log('relay message tx:', tx.hash)
      console.log(`https://goerli.etherscan.io/tx/${tx.hash}`)
      await tx.wait()
    }
    if (messageStatus === MessageStatus.RELAYED) {
      console.log('message relayed on L1')
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
