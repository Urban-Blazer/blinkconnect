import { useBlinkWalletContext } from '../chunk-LFO4AAEG.js';
export { BlinkConnectProvider, ChainErrorBoundary, ConnectModal, useBlinkWalletContext } from '../chunk-LFO4AAEG.js';
import { SessionManager } from '../chunk-LZ2SQNZH.js';
import { getChainMeta, formatAddress } from '../chunk-6MBTNAJI.js';
import '../chunk-N4AYQGTJ.js';
import '../chunk-GDKKVREI.js';
import '../chunk-Z2TAFVYY.js';
import { getPlatformInfo } from '../chunk-CQ2V2S4O.js';
import '../chunk-WDCHLDKL.js';
import { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var globalSessionManager = null;
function getSessionManager() {
  if (!globalSessionManager) {
    globalSessionManager = new SessionManager();
    globalSessionManager.restore();
  }
  return globalSessionManager;
}
function useWallet() {
  const ctx = useBlinkWalletContext();
  const sessionManager = useMemo(() => getSessionManager(), []);
  const platform = useMemo(() => getPlatformInfo(), []);
  const prevWalletsRef = useRef("");
  useEffect(() => {
    const key = ctx.connectedWallets.map((w) => `${w.chain}:${w.address}`).join(",");
    if (key === prevWalletsRef.current) return;
    prevWalletsRef.current = key;
    const currentChains = new Set(ctx.connectedWallets.map((w) => w.chain));
    const sessionChains = new Set(sessionManager.getAllWallets().map((w) => w.chain));
    for (const wallet of ctx.connectedWallets) {
      if (!sessionManager.hasChain(wallet.chain)) {
        const transport = ctx.adapters[wallet.chain]?.transport ?? "injected";
        if (sessionManager.count === 0) {
          sessionManager.setPrimary(wallet.chain, wallet.address, transport);
        } else {
          sessionManager.linkWallet(wallet.chain, wallet.address, transport);
        }
      }
    }
    for (const chain of sessionChains) {
      if (!currentChains.has(chain)) {
        sessionManager.unlinkWallet(chain);
      }
    }
    sessionManager.persist();
  }, [ctx.connectedWallets, ctx.adapters, sessionManager]);
  const switchChain = useCallback(
    async (chain) => {
      if (!ctx.isChainConnected(chain)) {
        await ctx.connect(chain);
      }
    },
    [ctx]
  );
  const linkWallet = useCallback(
    async (chain) => {
      if (ctx.isChainConnected(chain)) {
        const addr = ctx.getAddressForChain(chain);
        if (addr) {
          const transport = ctx.adapters[chain]?.transport ?? "injected";
          sessionManager.linkWallet(chain, addr, transport);
          sessionManager.persist();
        }
        return;
      }
      await ctx.connect(chain);
    },
    [ctx, sessionManager]
  );
  const unlinkWallet = useCallback(
    (chain) => {
      sessionManager.unlinkWallet(chain);
      sessionManager.persist();
      ctx.disconnect(chain);
    },
    [ctx, sessionManager]
  );
  const getTransport = useCallback(
    (chain) => {
      return ctx.adapters[chain]?.transport ?? sessionManager.getTransport(chain);
    },
    [ctx.adapters, sessionManager]
  );
  const session = useMemo(() => sessionManager.getSession(), [
    sessionManager,
    // Re-derive when wallets change
    ctx.connectedWallets
  ]);
  const primaryWallet = useMemo(() => {
    if (session.primary) {
      return { chain: session.primary.chain, address: session.primary.address };
    }
    const first = ctx.connectedWallets[0];
    return first ? { chain: first.chain, address: first.address } : null;
  }, [session, ctx.connectedWallets]);
  const linkedWallets = useMemo(() => {
    return session.linked.map((w) => ({ chain: w.chain, address: w.address }));
  }, [session]);
  return {
    // v0.1 API (unchanged)
    wallets: ctx.connectedWallets,
    address: ctx.address,
    chain: ctx.chain,
    isConnected: ctx.isConnected,
    connectedCount: ctx.connectedWallets.length,
    connect: ctx.connect,
    disconnect: ctx.disconnect,
    getAddress: ctx.getAddressForChain,
    isChainConnected: ctx.isChainConnected,
    switchChain,
    // v0.2.0 additions
    platform,
    primaryWallet,
    linkedWallets,
    linkWallet,
    unlinkWallet,
    getTransport,
    session
  };
}

// src/react/useConnect.ts
function useConnect() {
  const ctx = useBlinkWalletContext();
  return {
    openModal: ctx.openModal,
    closeModal: ctx.closeModal,
    isModalOpen: ctx.isModalOpen,
    connectChain: async (chain) => ctx.connect(chain),
    disconnectChain: async (chain) => ctx.disconnect(chain),
    disconnectAll: ctx.disconnectAll
  };
}
function useBalance(chain, refreshInterval = 3e4) {
  const ctx = useBlinkWalletContext();
  const targetChain = chain || ctx.chain;
  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchBalance = useCallback(async () => {
    if (!targetChain) return;
    const adapter = ctx.adapters[targetChain];
    if (!adapter?.connected || !adapter.address) {
      setBalance(null);
      setSymbol(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setBalance(null);
      setSymbol(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch balance"));
    } finally {
      setIsLoading(false);
    }
  }, [targetChain, ctx.adapters]);
  useEffect(() => {
    fetchBalance();
    if (refreshInterval > 0) {
      const timer = setInterval(fetchBalance, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [fetchBalance, refreshInterval]);
  return {
    balance,
    symbol,
    isLoading,
    error,
    refetch: fetchBalance
  };
}
function useSign() {
  const ctx = useBlinkWalletContext();
  const signMessage = useCallback(
    async (message, chain) => {
      const targetChain = chain || ctx.chain;
      if (!targetChain) throw new Error("No wallet connected");
      throw new Error(
        `signMessage not yet implemented for ${targetChain}. Use the chain-specific SDK directly.`
      );
    },
    [ctx.chain]
  );
  const signTransaction = useCallback(
    async (tx, chain) => {
      const targetChain = chain || ctx.chain;
      if (!targetChain) throw new Error("No wallet connected");
      throw new Error(
        `signTransaction not yet implemented for ${targetChain}. Use the chain-specific SDK directly.`
      );
    },
    [ctx.chain]
  );
  return { signMessage, signTransaction };
}
function ConnectButton({
  label = "Connect Wallet",
  showChainIcon = true,
  theme,
  className,
  style
}) {
  const ctx = useBlinkWalletContext();
  const resolvedTheme = theme || ctx.config.theme || "dark";
  const isDark = resolvedTheme === "dark";
  const handleClick = () => {
    if (ctx.isConnected) {
      ctx.openModal();
    } else {
      ctx.openModal();
    }
  };
  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: ctx.isConnected ? "8px 16px" : "10px 20px",
    borderRadius: "12px",
    border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
    backgroundColor: ctx.isConnected ? isDark ? "#18181b" : "#f4f4f5" : isDark ? "#3b82f6" : "#2563eb",
    color: ctx.isConnected ? isDark ? "#fafafa" : "#09090b" : "#ffffff",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
    ...style
  };
  if (ctx.isConnected && ctx.address && ctx.chain) {
    const meta = getChainMeta(ctx.chain);
    return /* @__PURE__ */ jsxs("button", { onClick: handleClick, style: buttonStyle, className, children: [
      showChainIcon && meta && /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            width: "20px",
            height: "20px",
            borderRadius: "6px",
            backgroundColor: meta.color || "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "white",
            fontWeight: 700,
            flexShrink: 0
          },
          children: meta.symbol?.[0] || ctx.chain[0].toUpperCase()
        }
      ),
      /* @__PURE__ */ jsx("span", { children: formatAddress(ctx.address) }),
      ctx.connectedWallets.length > 1 && /* @__PURE__ */ jsxs(
        "span",
        {
          style: {
            backgroundColor: isDark ? "#27272a" : "#e4e4e7",
            borderRadius: "6px",
            padding: "1px 6px",
            fontSize: "11px",
            color: isDark ? "#a1a1aa" : "#71717a"
          },
          children: [
            "+",
            ctx.connectedWallets.length - 1
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("button", { onClick: handleClick, style: buttonStyle, className, children: label });
}

export { ConnectButton, useBalance, useConnect, useSign, useWallet };
