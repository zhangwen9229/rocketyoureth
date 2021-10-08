// import Web3 from 'web3'
import RocketPool from 'rocketpool'
import RocketStorage from '../contracts/RocketStorage.json'
import { getTxContractEvents } from './contract'
import { getWeb3 } from '~/utils/web3Client'

let web3, rp
export async function init () {
//   web3 = new Web3('http://localhost:8545')
  web3 = await getWeb3()
  // eslint-disable-next-line no-console
  console.log(web3)
  rp = new RocketPool(web3, RocketStorage)
}

const gasLimit = 8000000
export async function userDeposit (options) {
  // options: {
  //     from: staker,
  //     value: web3.utils.toWei("10", "ether"),
  //     gas: gasLimit,
  //  }
  return await rp.deposit.deposit(Object.assign({}, options, { gasLimit }))
}

// Get balances
export async function getBalances (options) { // Load contracts
  const rocketVault = await rp.contracts.get('rocketVault')
  return await Promise.all([
    rp.deposit.getBalance().then(value => web3.utils.toBN(value)),
    web3.eth.getBalance(rocketVault.options.address).then(value => web3.utils.toBN(value)),
    rp.tokens.reth.balanceOf(options.from).then(value => web3.utils.toBN(value))
  ]).then(([depositPoolEth, vaultEth, userReth]) => ({
    depositPoolEth,
    vaultEth,
    userReth
  }))
}

export async function enable () {
  try {
    const accounts = await window.ethereum.enable()
    console.log('metamask enabled ', accounts[0])
    return accounts[0]
  } catch (error) {
    console.log(error)
    return ''
  }
}

export async function registerNode (name, options) {
  // Register node & set withdrawal address
  await rp.node.registerNode(name, Object.assign({}, options, { gasLimit }))
}

export async function setNodeWithdrawalAddress (nodeAddress, withdrawalAddress, options) {
  await rp.node.setWithdrawalAddress(nodeAddress, withdrawalAddress, true, options)
}

export async function createMinipool (options) {
  // Get contract addresses
  const minipoolManagerAddress = await rp.contracts.address('rocketMinipoolManager')
  console.log('minipoolManagerAddress', minipoolManagerAddress, options)
  // Make node deposit
  const txReceipt = await rp.node.deposit(web3.utils.toWei('0', 'ether'), Object.assign({}, options, { gasLimit }))

  // Get minipool created events
  const minipoolCreatedEvents = getTxContractEvents(web3, txReceipt, minipoolManagerAddress, 'MinipoolCreated', [
    { type: 'address', name: 'minipool', indexed: true },
    { type: 'address', name: 'node', indexed: true },
    { type: 'uint256', name: 'created' }
  ])

  // Return minipool instance
  if (!minipoolCreatedEvents.length) { return null }
  return rp.minipool.getMinipoolContract(minipoolCreatedEvents[0].minipool)
}
