import lighthouse from '@lighthouse-web3/sdk'
import config from '../../config/main.js'

const dealParameters = {
  network: config.lighthouse.filecoin_chain,
  repair_threshold: 28800,
  renew_threshold: 240,
  add_mock_data: 2,
  num_copies: 2,
}

const getMessage = async (address) => {
  const { data: { message } } = await lighthouse.getAuthMessage(address)
  return message
}

const getKey = async (cid, address, signature) => {
  const { data: { key } } = await lighthouse.fetchEncryptionKey(cid, address, signature)
  return key
}

const uploadFileEncripted = async (path, address, signature) => {
  const { data } =
    await lighthouse.uploadEncrypted(
      path, config.lighthouse.api_key, address, signature, dealParameters
    )

  return data[0].Hash
}

const downloadFileDecrypted = (cid, key) =>
  lighthouse.decryptFile(cid, key, 'application/vnd.curl.car')

const setAccessConditions = async (cid, tokenId, address, signature) => {
  const accessRules = [
    {
      id: 1,
      chain: config.lighthouse.evm_chain,
      standardContractType: "ERC721",
      contractAddress: config.rpc.contract.address,
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
      chain: config.lighthouse.evm_chain,
      standardContractType: 'ERC721',
      contractAddress: config.rpc.contract.address,
      method: 'ownerOf',
      returnValueTest: {
        comparator: '==',
        value: ':userAddress'
      },
      parameters: [tokenId],
      inputArrayType: ["uint256"],
      outputType: "address",
    },
    // Function (hasAccess) of ID (2) is not in the ABI [ balanceOf, ownerOf, isApprovedForAll, name]`
    // {
    //   id: 2,
    //   chain: config.lighthouse.evm_chain,
    //   standardContractType: 'ERC721',
    //   contractAddress: rpc.contract.address,
    //   method: 'hasAccess',
    //   returnValueTest: {
    //     comparator: '==',
    //     value: ':userAddress'
    //   },
    //   parameters: [cid],
    //   inputArrayType: ["uint256"],
    //   outputType: "address",
    // },
  ]

  const { data } = await lighthouse.applyAccessCondition(
    address, cid, signature, accessRules, "([1] and [2])"
  )

  if (data.status !== 'Success')
    throw new Error('Something went wrong', data)

  return data.status === 'Success'
}

// POST https://calibration.lighthouse.storage/api/register_job
// -H "Content-Type: application/x-www-form-urlencoded" \
// -d "cid=QmYSNU2i62v4EFvLehikb4njRiBrcWqH6STpMwduDcNmK6"
const registerFilecoinUploadJob = async (cid) => {
  const response = await fetch(`https://${config.lighthouse.filecoin_chain}.lighthouse.storage/api/register_job`, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // body: JSON.parse({ cid })
    body: `cid=${cid}`
  })
  return { status: response.status, data: await response.json() }
}

// GET https://calibration.lighthouse.storage/api/deal_status?cid=QmWef1wSDEmBwKjV66mJqcxDTHsdBQkHKK1xEaw6N36bJH
const getFilecoinUploadJobStatus = async (cid) => {
  const response = await fetch(`https://${config.lighthouse.filecoin_chain}.lighthouse.storage/api/deal_status?cid=${cid}`)
  return { status: response.status, data: await response.json() }
}

const uploadedFileStatus = async (cid) => {
  const { data } = await lighthouse.getFileInfo(cid)
  return data
}

const uploadedFileDealStatus = async (cid) => {
  const { data } = await lighthouse.dealStatus(cid)
  return data
}


export { getMessage, getKey }
export { uploadFileEncripted, downloadFileDecrypted }
export { uploadedFileStatus, uploadedFileDealStatus }
export { setAccessConditions }
export { registerFilecoinUploadJob, getFilecoinUploadJobStatus }
