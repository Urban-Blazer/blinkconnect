import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, Component } from 'react';
import { B as BlinkConnectConfig, C as ConnectedWallet, c as ChainType, A as AdapterHookResult } from '../types-Cw0KStB0.cjs';
import { a as PlatformInfo, T as Transport, L as LinkedSession } from '../session-D9wNGaf0.cjs';
export { P as Platform, W as WalletEntry } from '../session-D9wNGaf0.cjs';

interface BlinkWalletContextType {
    /** All currently connected wallets */
    connectedWallets: ConnectedWallet[];
    /** Get address for a specific chain */
    getAddressForChain: (chain: ChainType) => string | null;
    /** Check if a chain is connected */
    isChainConnected: (chain: ChainType) => boolean;
    /** Whether any wallet is connected */
    isConnected: boolean;
    /** Primary connected wallet address */
    address: string | null;
    /** Primary connected wallet chain */
    chain: ChainType | null;
    /** Modal state */
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    /** Connect a specific chain */
    connect: (chain?: ChainType) => Promise<void>;
    /** Disconnect a specific chain or all */
    disconnect: (chain?: ChainType) => Promise<void>;
    /** Disconnect all chains */
    disconnectAll: () => Promise<void>;
    /** Raw adapter results for advanced usage */
    adapters: Record<ChainType, AdapterHookResult>;
    /** Config */
    config: BlinkConnectConfig;
}
interface BlinkConnectProviderProps {
    config: BlinkConnectConfig;
    children: ReactNode;
}
declare function BlinkConnectProvider({ config, children }: BlinkConnectProviderProps): react_jsx_runtime.JSX.Element;
declare function useBlinkWalletContext(): BlinkWalletContextType;

interface UseWalletReturn {
    /** All connected wallets */
    wallets: ConnectedWallet[];
    /** Primary wallet address (first connected) */
    address: string | null;
    /** Primary wallet chain */
    chain: ChainType | null;
    /** Whether any wallet is connected */
    isConnected: boolean;
    /** Number of connected wallets */
    connectedCount: number;
    /** Open the connect modal, optionally for a specific chain */
    connect: (chain?: ChainType) => Promise<void>;
    /** Disconnect a specific chain or all */
    disconnect: (chain?: ChainType) => Promise<void>;
    /** Get address for a specific chain */
    getAddress: (chain: ChainType) => string | null;
    /** Check if a specific chain is connected */
    isChainConnected: (chain: ChainType) => boolean;
    /** Switch primary chain (opens modal for that chain) */
    switchChain: (chain: ChainType) => Promise<void>;
    /** Platform detection info (desktop/mobile/wallet-browser) */
    platform: PlatformInfo;
    /** Primary wallet details (chain + address) */
    primaryWallet: {
        chain: ChainType;
        address: string;
    } | null;
    /** All linked wallets (excludes primary) */
    linkedWallets: Array<{
        chain: ChainType;
        address: string;
    }>;
    /** Link an additional wallet by opening the modal for that chain */
    linkWallet: (chain: ChainType) => Promise<void>;
    /** Unlink a specific chain's wallet */
    unlinkWallet: (chain: ChainType) => void;
    /** Get the transport type used for a chain's connection */
    getTransport: (chain: ChainType) => Transport | null;
    /** Full linked session state */
    session: LinkedSession;
}
/**
 * Primary hook for wallet interaction.
 * v0.2.0 adds platform detection, session linking, and transport awareness.
 *
 * @example
 * ```tsx
 * const {
 *   wallets, address, isConnected, connect, disconnect,
 *   platform, primaryWallet, linkedWallets, linkWallet, getTransport,
 * } = useWallet();
 *
 * // Connect any chain
 * <button onClick={() => connect()}>Connect</button>
 *
 * // Link a specific chain
 * <button onClick={() => linkWallet('solana')}>Link Solana</button>
 *
 * // Check transport
 * const transport = getTransport('evm'); // 'injected' | 'walletconnect' | null
 * ```
 */
declare function useWallet(): UseWalletReturn;

interface UseConnectReturn {
    /** Open the connect modal */
    openModal: () => void;
    /** Close the connect modal */
    closeModal: () => void;
    /** Whether the modal is currently open */
    isModalOpen: boolean;
    /** Connect a specific chain directly (bypasses modal) */
    connectChain: (chain: ChainType) => Promise<void>;
    /** Disconnect a specific chain */
    disconnectChain: (chain: ChainType) => Promise<void>;
    /** Disconnect all chains */
    disconnectAll: () => Promise<void>;
}
/**
 * Hook for connection management (modal, connect, disconnect).
 *
 * @example
 * ```tsx
 * const { openModal, isModalOpen, connectChain } = useConnect();
 *
 * <button onClick={openModal}>Open Wallet Modal</button>
 * <button onClick={() => connectChain('evm')}>Connect EVM</button>
 * ```
 */
declare function useConnect(): UseConnectReturn;

interface BalanceResult {
    /** Formatted balance string */
    balance: string | null;
    /** Native token symbol */
    symbol: string | null;
    /** Whether balance is currently loading */
    isLoading: boolean;
    /** Error if balance fetch failed */
    error: Error | null;
    /** Manually refresh the balance */
    refetch: () => void;
}
/**
 * Hook to fetch wallet balance for a connected chain.
 * Auto-refreshes on an interval.
 *
 * @param chain - The chain to fetch balance for. Defaults to primary chain.
 * @param refreshInterval - Auto-refresh interval in ms. Default 30000 (30s). Set to 0 to disable.
 *
 * @example
 * ```tsx
 * const { balance, symbol, isLoading } = useBalance('evm');
 * // => { balance: "1.234", symbol: "ETH", isLoading: false }
 * ```
 */
declare function useBalance(chain?: ChainType, refreshInterval?: number): BalanceResult;

interface UseSignReturn {
    /**
     * Sign a message with the connected wallet.
     * Uses the primary chain or specified chain.
     */
    signMessage: (message: string, chain?: ChainType) => Promise<string>;
    /**
     * Sign and send a transaction.
     * Uses the primary chain or specified chain.
     */
    signTransaction: (tx: unknown, chain?: ChainType) => Promise<string>;
}
/**
 * Hook for signing messages and transactions.
 *
 * @example
 * ```tsx
 * const { signMessage, signTransaction } = useSign();
 *
 * const signature = await signMessage("Hello, World!");
 * const txHash = await signTransaction({ to: '0x...', value: '0.1' });
 * ```
 */
declare function useSign(): UseSignReturn;

interface ConnectModalProps {
    /** Limit which chains are shown */
    chains?: ChainType[];
    /** Theme override */
    theme?: 'light' | 'dark';
    /** Accent color (CSS color) */
    accentColor?: string;
    /** App logo URL */
    logo?: string;
    /** Custom CSS class */
    className?: string;
}
/**
 * Pre-built connect wallet modal. Renders platform-aware UI:
 * - Desktop: chain selector grid → wallet-specific connection (unchanged from v0.1)
 * - Mobile browser: wallet app deep links → link another wallet
 * - Wallet browser: prominent injected wallet → link others via WC
 *
 * @example
 * ```tsx
 * <ConnectModal theme="dark" />
 * <ConnectModal chains={['evm', 'solana', 'sui']} />
 * ```
 */
declare function ConnectModal({ chains, theme, accentColor, logo, className }: ConnectModalProps): react_jsx_runtime.JSX.Element | null;

interface ConnectButtonProps {
    /** Button label when disconnected */
    label?: string;
    /** Show chain icon when connected */
    showChainIcon?: boolean;
    /** Theme override */
    theme?: 'light' | 'dark';
    /** Custom CSS class */
    className?: string;
    /** Custom inline styles */
    style?: React.CSSProperties;
}
/**
 * Drop-in connect wallet button.
 * Shows "Connect Wallet" when disconnected, truncated address + chain when connected.
 *
 * @example
 * ```tsx
 * <ConnectButton />
 * <ConnectButton label="Sign In" theme="dark" />
 * ```
 */
declare function ConnectButton({ label, showChainIcon, theme, className, style, }: ConnectButtonProps): react_jsx_runtime.JSX.Element;

interface Props {
    chain: string;
    children: ReactNode;
    onError?: (error: Error, chain: string) => void;
}
interface State {
    hasError: boolean;
}
/**
 * Error boundary for individual chain providers.
 * If a chain adapter fails (missing SDK, SSR issue, etc.),
 * it renders children without that chain's provider instead of crashing the entire app.
 */
declare class ChainErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(): State;
    componentDidCatch(error: Error): void;
    render(): React.ReactNode;
}

export { type BalanceResult, BlinkConnectProvider, type BlinkConnectProviderProps, type BlinkWalletContextType, ChainErrorBoundary, ConnectButton, type ConnectButtonProps, ConnectModal, type ConnectModalProps, LinkedSession, PlatformInfo, Transport, type UseConnectReturn, type UseSignReturn, type UseWalletReturn, useBalance, useBlinkWalletContext, useConnect, useSign, useWallet };
