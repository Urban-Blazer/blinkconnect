import { c as ChainType } from './types-Cw0KStB0.cjs';

type Platform = 'desktop-browser' | 'mobile-browser' | 'wallet-browser';
type Transport = 'injected' | 'walletconnect' | 'zklogin' | 'tonconnect';
interface PlatformInfo {
    platform: Platform;
    isMobile: boolean;
    isWalletBrowser: boolean;
    walletBrowser: 'metamask' | 'phantom' | 'sui-wallet' | 'trust' | 'coinbase' | null;
    injectedProviders: ChainType[];
    recommendedTransport: Partial<Record<ChainType, Transport>>;
}
/**
 * Detect the current platform environment and recommend connection transports.
 *
 * - Desktop with extensions → injected for all chains
 * - Mobile wallet browser (MetaMask, Phantom, etc.) → injected for that chain, walletconnect for others
 * - Mobile regular browser (Safari, Chrome) → walletconnect for all (tonconnect for TON)
 */
declare function detectPlatform(): PlatformInfo;
declare function getPlatformInfo(): PlatformInfo;
/**
 * Reset cached platform info (useful for testing).
 */
declare function resetPlatformCache(): void;

/** A single wallet entry in a linked session */
interface WalletEntry {
    chain: ChainType;
    address: string;
    transport: Transport;
}
/** Linked session tracking multiple connected wallets */
interface LinkedSession {
    id: string;
    primary: WalletEntry | null;
    linked: WalletEntry[];
    createdAt: number;
}
/**
 * SessionManager tracks multiple connected wallets across chains.
 *
 * - One primary wallet (first connected)
 * - Additional linked wallets for cross-chain operations
 * - Persists to localStorage for session continuity
 * - Framework-agnostic (used by both React hooks and vanilla client)
 */
declare class SessionManager {
    private session;
    constructor();
    private createEmptySession;
    /** Get the current session state */
    getSession(): LinkedSession;
    /** Set the primary wallet (first connected wallet) */
    setPrimary(chain: ChainType, address: string, transport: Transport): void;
    /** Link an additional wallet (for cross-chain operations) */
    linkWallet(chain: ChainType, address: string, transport: Transport): void;
    /** Unlink a wallet by chain */
    unlinkWallet(chain: ChainType): void;
    /** Get the address for a specific chain */
    getAddress(chain: ChainType): string | null;
    /** Get the transport for a specific chain */
    getTransport(chain: ChainType): Transport | null;
    /** Check if a chain has a connected wallet in the session */
    hasChain(chain: ChainType): boolean;
    /** Get all addresses across all connected wallets */
    getAllAddresses(): Array<{
        chain: ChainType;
        address: string;
    }>;
    /** Get all wallet entries (primary + linked) */
    getAllWallets(): WalletEntry[];
    /** Total number of connected wallets */
    get count(): number;
    /** Persist session to localStorage */
    persist(): void;
    /** Restore session from localStorage */
    restore(): LinkedSession | null;
    /** Clear the session (disconnect all) */
    clear(): void;
}

export { type LinkedSession as L, type Platform as P, SessionManager as S, type Transport as T, type WalletEntry as W, type PlatformInfo as a, detectPlatform as d, getPlatformInfo as g, resetPlatformCache as r };
