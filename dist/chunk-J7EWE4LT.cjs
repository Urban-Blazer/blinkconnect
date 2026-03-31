'use strict';

var chunkO65EVLPV_cjs = require('./chunk-O65EVLPV.cjs');
var chunk5E62Q4AS_cjs = require('./chunk-5E62Q4AS.cjs');
var chunkC6L62ULF_cjs = require('./chunk-C6L62ULF.cjs');
var chunkEDZ6LLUJ_cjs = require('./chunk-EDZ6LLUJ.cjs');
var chunkMCBQNE3Z_cjs = require('./chunk-MCBQNE3Z.cjs');
var chunkE3KQN26G_cjs = require('./chunk-E3KQN26G.cjs');
var react = require('react');
var wagmi = require('wagmi');
var reactQuery = require('@tanstack/react-query');
var react$1 = require('@reown/appkit/react');
var appkitAdapterWagmi = require('@reown/appkit-adapter-wagmi');
var appkitAdapterSolana = require('@reown/appkit-adapter-solana');
var chains = require('wagmi/chains');
var networks = require('@reown/appkit/networks');
var jsxRuntime = require('react/jsx-runtime');

var ChainErrorBoundary = class extends react.Component {
  constructor() {
    super(...arguments);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn(`[BlinkConnect] ${this.props.chain} provider failed to initialize:`, error.message);
    this.props.onError?.(error, this.props.chain);
  }
  render() {
    if (this.state.hasError) {
      return this.props.children;
    }
    return this.props.children;
  }
};
var CHAIN_PROVIDER_LOADERS = {
  sui: () => import('./react/chain-providers/SuiProvider.cjs'),
  aptos: () => import('./react/chain-providers/AptosProvider.cjs'),
  starknet: () => import('./react/chain-providers/StarknetProvider.cjs'),
  ton: () => import('./react/chain-providers/TonProvider.cjs'),
  tron: () => import('./react/chain-providers/TronProvider.cjs')
};
var BlinkWalletContext = react.createContext(void 0);
var appKitInitialized = false;
function initAppKit(config) {
  if (appKitInitialized) return;
  appKitInitialized = true;
  const evmChains = [
    chains.mainnet,
    chains.polygon,
    chains.optimism,
    chains.arbitrum,
    chains.base,
    chains.bsc,
    chains.avalanche,
    chains.gnosis,
    chains.sepolia,
    ...config.evmChains || []
  ];
  const wagmiAdapter = new appkitAdapterWagmi.WagmiAdapter({ networks: evmChains, projectId: config.projectId });
  const solanaAdapter = new appkitAdapterSolana.SolanaAdapter({ wallets: [] });
  const metadata = {
    name: config.appName || "BlinkConnect App",
    description: "Multi-chain wallet connection",
    url: config.appUrl || (typeof window !== "undefined" ? window.location.origin : "https://goblink.io"),
    icons: config.appIcon ? [config.appIcon] : ["https://goblink.io/icon.png"]
  };
  react$1.createAppKit({
    adapters: [wagmiAdapter, solanaAdapter],
    networks: [
      chains.mainnet,
      chains.polygon,
      chains.optimism,
      chains.arbitrum,
      chains.base,
      chains.bsc,
      chains.sepolia,
      networks.solana,
      networks.solanaTestnet,
      networks.solanaDevnet
    ],
    projectId: config.projectId,
    metadata,
    features: {
      analytics: config.features?.analytics ?? false,
      email: config.features?.socialLogin ?? true,
      socials: ["google", "apple", "discord", "x", "github", "farcaster"]
    },
    themeMode: config.theme === "auto" ? void 0 : config.theme || "light",
    enableWalletConnect: true,
    enableInjected: true,
    enableCoinbase: true,
    featuredWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
      // MetaMask
      "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
      // Phantom
      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
      // Trust Wallet
      "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e18e4a33e02bbbb5f7"
      // Coinbase Wallet
    ]
  });
  return wagmiAdapter;
}
var queryClient = new reactQuery.QueryClient();
function ChainProviders({ config, onAdapter, children }) {
  const enabledChains = config.chains;
  const isEnabled = (chain) => !enabledChains || enabledChains.includes(chain);
  const LazyProviders = react.useMemo(() => {
    const providers = [];
    for (const [chain, loader] of Object.entries(CHAIN_PROVIDER_LOADERS)) {
      if (isEnabled(chain)) {
        providers.push({
          chain,
          Component: react.lazy(loader)
        });
      }
    }
    return providers;
  }, [enabledChains?.join(",")]);
  let wrapped = children;
  for (let i = LazyProviders.length - 1; i >= 0; i--) {
    const { chain, Component: Component2 } = LazyProviders[i];
    const inner = wrapped;
    wrapped = /* @__PURE__ */ jsxRuntime.jsx(ChainErrorBoundary, { chain, onError: config.onError ? (err) => config.onError(err, chain) : void 0, children: /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, { fallback: inner, children: /* @__PURE__ */ jsxRuntime.jsx(Component2, { config, onAdapter, children: inner }) }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: wrapped });
}
function UnifiedWalletLayer({ config, children }) {
  const [isModalOpen, setIsModalOpen] = react.useState(false);
  const enabledChains = config.chains;
  const isEnabled = (chain) => !enabledChains || enabledChains.includes(chain);
  const [chainAdapters, setChainAdapters] = react.useState({});
  const handleAdapterUpdate = react.useCallback((chain, adapter) => {
    setChainAdapters((prev) => {
      const existing = prev[chain];
      if (existing && existing.address === adapter.address && existing.connected === adapter.connected) {
        return prev;
      }
      return { ...prev, [chain]: adapter };
    });
  }, []);
  const evmResult = chunkEDZ6LLUJ_cjs.useEvmAdapter();
  const nearResult = isEnabled("near") ? chunkE3KQN26G_cjs.useNearAdapter({ networkId: config.nearNetwork }) : chunkC6L62ULF_cjs.createNoopAdapter("near");
  const adapters = react.useMemo(
    () => ({
      evm: evmResult.evm,
      solana: evmResult.solana,
      bitcoin: evmResult.bitcoin,
      sui: chainAdapters.sui || chunkC6L62ULF_cjs.createNoopAdapter("sui"),
      near: nearResult,
      aptos: chainAdapters.aptos || chunkC6L62ULF_cjs.createNoopAdapter("aptos"),
      starknet: chainAdapters.starknet || chunkC6L62ULF_cjs.createNoopAdapter("starknet"),
      ton: chainAdapters.ton || chunkC6L62ULF_cjs.createNoopAdapter("ton"),
      tron: chainAdapters.tron || chunkC6L62ULF_cjs.createNoopAdapter("tron")
    }),
    [evmResult, nearResult, chainAdapters]
  );
  const connectedWallets = react.useMemo(() => {
    const wallets = [];
    for (const [chain, adapter] of Object.entries(adapters)) {
      if (adapter.connected && adapter.address && isEnabled(chain)) {
        wallets.push({ chain, address: adapter.address });
      }
    }
    return wallets;
  }, [adapters]);
  const getAddressForChain = react.useCallback(
    (chain) => adapters[chain]?.address ?? null,
    [adapters]
  );
  const isChainConnected = react.useCallback(
    (chain) => !!adapters[chain]?.connected,
    [adapters]
  );
  const connect = react.useCallback(
    async (chain) => {
      if (chain && adapters[chain]) {
        await adapters[chain].connect();
      } else {
        setIsModalOpen(true);
      }
    },
    [adapters]
  );
  const disconnect = react.useCallback(
    async (chain) => {
      if (chain && adapters[chain]) {
        await adapters[chain].disconnect();
      } else {
        for (const adapter of Object.values(adapters)) {
          if (adapter.connected) {
            try {
              await adapter.disconnect();
            } catch {
            }
          }
        }
      }
    },
    [adapters]
  );
  const disconnectAll = react.useCallback(async () => {
    for (const adapter of Object.values(adapters)) {
      if (adapter.connected) {
        try {
          await adapter.disconnect();
        } catch {
        }
      }
    }
  }, [adapters]);
  const primaryWallet = connectedWallets[0] ?? null;
  const value = react.useMemo(
    () => ({
      connectedWallets,
      getAddressForChain,
      isChainConnected,
      isConnected: connectedWallets.length > 0,
      address: primaryWallet?.address ?? null,
      chain: primaryWallet?.chain ?? null,
      isModalOpen,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
      connect,
      disconnect,
      disconnectAll,
      adapters,
      config
    }),
    [connectedWallets, isModalOpen, adapters, config]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(BlinkWalletContext.Provider, { value, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ChainProviders, { config, onAdapter: handleAdapterUpdate, children }),
    isModalOpen && /* @__PURE__ */ jsxRuntime.jsx(ConnectModalPortal, {})
  ] });
}
var LazyConnectModal = react.lazy(
  () => import('./ConnectModal-VKAIOVDM.cjs').then((m) => ({ default: m.ConnectModal }))
);
function ConnectModalPortal() {
  return /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntime.jsx(LazyConnectModal, {}) });
}
var cachedWagmiAdapter = null;
function BlinkConnectProvider({ config, children }) {
  if (!cachedWagmiAdapter) {
    const adapter = initAppKit(config);
    if (adapter) cachedWagmiAdapter = adapter;
  }
  if (!cachedWagmiAdapter) {
    const evmChains = [chains.mainnet, chains.polygon, chains.optimism, chains.arbitrum, chains.base, chains.bsc, chains.avalanche, chains.gnosis, chains.sepolia];
    cachedWagmiAdapter = new appkitAdapterWagmi.WagmiAdapter({ networks: evmChains, projectId: config.projectId });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(wagmi.WagmiProvider, { config: cachedWagmiAdapter.wagmiConfig, children: /* @__PURE__ */ jsxRuntime.jsx(reactQuery.QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntime.jsx(UnifiedWalletLayer, { config, children }) }) });
}
function useBlinkWalletContext() {
  const ctx = react.useContext(BlinkWalletContext);
  if (!ctx) {
    throw new Error("useBlinkWalletContext must be used within <BlinkConnectProvider>");
  }
  return ctx;
}
var LazySuiConnectView = react.lazy(
  () => import('./react/chain-views/SuiConnectView.cjs').catch(() => ({
    default: ({ colors }) => /* @__PURE__ */ jsxRuntime.jsx(ChainUnavailableMessage, { chain: "Sui", pkg: "@mysten/dapp-kit", colors })
  }))
);
var LazyStarknetConnectView = react.lazy(
  () => import('./react/chain-views/StarknetConnectView.cjs').catch(() => ({
    default: ({ colors }) => /* @__PURE__ */ jsxRuntime.jsx(ChainUnavailableMessage, { chain: "Starknet", pkg: "@starknet-react/core", colors })
  }))
);
function ChainUnavailableMessage({ chain, pkg, colors }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center", padding: "24px 16px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("p", { style: { fontSize: "14px", color: colors.textSecondary, marginBottom: "8px" }, children: [
      chain,
      " wallet connection is not available."
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("p", { style: { fontSize: "13px", color: colors.textMuted }, children: [
      "Install ",
      /* @__PURE__ */ jsxRuntime.jsx("code", { style: { backgroundColor: colors.bgSecondary || colors.hoverBg, padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }, children: pkg }),
      " to enable ",
      chain,
      " support."
    ] })
  ] });
}
var ALL_CHAINS = [
  { id: "evm", name: "EVM Chains", description: "Ethereum, Base, Arbitrum, BNB +10 more", gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)" },
  { id: "solana", name: "Solana", description: "Fast & low-cost transactions", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "bitcoin", name: "Bitcoin", description: "Digital gold standard", gradient: "linear-gradient(135deg, #f97316, #eab308)" },
  { id: "sui", name: "Sui", description: "Next-gen Move blockchain", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { id: "near", name: "NEAR", description: "Simple, secure & scalable", gradient: "linear-gradient(135deg, #22c55e, #14b8a6)" },
  { id: "aptos", name: "Aptos", description: "Safe & scalable Layer 1", gradient: "linear-gradient(135deg, #14b8a6, #22c55e)" },
  { id: "starknet", name: "Starknet", description: "ZK-rollup on Ethereum", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { id: "ton", name: "TON", description: "The Open Network", gradient: "linear-gradient(135deg, #0ea5e9, #3b82f6)" },
  { id: "tron", name: "Tron", description: "Decentralized internet", gradient: "linear-gradient(135deg, #ef4444, #f43f5e)" }
];
function getColors(isDark, accentColor) {
  return {
    bg: isDark ? "#09090b" : "#ffffff",
    bgSecondary: isDark ? "#18181b" : "#f4f4f5",
    border: isDark ? "#27272a" : "#e4e4e7",
    text: isDark ? "#fafafa" : "#09090b",
    textSecondary: isDark ? "#a1a1aa" : "#71717a",
    textMuted: isDark ? "#71717a" : "#a1a1aa",
    accent: accentColor || "#3b82f6",
    connectedBg: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)",
    connectedBorder: isDark ? "#166534" : "#bbf7d0",
    connectedText: isDark ? "#4ade80" : "#16a34a",
    dangerBg: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
    dangerText: isDark ? "#f87171" : "#dc2626",
    hoverBg: isDark ? "#27272a" : "#f4f4f5"
  };
}
function ConnectModal({ chains, theme, accentColor, logo, className }) {
  const ctx = useBlinkWalletContext();
  const resolvedTheme = theme || ctx.config.theme || "dark";
  const isDark = resolvedTheme === "dark";
  const colors = getColors(isDark, accentColor);
  const [selectedChain, setSelectedChain] = react.useState(null);
  const previousSuiRef = react.useRef(ctx.isChainConnected("sui"));
  const platformInfo = react.useMemo(() => chunkMCBQNE3Z_cjs.getPlatformInfo(), []);
  const visibleChains = ALL_CHAINS.filter((c) => {
    if (chains && !chains.includes(c.id)) return false;
    if (ctx.config.chains && !ctx.config.chains.includes(c.id)) return false;
    return true;
  });
  const suiConnected = ctx.isChainConnected("sui");
  react.useEffect(() => {
    if (!previousSuiRef.current && suiConnected && selectedChain === "sui") {
      setTimeout(() => {
        ctx.closeModal();
        setSelectedChain(null);
      }, 400);
    }
    previousSuiRef.current = suiConnected;
  }, [suiConnected, selectedChain, ctx]);
  react.useEffect(() => {
    if (!ctx.isModalOpen) setSelectedChain(null);
  }, [ctx.isModalOpen]);
  if (!ctx.isModalOpen) return null;
  const handleConnect = async (chain) => {
    try {
      if (chain === "evm" || chain === "solana" || chain === "bitcoin") {
        ctx.closeModal();
        await ctx.connect(chain);
        return;
      }
      await ctx.connect(chain);
    } catch (e) {
      console.error(`[BlinkConnect] Failed to connect ${chain}:`, e);
    }
  };
  const handleBack = () => setSelectedChain(null);
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px"
  };
  const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)"
  };
  const modalStyle = {
    position: "relative",
    backgroundColor: colors.bg,
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    maxWidth: "420px",
    width: "100%",
    padding: "24px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: `1px solid ${colors.border}`
  };
  const renderContent = () => {
    if (selectedChain) {
      return renderChainConnect(selectedChain, handleConnect, handleBack, colors, ctx);
    }
    switch (platformInfo.platform) {
      case "mobile-browser":
        return /* @__PURE__ */ jsxRuntime.jsx(
          MobileBrowserView,
          {
            visibleChains,
            colors,
            ctx,
            platformInfo,
            onSelectChain: setSelectedChain,
            onConnect: handleConnect
          }
        );
      case "wallet-browser":
        return /* @__PURE__ */ jsxRuntime.jsx(
          WalletBrowserView,
          {
            visibleChains,
            colors,
            ctx,
            platformInfo,
            onSelectChain: setSelectedChain,
            onConnect: handleConnect
          }
        );
      default:
        return /* @__PURE__ */ jsxRuntime.jsx(
          DesktopChainList,
          {
            visibleChains,
            colors,
            isDark,
            ctx,
            onSelectChain: setSelectedChain
          }
        );
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: overlayStyle, className, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: backdropStyle, onClick: ctx.closeModal }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: modalStyle, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          logo && /* @__PURE__ */ jsxRuntime.jsx(
            "img",
            {
              src: logo,
              alt: "",
              style: { width: "24px", height: "24px", borderRadius: "6px", marginBottom: "4px" }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("h2", { style: { fontSize: "20px", fontWeight: 700, color: colors.text, margin: 0 }, children: getHeaderTitle(selectedChain, platformInfo, ctx.connectedWallets.length > 0) }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "14px", color: colors.textSecondary, margin: "2px 0 0 0" }, children: getHeaderSubtitle(selectedChain, platformInfo, ctx.connectedWallets.length > 0) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: selectedChain ? handleBack : ctx.closeModal,
            style: {
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: colors.textSecondary,
              fontSize: "18px"
            },
            children: selectedChain ? "\u2190" : "\u2715"
          }
        )
      ] }),
      renderContent(),
      /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          style: {
            marginTop: "20px",
            paddingTop: "12px",
            borderTop: `1px solid ${colors.border}`,
            textAlign: "center"
          },
          children: /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "12px", color: colors.textMuted, margin: 0 }, children: platformInfo.isMobile ? "Tap a wallet to open the app and approve the connection" : "Connect multiple chains \u2014 they all stay connected simultaneously" })
        }
      )
    ] })
  ] });
}
function getHeaderTitle(selectedChain, platform, hasConnected) {
  if (selectedChain) return "Connect Wallet";
  if (platform.platform === "mobile-browser" && hasConnected) return "Link Another Wallet";
  if (platform.platform === "wallet-browser") return "Connect Wallet";
  return "Select Chain";
}
function getHeaderSubtitle(selectedChain, platform, hasConnected) {
  if (selectedChain) {
    return ALL_CHAINS.find((c) => c.id === selectedChain)?.description ?? "";
  }
  if (platform.platform === "mobile-browser" && !hasConnected) {
    return "Choose a wallet app to connect";
  }
  if (platform.platform === "mobile-browser" && hasConnected) {
    return "Connect additional chains";
  }
  if (platform.platform === "wallet-browser") {
    return `Detected ${platform.walletBrowser || "wallet"} browser`;
  }
  return "Choose a blockchain to connect";
}
function DesktopChainList({ visibleChains, colors, isDark, ctx, onSelectChain }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: visibleChains.map((chain) => {
    const connected = ctx.isChainConnected(chain.id);
    const addr = ctx.getAddressForChain(chain.id);
    const meta = chunkO65EVLPV_cjs.getChainMeta(chain.id);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        onClick: connected ? void 0 : () => onSelectChain(chain.id),
        role: connected ? void 0 : "button",
        style: {
          padding: "14px",
          borderRadius: "12px",
          border: `2px solid ${connected ? colors.connectedBorder : colors.border}`,
          backgroundColor: connected ? colors.connectedBg : "transparent",
          cursor: connected ? "default" : "pointer",
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        },
        onMouseEnter: (e) => {
          if (!connected) {
            e.currentTarget.style.backgroundColor = colors.hoverBg;
            e.currentTarget.style.borderColor = isDark ? "#3f3f46" : "#d4d4d8";
          }
        },
        onMouseLeave: (e) => {
          if (!connected) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = colors.border;
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                style: {
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: chain.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  flexShrink: 0
                },
                children: meta?.symbol?.[0] || chain.name[0]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 600, fontSize: "14px", color: colors.text }, children: chain.name }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", color: connected ? colors.connectedText : colors.textSecondary }, children: connected && addr ? chunkO65EVLPV_cjs.formatAddress(addr) : chain.description })
            ] })
          ] }),
          connected ? /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                ctx.disconnect(chain.id);
              },
              style: {
                padding: "4px 10px",
                fontSize: "12px",
                borderRadius: "8px",
                backgroundColor: colors.dangerBg,
                color: colors.dangerText,
                border: "none",
                cursor: "pointer",
                fontWeight: 500
              },
              children: "Disconnect"
            }
          ) : /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: colors.textMuted, fontSize: "14px" }, children: "\u2192" })
        ]
      },
      chain.id
    );
  }) });
}
function MobileBrowserView({ visibleChains, colors, ctx, platformInfo, onSelectChain, onConnect }) {
  const hasConnected = ctx.connectedWallets.length > 0;
  react.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const chain of visibleChains) {
      for (const wallet of chunk5E62Q4AS_cjs.getWalletsForChain(chain.id)) {
        if (!seen.has(wallet.id)) {
          seen.add(wallet.id);
          result.push(wallet);
        }
      }
    }
    return result;
  }, [visibleChains]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    hasConnected && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: ctx.connectedWallets.map((w) => {
      const chainMeta = ALL_CHAINS.find((c) => c.id === w.chain);
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          style: {
            padding: "12px 14px",
            borderRadius: "12px",
            border: `2px solid ${colors.connectedBorder}`,
            backgroundColor: colors.connectedBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  style: {
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: chainMeta?.gradient || "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0
                  },
                  children: chainMeta?.name[0] || "?"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { fontWeight: 600, fontSize: "13px", color: colors.connectedText }, children: [
                  chainMeta?.name || w.chain,
                  " \u2713"
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", color: colors.textSecondary }, children: chunkO65EVLPV_cjs.formatAddress(w.address) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => ctx.disconnect(w.chain),
                style: {
                  padding: "4px 8px",
                  fontSize: "11px",
                  borderRadius: "6px",
                  backgroundColor: colors.dangerBg,
                  color: colors.dangerText,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500
                },
                children: "\u2715"
              }
            )
          ]
        },
        w.chain
      );
    }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      hasConnected && /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
        fontSize: "12px",
        fontWeight: 600,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "8px"
      }, children: "Link another wallet" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
        visibleChains.filter((c) => ["evm", "solana", "bitcoin"].includes(c.id) && !ctx.isChainConnected(c.id)).map((chain) => /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => onConnect(chain.id),
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              backgroundColor: "transparent",
              color: colors.text,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "inherit",
              width: "100%",
              transition: "background-color 0.15s"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  style: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: chain.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0
                  },
                  children: chain.name[0]
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "left" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { children: chain.name }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", fontWeight: 400, color: colors.textSecondary }, children: "Opens wallet selector" })
              ] })
            ]
          },
          chain.id
        )),
        visibleChains.filter((c) => !["evm", "solana", "bitcoin"].includes(c.id) && !ctx.isChainConnected(c.id)).map((chain) => /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => onSelectChain(chain.id),
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              backgroundColor: "transparent",
              color: colors.text,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "inherit",
              width: "100%",
              transition: "background-color 0.15s"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  style: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: chain.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0
                  },
                  children: chain.name[0]
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "left" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { children: chain.name }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", fontWeight: 400, color: colors.textSecondary }, children: chain.description })
              ] })
            ]
          },
          chain.id
        ))
      ] })
    ] })
  ] });
}
function WalletBrowserView({ visibleChains, colors, ctx, platformInfo, onSelectChain, onConnect }) {
  const nativeChains = platformInfo.injectedProviders;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
        fontSize: "12px",
        fontWeight: 600,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "8px"
      }, children: platformInfo.walletBrowser ? `${platformInfo.walletBrowser} wallet` : "Detected wallet" }),
      visibleChains.filter((c) => nativeChains.includes(c.id)).map((chain) => {
        const connected = ctx.isChainConnected(chain.id);
        const addr = ctx.getAddressForChain(chain.id);
        return /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            style: {
              padding: "14px",
              borderRadius: "12px",
              border: `2px solid ${connected ? colors.connectedBorder : colors.accent}`,
              backgroundColor: connected ? colors.connectedBg : `${colors.accent}11`,
              cursor: connected ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px"
            },
            onClick: connected ? void 0 : () => onConnect(chain.id),
            role: connected ? void 0 : "button",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    style: {
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: chain.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0
                    },
                    children: chain.name[0]
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 600, fontSize: "14px", color: colors.text }, children: chain.name }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", color: connected ? colors.connectedText : colors.textSecondary }, children: connected && addr ? chunkO65EVLPV_cjs.formatAddress(addr) : "Tap to connect" })
                ] })
              ] }),
              connected && /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    ctx.disconnect(chain.id);
                  },
                  style: {
                    padding: "4px 10px",
                    fontSize: "12px",
                    borderRadius: "8px",
                    backgroundColor: colors.dangerBg,
                    color: colors.dangerText,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500
                  },
                  children: "Disconnect"
                }
              )
            ]
          },
          chain.id
        );
      })
    ] }),
    visibleChains.filter((c) => !nativeChains.includes(c.id) && !ctx.isChainConnected(c.id)).length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
        fontSize: "12px",
        fontWeight: 600,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "8px"
      }, children: "Link another chain" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: visibleChains.filter((c) => !nativeChains.includes(c.id) && !ctx.isChainConnected(c.id)).map((chain) => /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          onClick: () => {
            if (["evm", "solana", "bitcoin"].includes(chain.id)) {
              onConnect(chain.id);
            } else {
              onSelectChain(chain.id);
            }
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            borderRadius: "10px",
            border: `1px solid ${colors.border}`,
            backgroundColor: "transparent",
            color: colors.text,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "inherit",
            width: "100%"
          },
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                style: {
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: chain.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "12px",
                  flexShrink: 0
                },
                children: chain.name[0]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: chain.name }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { style: { marginLeft: "auto", fontSize: "12px", color: colors.textMuted }, children: "\u{1F517}" })
          ]
        },
        chain.id
      )) })
    ] }),
    ctx.connectedWallets.filter((w) => !nativeChains.includes(w.chain)).length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
        fontSize: "12px",
        fontWeight: 600,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "8px"
      }, children: "Linked wallets" }),
      ctx.connectedWallets.filter((w) => !nativeChains.includes(w.chain)).map((w) => {
        const chainMeta = ALL_CHAINS.find((c) => c.id === w.chain);
        return /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${colors.connectedBorder}`,
              backgroundColor: colors.connectedBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontSize: "12px", color: colors.connectedText, fontWeight: 600 }, children: chainMeta?.name || w.chain }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontSize: "12px", color: colors.textSecondary }, children: chunkO65EVLPV_cjs.formatAddress(w.address) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: () => ctx.disconnect(w.chain),
                  style: {
                    padding: "2px 6px",
                    fontSize: "11px",
                    borderRadius: "4px",
                    backgroundColor: colors.dangerBg,
                    color: colors.dangerText,
                    border: "none",
                    cursor: "pointer"
                  },
                  children: "\u2715"
                }
              )
            ]
          },
          w.chain
        );
      })
    ] })
  ] });
}
function renderChainConnect(selectedChain, handleConnect, _handleBack, colors, ctx) {
  if (selectedChain === "sui") {
    return /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, { colors }), children: /* @__PURE__ */ jsxRuntime.jsx(LazySuiConnectView, { colors, onClose: ctx.closeModal }) });
  }
  if (selectedChain === "starknet") {
    return /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, { colors }), children: /* @__PURE__ */ jsxRuntime.jsx(LazyStarknetConnectView, { colors, onClose: ctx.closeModal }) });
  }
  const chain = ALL_CHAINS.find((c) => c.id === selectedChain);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "14px", color: colors.textSecondary, marginBottom: "16px" }, children: chain.description }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: () => handleConnect(selectedChain),
        style: {
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: colors.accent,
          color: "white",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer"
        },
        children: "Connect Wallet"
      }
    ),
    (selectedChain === "evm" || selectedChain === "solana" || selectedChain === "bitcoin") && /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "12px", color: colors.textMuted, textAlign: "center", marginTop: "12px" }, children: "Powered by ReOwn AppKit \u2014 350+ wallets" })
  ] });
}
function LoadingSpinner({ colors }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { textAlign: "center", padding: "24px 0" }, children: /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "14px", color: colors.textSecondary }, children: "Loading..." }) });
}

exports.BlinkConnectProvider = BlinkConnectProvider;
exports.ChainErrorBoundary = ChainErrorBoundary;
exports.ConnectModal = ConnectModal;
exports.useBlinkWalletContext = useBlinkWalletContext;
