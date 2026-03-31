'use strict';

var chunkCJFEUXZS_cjs = require('../../chunk-CJFEUXZS.cjs');
var react = require('react');
var walletAdapterReact = require('@aptos-labs/wallet-adapter-react');
var jsxRuntime = require('react/jsx-runtime');

function AptosAdapterBridge({ onAdapter }) {
  const adapter = chunkCJFEUXZS_cjs.useAptosAdapter();
  react.useEffect(() => {
    onAdapter("aptos", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function AptosProvider({ children, config, onAdapter }) {
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsxRuntime.jsxs(walletAdapterReact.AptosWalletAdapterProvider, { autoConnect: persistSession, children: [
    /* @__PURE__ */ jsxRuntime.jsx(AptosAdapterBridge, { onAdapter }),
    children
  ] });
}

module.exports = AptosProvider;
