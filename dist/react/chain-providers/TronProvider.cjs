'use strict';

var chunkVBDATXS4_cjs = require('../../chunk-VBDATXS4.cjs');
var react = require('react');
var tronwalletAdapterReactHooks = require('@tronweb3/tronwallet-adapter-react-hooks');
var tronwalletAdapters = require('@tronweb3/tronwallet-adapters');
var jsxRuntime = require('react/jsx-runtime');

var tronAdapters = [new tronwalletAdapters.TronLinkAdapter()];
function TronAdapterBridge({ onAdapter }) {
  const adapter = chunkVBDATXS4_cjs.useTronAdapter();
  react.useEffect(() => {
    onAdapter("tron", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function TronProvider({ children, config, onAdapter }) {
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsxRuntime.jsxs(tronwalletAdapterReactHooks.WalletProvider, { adapters: tronAdapters, autoConnect: persistSession, children: [
    /* @__PURE__ */ jsxRuntime.jsx(TronAdapterBridge, { onAdapter }),
    children
  ] });
}

module.exports = TronProvider;
