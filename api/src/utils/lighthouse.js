import lighthouse from '@lighthouse-web3/sdk'
import config from '../../config/main.js'

const getMessage = async (address) => {
  const { data: { message } } = await lighthouse.getAuthMessage(address)
  return message
}

const uploadFolder = async (path) => {
  const { data: { Hash: cid } } = await lighthouse.upload(path, config.lighthouse.api_key)
  return cid
}

const uploadEncriptedFolder = async (path, address, signature) => {
  const {data} =
    await lighthouse.uploadEncrypted(
      path, config.lighthouse.api_key, address, signature
    )
  return data[0].Hash
}

const setAccessConditions = async (cid, address, signature) => {
  const response = await lighthouse.applyAccessCondition(
    address,
    cid,
    signature,
    [
      // {
      //   id: 1,
      //   chain: "Ethereum",
      //   standardContractType: "ERC721",
      //   contractAddress: "0x5d464b5118e2c5677b88ac964b47495538052a80",
      //   method: "ownerOf",
      //   returnValueTest: {
      //     comparator: "==",
      //     value: "1"
      //   },
      //   parameters: [":tokenId"],
      //   inputArrayType: ["uint256"],
      //   outputType: "uint256"
      // },
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
        parameters: [":owner"],
        inputArrayType: ["address"],
        outputType: "uint256"
      },
      // {
      //   id: 1,
      //   chain: "Ethereum",
      //   standardContractType: "Custom",
      //   contractAddress: "0x5d464b5118e2c5677b88ac964b47495538052a80",
      //   method: "hasAccess",
      //   returnValueTest: {
      //     comparator: "==",
      //     value: "1"
      //   },
      //   parameters: [":userAddress", ":cid"],
      //   inputArrayType: ["address", "bytes32"],
      //   outputType: "uint256"
      // }
    ],
    "([1])"
  );

  console.log(response)
  return response
}

export { getMessage, uploadFolder, uploadEncriptedFolder, setAccessConditions }
