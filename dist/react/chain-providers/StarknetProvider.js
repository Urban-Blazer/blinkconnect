import { useStarknetAdapter } from '../../chunk-WI6LFS7L.js';
import { useEffect } from 'react';
import { InjectedConnector, StarknetConfig, publicProvider } from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';
import { jsxs, jsx } from 'react/jsx-runtime';

var starknetConnectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } })
];
function StarknetAdapterBridge({ onAdapter }) {
  const adapter = useStarknetAdapter();
  useEffect(() => {
    onAdapter("starknet", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function StarknetProvider({ children, config, onAdapter }) {
  return /* @__PURE__ */ jsxs(
    StarknetConfig,
    {
      chains: [mainnet],
      provider: publicProvider(),
      connectors: starknetConnectors,
      children: [
        /* @__PURE__ */ jsx(StarknetAdapterBridge, { onAdapter }),
        children
      ]
    }
  );
}

export { StarknetProvider as default };
