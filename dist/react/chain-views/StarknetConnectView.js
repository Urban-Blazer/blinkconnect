import { useConnect } from '@starknet-react/core';
import { jsxs, jsx } from 'react/jsx-runtime';

var walletNames = ["Argent X", "Braavos"];
var walletEmojis = ["\u{1F98A}", "\u{1F6E1}\uFE0F"];
function StarknetConnectView({ colors, onClose }) {
  const { connect, connectors } = useConnect();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { style: { fontSize: "14px", color: colors.textSecondary, marginBottom: "12px" }, children: "Connect your Starknet wallet" }),
    connectors.map((connector, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          connect({ connector });
          onClose();
        },
        style: {
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          border: `2px solid ${colors.border}`,
          backgroundColor: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
          transition: "all 0.15s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = colors.hoverBg;
          e.currentTarget.style.borderColor = colors.accent;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = colors.border;
        },
        children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "20px" }, children: walletEmojis[i] || "\u{1F4B3}" }),
          /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: colors.text }, children: walletNames[i] || `Wallet ${i + 1}` })
        ]
      },
      i
    ))
  ] });
}

export { StarknetConnectView as default };
