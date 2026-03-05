export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";
export const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || "http://localhost:3001";

export const ARBIPREDICT_ABI = [
  {
    "inputs": [],
    "name": "currentEpochId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_epochId", "type": "uint256" }],
    "name": "getEpochData",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "epochId", "type": "uint256" },
          { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" },
          { "internalType": "int256", "name": "bettingPrice", "type": "int256" },
          { "internalType": "int256", "name": "finalPrice", "type": "int256" },
          { "internalType": "uint256", "name": "totalHighTickets", "type": "uint256" },
          { "internalType": "uint256", "name": "totalLowTickets", "type": "uint256" },
          { "internalType": "uint256", "name": "totalHighAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "totalLowAmount", "type": "uint256" },
          { "internalType": "bool", "name": "resolved", "type": "bool" }
        ],
        "internalType": "struct ArbiPredict.Epoch",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "buyHighTickets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "buyLowTickets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resolveEpoch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_epochId", "type": "uint256" }],
    "name": "claimEpochWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_referrer", "type": "address" }],
    "name": "setReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_epochId", "type": "uint256" }
    ],
    "name": "getUserTickets",
    "outputs": [
      { "internalType": "uint256", "name": "high", "type": "uint256" },
      { "internalType": "uint256", "name": "low", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "claimableRewards",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "points",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "referrers",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];
