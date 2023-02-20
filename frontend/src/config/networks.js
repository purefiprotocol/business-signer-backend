const AMOUNT_OF_BLOCKS_PER_YEAR_ETHEREUM = 2254114;

const AMOUNT_OF_BLOCKS_PER_YEAR_POLYGON = 10500000;

export const ETHEREUM_MAINNET_NETWORK = {
  name: 'Ethereum',
  networkId: 1,
  avatar: '',
  avatarContained: '',
  amountOfBlocksPerYear: AMOUNT_OF_BLOCKS_PER_YEAR_ETHEREUM,
  symbol: 'ETH',
  explorerUrl: 'https://etherscan.io',
  explorerName: 'EtherScan',
};

export const POLYGON_MAINNET_NETWORK: Network = {
  name: 'Polygon Mainnet',
  alias: 'Polygon',
  networkId: 137,
  avatar: '',
  avatarContained: '',
  amountOfBlocksPerYear: AMOUNT_OF_BLOCKS_PER_YEAR_POLYGON,
  symbol: 'MATIC',
  currency: 'matic',
  rpcUrl: 'https://polygon.llamarpc.com',
  blockExplorerUrl: 'https://polygonscan.com'
};

export const POLYGON_TESTNET_NETWORK: Network = {
  name: 'Polygon Testnet',
  networkId: 80001,
  avatar: '',
  avatarContained: '',
  amountOfBlocksPerYear: AMOUNT_OF_BLOCKS_PER_YEAR_POLYGON,
  symbol: 'MATIC',
  rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  blockExplorerUrl: 'https://mumbai.polygonscan.com'
};

const NETWORKS = {
  [ETHEREUM_MAINNET_NETWORK.networkId]: ETHEREUM_MAINNET_NETWORK,
  [POLYGON_MAINNET_NETWORK.networkId]: POLYGON_MAINNET_NETWORK,
  [POLYGON_TESTNET_NETWORK.networkId]: POLYGON_TESTNET_NETWORK,
};

export { NETWORKS };

export const DEFAULT_NETWORK = ETHEREUM_MAINNET_NETWORK;
