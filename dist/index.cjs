'use strict';

var chunkLCDHMYGE_cjs = require('./chunk-LCDHMYGE.cjs');
var chunkO65EVLPV_cjs = require('./chunk-O65EVLPV.cjs');
var chunk5E62Q4AS_cjs = require('./chunk-5E62Q4AS.cjs');
var chunkMLRBZKI6_cjs = require('./chunk-MLRBZKI6.cjs');
var chunkMCBQNE3Z_cjs = require('./chunk-MCBQNE3Z.cjs');

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

Object.defineProperty(exports, "SessionManager", {
  enumerable: true,
  get: function () { return chunkLCDHMYGE_cjs.SessionManager; }
});
Object.defineProperty(exports, "formatAddress", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.formatAddress; }
});
Object.defineProperty(exports, "getAllChainMeta", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.getAllChainMeta; }
});
Object.defineProperty(exports, "getChainMeta", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.getChainMeta; }
});
Object.defineProperty(exports, "getExplorerAddressUrl", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.getExplorerAddressUrl; }
});
Object.defineProperty(exports, "getExplorerTxUrl", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.getExplorerTxUrl; }
});
Object.defineProperty(exports, "truncateAddress", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.truncateAddress; }
});
Object.defineProperty(exports, "validateAddress", {
  enumerable: true,
  get: function () { return chunkO65EVLPV_cjs.validateAddress; }
});
Object.defineProperty(exports, "SUPPORTED_MOBILE_WALLETS", {
  enumerable: true,
  get: function () { return chunk5E62Q4AS_cjs.SUPPORTED_MOBILE_WALLETS; }
});
Object.defineProperty(exports, "getWalletDeepLink", {
  enumerable: true,
  get: function () { return chunk5E62Q4AS_cjs.getWalletDeepLink; }
});
Object.defineProperty(exports, "WalletEventEmitter", {
  enumerable: true,
  get: function () { return chunkMLRBZKI6_cjs.WalletEventEmitter; }
});
Object.defineProperty(exports, "createWalletStore", {
  enumerable: true,
  get: function () { return chunkMLRBZKI6_cjs.createWalletStore; }
});
Object.defineProperty(exports, "globalEvents", {
  enumerable: true,
  get: function () { return chunkMLRBZKI6_cjs.globalEvents; }
});
Object.defineProperty(exports, "detectPlatform", {
  enumerable: true,
  get: function () { return chunkMCBQNE3Z_cjs.detectPlatform; }
});
Object.defineProperty(exports, "getPlatformInfo", {
  enumerable: true,
  get: function () { return chunkMCBQNE3Z_cjs.getPlatformInfo; }
});
Object.defineProperty(exports, "resetPlatformCache", {
  enumerable: true,
  get: function () { return chunkMCBQNE3Z_cjs.resetPlatformCache; }
});
exports.WC_CHAIN_IDS = WC_CHAIN_IDS;
exports.WC_CHAIN_NAMESPACES = WC_CHAIN_NAMESPACES;
exports.WalletConnectTransport = WalletConnectTransport;
exports.clearSession = clearSession;
exports.isAppKitWCChain = isAppKitWCChain;
exports.loadSession = loadSession;
exports.needsStandaloneWC = needsStandaloneWC;
exports.persistSession = persistSession;
