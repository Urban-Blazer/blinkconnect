'use strict';

var chunkIT2QG6W2_cjs = require('../../chunk-IT2QG6W2.cjs');
var react = require('react');
var dappKit = require('@mysten/dapp-kit');
var jsxRuntime = require('react/jsx-runtime');

var suiNetworks = {
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: "mainnet" },
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: "testnet" },
  devnet: { url: "https://fullnode.devnet.sui.io:443", network: "devnet" }
};
function SuiAdapterBridge({ onAdapter }) {
  const adapter = chunkIT2QG6W2_cjs.useSuiAdapter();
  react.useEffect(() => {
    onAdapter("sui", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function SuiProvider({ children, config, onAdapter }) {
  const suiNetwork = config.suiNetwork || "mainnet";
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsxRuntime.jsx(dappKit.SuiClientProvider, { networks: suiNetworks, defaultNetwork: suiNetwork, children: /* @__PURE__ */ jsxRuntime.jsxs(dappKit.WalletProvider, { autoConnect: persistSession, children: [
    /* @__PURE__ */ jsxRuntime.jsx(SuiAdapterBridge, { onAdapter }),
    children
  ] }) });
}

module.exports = SuiProvider;
