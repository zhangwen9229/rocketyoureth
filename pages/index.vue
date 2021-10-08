<template>
  <div>
    <button @click="createMinipool">
      创建minipool
    </button>
  </div>
</template>

<script>
// import Web3 from 'web3'
import RocketPool from 'rocketpool'
import { JsonArray, download } from 'json-to-csv-in-browser/lib/index.js'
import RocketStorage from '../contracts/RocketStorage.json'
import { getWeb3 } from '../utils/web3Client'
import { init, getBalances, createMinipool, registerNode } from '../Common/rocket'

export default {
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      await init()
      const web3 = await getWeb3()
      // const web3 = new Web3('http://localhost:8545')
      // eslint-disable-next-line no-console
      console.log(web3)

      const rp = new RocketPool(web3, RocketStorage)

      console.log('--------------------------------------')
      const pools = await rp.minipool.getMinipools()
      console.log(pools)
      // const nodes = await rp.node.getNodes()
      // const jsonArray = new JsonArray(nodes)
      // const str = jsonArray.convertToCSVstring()
      // download('mynodes.csv', str)

      const detail = await rp.minipool.getMinipoolDetails('0x001C00810148B94f2C6Fd70fEaaAcB559a50b08c')
      console.log(detail)
      console.log(rp.minipool)
      const len = await rp.minipool.getQueueTotalLength('0x001C00810148B94f2C6Fd70fEaaAcB559a50b08c')
      console.log('len', len)
      // const minipoolbl = await rp.minipool.getMinipoolWithdrawalTotalBalance(detail.address)
      // console.log('minipoolbl', minipoolbl)
      // const minipoolbalances = await getBalances({ from: detail.addreess })
      // console.log('minipoolbalances', minipoolbalances)
      // console.log(web3.utils.fromWei(minipoolbalances.depositPoolEth).toString(), web3.utils.fromWei(minipoolbalances.userReth).toString(), web3.utils.fromWei(minipoolbalances.vaultEth).toString())
      console.log('--------------------------------------')

      const rocketDepositPool = await rp.contracts.get('rocketDepositPool')
      const balance = await rocketDepositPool.methods.getBalance().call()
      // eslint-disable-next-line no-console
      console.log(balance)
      const bl = await web3.eth.getBalance('0x4242592FA5cD3fc9376002F570c5Fd85D97d623d')
      console.log('----- eth ----', web3.utils.fromWei(bl).toString())
      const rocketVault = await rp.contracts.get('rocketVault')
      console.log('rocketVault', rocketVault)

      // const balances = await getBalances({ from: '0x4242592FA5cD3fc9376002F570c5Fd85D97d623d' })
      // console.log('balances', balances)
      // console.log(await web3.eth.getAccounts())

      // Deposit
      // await deposit({
      //   from: '0x4242592FA5cD3fc9376002F570c5Fd85D97d623d',
      //   value: web3.utils.toWei('10', 'ether')
      // })
    },
    async createMinipool () {
      const web3 = await getWeb3()
      const node = '0x53C6Bb43320232b6923d8d89285Cb0E469646F36'
      registerNode('China/Beijing', { from: node })
      const res = await createMinipool({ from: node, value: web3.utils.toWei('16', 'ether') })
      console.log(res)
    }
  }
}
</script>
