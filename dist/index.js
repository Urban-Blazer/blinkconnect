export { SessionManager } from './chunk-LZ2SQNZH.js';
export { formatAddress, getAllChainMeta, getChainMeta, getExplorerAddressUrl, getExplorerTxUrl, truncateAddress, validateAddress } from './chunk-6MBTNAJI.js';
export { SUPPORTED_MOBILE_WALLETS, getWalletDeepLink } from './chunk-N4AYQGTJ.js';
export { WalletEventEmitter, createWalletStore, globalEvents } from './chunk-AMQFG4ZU.js';
export { detectPlatform, getPlatformInfo, resetPlatformCache } from './chunk-CQ2V2S4O.js';

// src/transports/walletconnect.ts
var WC_CHAIN_NAMESPACES = {
  evm: "eip155",
  solana: "solana",
  sui: "sui",
  // Sui Wallet supports WC v2 via sui: namespace
  aptos: "aptos",
  starknet: "starknet"
};
var WC_CHAIN_IDS = {
  evm: "eip155:1",
  // Ethereum mainnet
  solana: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  // Solana mainnet
  sui: "sui:mainnet",
  aptos: "aptos:1",
  starknet: "starknet:SN_MAIN"
};
function isAppKitWCChain(chain) {
  return chain === "evm" || chain === "solana" || chain === "bitcoin";
}
function needsStandaloneWC(chain) {
  return !isAppKitWCChain(chain) && chain !== "ton" && chain !== "tron";
}
var WalletConnectTransport = class {
  constructor(config) {
    this.sessions = /* @__PURE__ */ new Map();
    this.config = config;
  }
  /**
   * Initialize the WC SignClient.
   * TODO: Implement when @walletconnect/sign-client is added as a dependency.
   */
  async init() {
    console.warn(
      "[BlinkConnect] WalletConnect standalone transport not yet initialized. EVM/Solana/Bitcoin use AppKit's built-in WC support. Sui/Aptos/Starknet standalone WC sessions require @walletconnect/sign-client."
    );
  }
  /**
   * Connect to a wallet via WalletConnect v2.
   * Returns the WC URI for deep linking on mobile.
   */
  async connect(chain) {
    if (isAppKitWCChain(chain)) {
      console.warn(
        `[BlinkConnect] ${chain} uses AppKit's built-in WC. Use the chain adapter directly.`
      );
      return null;
    }
    console.warn(`[BlinkConnect] Standalone WC connect for ${chain} not yet implemented.`);
    return null;
  }
  /**
   * Disconnect a chain's WC session.
   */
  async disconnect(chain) {
    this.sessions.delete(chain);
  }
  /**
   * Get an active WC session for a chain.
   */
  getSession(chain) {
    return this.sessions.get(chain) ?? null;
  }
  /**
   * Get all active WC sessions.
   */
  getAllSessions() {
    return new Map(this.sessions);
  }
  /**
   * Check if a chain has an active WC session.
   */
  hasSession(chain) {
    const session = this.sessions.get(chain);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(chain);
      return false;
    }
    return true;
  }
  /**
   * Restore persisted WC sessions from localStorage.
   * TODO: Implement with SignClient.session.getAll()
   */
  async restoreSessions() {
  }
  /**
   * Get the transport type for a given chain connection.
   */
  getTransportType() {
    return "walletconnect";
  }
};

// src/utils/storage.ts
var STORAGE_KEY = "@goblink/connect:session";
function persistSession(wallets) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  } catch {
  }
}
function loadSession() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

export { WC_CHAIN_IDS, WC_CHAIN_NAMESPACES, WalletConnectTransport, clearSession, isAppKitWCChain, loadSession, needsStandaloneWC, persistSession };
