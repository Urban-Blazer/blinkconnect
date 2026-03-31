import { getWalletsForChain } from '../../chunk-N4AYQGTJ.js';
import { getPlatformInfo } from '../../chunk-CQ2V2S4O.js';
import { useState, useMemo } from 'react';
import { useWallets, useConnectWallet } from '@mysten/dapp-kit';
import { jsxs, jsx } from 'react/jsx-runtime';

function SuiConnectView({ colors, onClose }) {
  const wallets = useWallets();
  const { mutate: connectWallet, isPending } = useConnectWallet();
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const platformInfo = useMemo(() => getPlatformInfo(), []);
  const handleConnect = (wallet) => {
    setError(null);
    setConnecting(wallet.name);
    console.log("[BlinkConnect] Connecting Sui wallet:", wallet.name, wallet);
    connectWallet(
      { wallet },
      {
        onSuccess: () => {
          console.log("[BlinkConnect] Sui wallet connected:", wallet.name);
          setTimeout(onClose, 400);
        },
        onError: (err) => {
          console.error("[BlinkConnect] Sui wallet connect error:", err);
          setError(err?.message || "Connection failed");
          setConnecting(null);
        }
      }
    );
  };
  const noWallets = wallets.length === 0;
  const isMobile = platformInfo.isMobile;
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontSize: "14px", color: colors.textSecondary, marginBottom: "8px" }, children: isMobile && noWallets ? "Open a Sui wallet app or install one to connect" : "Select a Sui wallet" }),
    error && /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "#ef4444", padding: "8px 12px", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "8px" }, children: error }),
    noWallets && !isMobile && /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: colors.textMuted, textAlign: "center", padding: "20px 0" }, children: "No Sui wallets detected. Install a Sui wallet extension." }),
    noWallets && isMobile && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: getWalletsForChain("sui").map((wallet) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: wallet.appStore || wallet.playStore || "#",
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: `1px solid ${colors.border}`,
          backgroundColor: "transparent",
          color: colors.text,
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500
        },
        children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "20px" }, children: wallet.icon }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { children: wallet.name }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: colors.textSecondary }, children: "Install app" })
          ] })
        ]
      },
      wallet.id
    )) }),
    wallets.map((wallet) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => handleConnect(wallet),
        disabled: isPending,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: `1px solid ${colors.border}`,
          backgroundColor: connecting === wallet.name ? (colors.accent || "#3b82f6") + "22" : "transparent",
          color: colors.text,
          cursor: isPending ? "wait" : "pointer",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "inherit",
          transition: "background-color 0.15s",
          width: "100%",
          opacity: isPending && connecting !== wallet.name ? 0.5 : 1
        },
        children: [
          wallet.icon && /* @__PURE__ */ jsx(
            "img",
            {
              src: wallet.icon,
              alt: wallet.name,
              style: { width: "28px", height: "28px", borderRadius: "6px" }
            }
          ),
          /* @__PURE__ */ jsx("span", { children: connecting === wallet.name && isPending ? `Connecting ${wallet.name}...` : wallet.name })
        ]
      },
      wallet.name
    ))
  ] });
}

export { SuiConnectView as default };
