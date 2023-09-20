import lighthouse from '@lighthouse-web3/sdk'
import config from '../../config/main.js'

const getMessage = async (address) => {
  const { data: { message } } = await lighthouse.getAuthMessage(address)
  return message
}

const getEncriptionKey = async (cid, address, signature) => {
  const {data: {key}} = await lighthouse.fetchEncryptionKey(
      cid, address, signature
  )
  return key
}

const uploadFolder = async (path) => {
  const { data: { Hash: cid } } = await lighthouse.upload(path, config.lighthouse.api_key)
  return cid
}

const decryptSources = async (cid, key) => {
  const response = await lighthouse.decryptFile(cid, key)
  console.log(response)
  return response
}

const uploadEncriptedFolder = async (path, address, signature) => {
  // TODO: add deals params
  const {data} =
    await lighthouse.uploadEncrypted(
      path, config.lighthouse.api_key, address, signature
    )
  return data[0].Hash
}

const setAccessConditions = async (cid, address, signature) => {
  const {data} = await lighthouse.applyAccessCondition(
    address,
    cid,
    signature,
    [
      {
        id: 1,
        chain: "Ethereum",
        standardContractType: "ERC721",
        contractAddress: "0x5d464b5118e2c5677b88ac964b47495538052a80",
        method: "balanceOf",
        returnValueTest: {
          comparator: ">=",
          value: "1"
        },
        parameters: [":userAddress"],
        inputArrayType: ["address"],
        outputType: "uint256"
      },
      {
        id: 2,
        chain: "Ethereum",
        standardContractType: 'ERC721',
        contractAddress: '0x89b597199dAc806Ceecfc091e56044D34E59985c',
        method: 'ownerOf',
        returnValueTest: {
          comparator: '==',
          value: ':userAddress'
        },
        parameters: ['613'],
        inputArrayType: ["uint256"],
        outputType: "address",
      },
    ],
    "([1] and [2])"
  );

  // TODO: beter exception
  if (data.status !== 'Success')
    throw new Error('Something went wrong', data)

  return data.status === 'Success'
}

export { getMessage, getEncriptionKey, uploadFolder, uploadEncriptedFolder, decryptSources, setAccessConditions }
