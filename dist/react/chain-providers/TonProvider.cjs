'use strict';

var chunkGYILDWZB_cjs = require('../../chunk-GYILDWZB.cjs');
var react = require('react');
var uiReact = require('@tonconnect/ui-react');
var jsxRuntime = require('react/jsx-runtime');

function TonAdapterBridge({ onAdapter }) {
  const adapter = chunkGYILDWZB_cjs.useTonAdapter();
  react.useEffect(() => {
    onAdapter("ton", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function TonProvider({ children, config, onAdapter }) {
  const tonManifestUrl = config.tonManifestUrl || (typeof window !== "undefined" ? `${window.location.origin}/tonconnect-manifest.json` : "https://goblink.io/tonconnect-manifest.json");
  return /* @__PURE__ */ jsxRuntime.jsxs(uiReact.TonConnectUIProvider, { manifestUrl: tonManifestUrl, children: [
    /* @__PURE__ */ jsxRuntime.jsx(TonAdapterBridge, { onAdapter }),
    children
  ] });
}

module.exports = TonProvider;
