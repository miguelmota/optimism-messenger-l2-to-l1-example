# Optimism Messenger L2->L1 Example

> Send a message from L2 [Optimism](https://www.optimism.io/) testnet to L1 Goerli.

## Example

There's two contracts; `L2Contract.sol` and `L1Contract.sol`

The L2 contract has a method `sendGreetingMessageToL1` that sends a message form L2 to L1 contract to set a greeting message on L1 contract.
It sends the encoded calldata to execute `setGreeting` on L1 which can only be called if the message was sent by the L2 contract.

### Files

- [`L2Contract.sol`](./contracts/L2Contract.sol)
- [`L1Contract.sol`](./contracts/L1Contract.sol)
- [`deployL2.js`](./script/deployL2.js)
- [`deployL1.js`](./scripts/deployL1.js)
- [`sendL2ToL1Message.js`](./scripts/sendL2ToL1Message.js)
- [`waitForInclusion.js`](./scripts/waitForInclusion.js)
- [`finalizeMessageOnL1.js`](./scripts/finalizeMessageOnL1.js)
- [`getGreetingOnL1.js`](./scripts/getGreetingOnL1.js)

## Install

```sh
git clone https://github.com/miguelmota/optimism-messenger-l2-to-l1-example.git
cd optimism-messenger-l2-to-l1-example
npm install
```

### Set Signer

Create `.env`

```sh
PRIVATE_KEY=123...
```

Make sure private key has funds on both Optimism testnet and Goerli.

### Compile Contracts

```sh
npx hardhat compile
```

### Deploy L2 Contract

Command

```sh
npx hardhat run --network optimism scripts/deployL2.js
```

Output

```sh
L2Contract deployed to: 0x91CB0FEd918626866aC82120727ec1B649Ce7f11
```

### Deploy L1 Contract

Command

```sh
L2_CONTRACT=0x91CB0FEd918626866aC82120727ec1B649Ce7f11 \
npx hardhat run --network goerli scripts/deployL1.js
```

Output

```sh
L1Contract deployed to: 0xAdB642a1122413d826cBE35a5F4c328Fc80c3Ff0
```

### Send L2->L1 Message

Command (replace env vars with your values)

```sh
GREETING="hello world" \
L2_CONTRACT=0x91CB0FEd918626866aC82120727ec1B649Ce7f11 \
L1_CONTRACT=0xAdB642a1122413d826cBE35a5F4c328Fc80c3Ff0 \
npx hardhat run --network optimism scripts/sendL2ToL1Message.js
```

Output

```sh
sent tx hash 0x0536dbf443e596b5c7f23dc09a2d03b8d8dbdb73e20ff53254f5360e9ff561f3
https://goerli-optimism.etherscan.io/tx/0x0536dbf443e596b5c7f23dc09a2d03b8d8dbdb73e20ff53254f5360e9ff561f3
```

### Wait for L1 Root Inclusion

Command

```sh
L2_TX_HASH=0x0536dbf443e596b5c7f23dc09a2d03b8d8dbdb73e20ff53254f5360e9ff561f3 \
npx hardhat run --network optimism scripts/waitForInclusion.js
```

Output

```sh
Waiting for L1 root inclusion (this may take up to 10 minutes)...
L1 message ready to prove
```

### Finalize Message On L1

Command

```sh
L2_TX_HASH=0x0536dbf443e596b5c7f23dc09a2d03b8d8dbdb73e20ff53254f5360e9ff561f3 \
npx hardhat run --network goerli scripts/finalizeMessageOnL1.js
```

Output

```sh
prove message tx: 0x3c87b97838a1f7674104683d0fc3801ed837c8dff6142862538531b20e538ec6
https://goerli.etherscan.io/tx/0x3c87b97838a1f7674104683d0fc3801ed837c8dff6142862538531b20e538ec6
relay message tx: 0x69b3dd18fa9033f445ba8d411e6b5e61edd3230f25e3accecf3c10c672234f4f
https://goerli.etherscan.io/tx/0x69b3dd18fa9033f445ba8d411e6b5e61edd3230f25e3accecf3c10c672234f4f
message relayed on L1
```

### Get Greeting on L1

Command

```sh
L1_CONTRACT=0xd7f8d5a683D51fF90Aff7C25430CA3abAe3F80A0 \
npx hardhat run --network goerli scripts/getGreetingOnL1.js
```

Output

```sh
greeting: hello world
```

### Send L1->L2 Message

See [https://github.com/miguelmota/optimism-messenger-l1-to-l2-example](https://github.com/miguelmota/optimism-messenger-l1-to-l2-example)

## License

[MIT](./LICENSE) @ [Miguel Mota](https://github.com/miguelmota)
