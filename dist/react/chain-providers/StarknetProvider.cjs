'use strict';

var chunkV3JUQPQH_cjs = require('../../chunk-V3JUQPQH.cjs');
var react = require('react');
var core = require('@starknet-react/core');
var chains = require('@starknet-react/chains');
var jsxRuntime = require('react/jsx-runtime');

var starknetConnectors = [
  new core.InjectedConnector({ options: { id: "argentX" } }),
  new core.InjectedConnector({ options: { id: "braavos" } })
];
function StarknetAdapterBridge({ onAdapter }) {
  const adapter = chunkV3JUQPQH_cjs.useStarknetAdapter();
  react.useEffect(() => {
    onAdapter("starknet", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function StarknetProvider({ children, config, onAdapter }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    core.StarknetConfig,
    {
      chains: [chains.mainnet],
      provider: core.publicProvider(),
      connectors: starknetConnectors,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(StarknetAdapterBridge, { onAdapter }),
        children
      ]
    }
  );
}

module.exports = StarknetProvider;
