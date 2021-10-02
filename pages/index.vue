<template>
  <Tutorial />
</template>

<script>
import Web3 from 'web3'
import RocketPool from 'rocketpool'
import RocketStorage from './contracts/RocketStorage.json'

const web3 = new Web3('http://localhost:8545')

const rp = new RocketPool(web3, RocketStorage)

export default {
  mounted () {
    rp.contracts.get('rocketDepositPool')
      .then(rocketDepositPool => rocketDepositPool.methods.getBalance().call())
      .then((balance) => {
        // eslint-disable-next-line no-console
        console.log(balance)
      })
  }
}
</script>
