import { W as WalletEvent, a as WalletEventMap, b as WalletState, C as ConnectedWallet, c as ChainType } from './types-Cw0KStB0.js';
export { A as AdapterHookResult, B as BlinkConnectConfig, d as ChainAdapter, e as ConnectOptions } from './types-Cw0KStB0.js';
import { T as Transport } from './session-C-_Vf78I.js';
export { L as LinkedSession, P as Platform, a as PlatformInfo, S as SessionManager, W as WalletEntry, d as detectPlatform, g as getPlatformInfo, r as resetPlatformCache } from './session-C-_Vf78I.js';

type Listener<T> = (data: T) => void;
declare class WalletEventEmitter {
    private listeners;
    on<E extends WalletEvent>(event: E, listener: Listener<WalletEventMap[E]>): void;
    off<E extends WalletEvent>(event: E, listener: Listener<WalletEventMap[E]>): void;
    emit<E extends WalletEvent>(event: E, data: WalletEventMap[E]): void;
    removeAllListeners(event?: WalletEvent): void;
}
declare const globalEvents: WalletEventEmitter;

type Subscriber = () => void;
declare function createWalletStore(initialState?: Partial<WalletState>): {
    getState: () => WalletState;
    setState: (partial: Partial<WalletState>) => void;
    subscribe: (listener: Subscriber) => () => void;
    setWallets: (wallets: ConnectedWallet[]) => void;
    getAddress: (chain: ChainType) => string | null;
    isChainConnected: (chain: ChainType) => boolean;
    openModal: () => void;
    closeModal: () => void;
};
type WalletStore = ReturnType<typeof createWalletStore>;

/**
 * WalletConnect v2 transport layer for @goblink/connect.
 *
 * KEY INSIGHT: ReOwn AppKit already uses WalletConnect v2 internally for EVM + Solana.
 * On mobile, AppKit automatically handles deep links and WC flows for those chains.
 *
 * This module exists for chains NOT covered by AppKit:
 * - Sui (dapp-kit is injected-only by default)
 * - Future chains that need standalone WC sessions
 *
 * For EVM/Solana/Bitcoin: the existing adapters (via AppKit) already handle WC on mobile.
 * No additional work needed — AppKit detects mobile and uses WC deep links automatically.
 *
 * TODO: Install @walletconnect/sign-client as a dependency when ready to implement
 * standalone Sui WC sessions. For now, this module provides the type contract and
 * a placeholder implementation.
 */

/** WalletConnect session metadata */
interface WCSession {
    topic: string;
    chain: ChainType;
    address: string;
    peerName: string;
    peerIcon: string | null;
    expiresAt: number;
}
/** WalletConnect transport configuration */
interface WCTransportConfig {
    projectId: string;
    metadata?: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
}
/** Chain namespace mappings for WalletConnect v2 */
declare const WC_CHAIN_NAMESPACES: Partial<Record<ChainType, string>>;
/** CAIP-2 chain IDs for common networks */
declare const WC_CHAIN_IDS: Partial<Record<ChainType, string>>;
/**
 * Checks which chains are handled by AppKit's built-in WC support.
 * These chains don't need a standalone WC session — AppKit does it.
 */
declare function isAppKitWCChain(chain: ChainType): boolean;
/**
 * Checks if a chain needs a standalone WalletConnect session
 * (i.e., not covered by AppKit).
 */
declare function needsStandaloneWC(chain: ChainType): boolean;
/**
 * WalletConnect transport for non-AppKit chains.
 *
 * Currently a type-safe placeholder. When @walletconnect/sign-client is installed,
 * this will manage standalone WC v2 sessions for Sui, Aptos, Starknet, etc.
 *
 * For EVM/Solana/Bitcoin: use the existing AppKit adapters — they handle WC internally.
 */
declare class WalletConnectTransport {
    private config;
    private sessions;
    constructor(config: WCTransportConfig);
    /**
     * Initialize the WC SignClient.
     * TODO: Implement when @walletconnect/sign-client is added as a dependency.
     */
    init(): Promise<void>;
    /**
     * Connect to a wallet via WalletConnect v2.
     * Returns the WC URI for deep linking on mobile.
     */
    connect(chain: ChainType): Promise<{
        uri: string;
        session: WCSession;
    } | null>;
    /**
     * Disconnect a chain's WC session.
     */
    disconnect(chain: ChainType): Promise<void>;
    /**
     * Get an active WC session for a chain.
     */
    getSession(chain: ChainType): WCSession | null;
    /**
     * Get all active WC sessions.
     */
    getAllSessions(): Map<ChainType, WCSession>;
    /**
     * Check if a chain has an active WC session.
     */
    hasSession(chain: ChainType): boolean;
    /**
     * Restore persisted WC sessions from localStorage.
     * TODO: Implement with SignClient.session.getAll()
     */
    restoreSessions(): Promise<void>;
    /**
     * Get the transport type for a given chain connection.
     */
    getTransportType(): Transport;
}

/** Information about a mobile wallet app */
interface MobileWalletInfo {
    id: string;
    name: string;
    icon: string;
    chains: ChainType[];
    deepLink: (uri: string) => string;
    universalLink?: string;
    /** App Store / Play Store URLs for install prompts */
    appStore?: string;
    playStore?: string;
}
/**
 * Get a deep link URL to open a wallet app with a WalletConnect URI.
 *
 * @param wallet - Wallet identifier (e.g., 'metamask', 'phantom')
 * @param uri - WalletConnect v2 URI
 * @returns Deep link URL string, or null if wallet is not supported
 */
declare function getWalletDeepLink(wallet: string, uri: string): string | null;
/**
 * Supported mobile wallets with their metadata.
 * Used by the mobile connect modal to render wallet options.
 */
declare const SUPPORTED_MOBILE_WALLETS: MobileWalletInfo[];

/**
 * Format an address for display — truncates to first/last N characters.
 */
declare function formatAddress(address: string, chars?: number): string;
/**
 * Truncate address to a shorter form (6...4).
 */
declare function truncateAddress(address: string): string;
/**
 * Basic address validation by chain type.
 */
declare function validateAddress(chain: string, address: string): boolean;

interface ChainMeta {
    id: ChainType;
    name: string;
    symbol: string;
    decimals: number;
    explorer: string;
    color: string;
}
/**
 * Get metadata for a chain type.
 */
declare function getChainMeta(chain: ChainType): ChainMeta | null;
/**
 * Get all chain metadata.
 */
declare function getAllChainMeta(): ChainMeta[];
/**
 * Get explorer URL for a transaction on a given chain.
 */
declare function getExplorerTxUrl(chain: ChainType, txHash: string): string;
/**
 * Get explorer URL for an address on a given chain.
 */
declare function getExplorerAddressUrl(chain: ChainType, address: string): string;

/**
 * Persist wallet session to localStorage.
 */
declare function persistSession(wallets: ConnectedWallet[]): void;
/**
 * Load persisted wallet session from localStorage.
 */
declare function loadSession(): ConnectedWallet[];
/**
 * Clear persisted session.
 */
declare function clearSession(): void;

export { type ChainMeta, ChainType, ConnectedWallet, type MobileWalletInfo, SUPPORTED_MOBILE_WALLETS, Transport, type WCSession, type WCTransportConfig, WC_CHAIN_IDS, WC_CHAIN_NAMESPACES, WalletConnectTransport, WalletEvent, WalletEventEmitter, WalletEventMap, WalletState, type WalletStore, clearSession, createWalletStore, formatAddress, getAllChainMeta, getChainMeta, getExplorerAddressUrl, getExplorerTxUrl, getWalletDeepLink, globalEvents, isAppKitWCChain, loadSession, needsStandaloneWC, persistSession, truncateAddress, validateAddress };
