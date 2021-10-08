import Web3 from 'web3'

export const currentProvider = () => {
  if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
    const provider = window.ethereum || window.web3.currentProvider
    return provider
  } else {
    return undefined
  }
}
let web3

export function getWeb3 () {
  return new Promise((resolve, reject) => {
    if (web3) {
      resolve(web3)
      return
    }
    // Checking if Web3 has been injected by the browser (Mist/MetaMask).
    const provider = currentProvider()
    if (provider !== undefined) {
      web3 = new Web3(provider)
      resolve(web3)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      // provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      // web3 = new Web3(provider);
      // console.log('No web3 instance injected, using Local web3.');
      // resolve(web3);
      reject('MetaMask not loaded')
      location.href = '/connect'
    }
  })
}
