// Realistic blockchain configuration and constants
export const BLOCKCHAIN_CONFIG = {
  // Realistic blockchain network settings
  NETWORK: {
    name: 'AyuTrace-Chain',
    chainId: '0x7E57', // 32343 in decimal - unique chain ID
    rpcUrl: 'https://ayutrace-chain.io/rpc',
    explorerUrl: 'https://explorer.ayutrace-chain.io',
    symbol: 'AYUT',
    decimals: 18
  },

  // Gas settings
  GAS: {
    limit: 300000,
    price: '20000000000', // 20 gwei
    priceUnit: 'gwei'
  },

  // Contract addresses (consistent across the app)
  CONTRACTS: {
    supplyChain: '0x742d35Cc6634C0532925a3b8D4C4A8f8bE2bC1eD',
    certification: '0x892f4A2bd5e8c4A8dC2A5b7E9C1D3E4F5A6B7C8D',
    traceability: '0x1A3B5C7D9E2F4A6B8C0D2E4F6A8B0C2D4E6F8A0B'
  },

  // Block confirmation requirements
  CONFIRMATIONS: {
    minimal: 6,
    standard: 12,
    high: 24
  }
};

// Realistic transaction hash generator
export const generateRealisticTxHash = () => {
  return '0x' + Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Realistic block number generator (simulating current blockchain state)
export const generateRealisticBlockNumber = () => {
  const baseBlock = 2847350; // Realistic starting block
  const variation = Math.floor(Math.random() * 1000);
  return baseBlock + variation;
};

// Realistic gas usage for different transaction types
export const GAS_USAGE = {
  COLLECTION_EVENT: 180000,
  FINISHED_GOODS: 220000,
  SUPPLY_CHAIN_EVENT: 165000,
  TEST_RESULT: 195000,
  CERTIFICATION: 240000,
  LAB_ACCREDITATION: 280000
};

// Realistic addresses for different entity types
export const generateRealisticAddress = (type) => {
  const prefixes = {
    farmer: 'FRM',
    manufacturer: 'MFG', 
    distributor: 'DST',
    lab: 'LAB',
    retailer: 'RTL'
  };
  
  const prefix = prefixes[type] || 'GEN';
  const randomPart = Math.random().toString(16).substr(2, 37);
  return `0x${prefix}${randomPart}`.toLowerCase();
};

// Consistent blockchain status types
export const BLOCKCHAIN_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  MINED: 'mined'
};

// Realistic transaction types for AyuTrace ecosystem
export const TRANSACTION_TYPES = {
  COLLECTION_EVENT: 'COLLECTION_EVENT',
  RAW_MATERIAL_BATCH: 'RAW_MATERIAL_BATCH',
  FINISHED_GOODS_CREATION: 'FINISHED_GOODS_CREATION',
  SUPPLY_CHAIN_EVENT: 'SUPPLY_CHAIN_EVENT',
  TEST_RESULT_SUBMISSION: 'TEST_RESULT_SUBMISSION',
  TEST_CERTIFICATION: 'TEST_CERTIFICATION',
  TEST_FAILURE_REPORT: 'TEST_FAILURE_REPORT',
  SAMPLE_RECEIVED: 'SAMPLE_RECEIVED',
  LAB_ACCREDITATION: 'LAB_ACCREDITATION',
  QUALITY_VERIFICATION: 'QUALITY_VERIFICATION'
};

// Consistent timestamp formatting
export const formatBlockchainTimestamp = (timestamp) => {
  return new Date(timestamp).toISOString();
};

// Realistic confirmation times
export const estimateConfirmationTime = (confirmations) => {
  const avgBlockTime = 15; // 15 seconds per block
  return confirmations * avgBlockTime;
};

export default BLOCKCHAIN_CONFIG;