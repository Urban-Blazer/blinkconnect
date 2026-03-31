import { useSuiAdapter } from '../../chunk-67NTETCJ.js';
import { useEffect } from 'react';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { jsx, jsxs } from 'react/jsx-runtime';

var suiNetworks = {
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: "mainnet" },
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: "testnet" },
  devnet: { url: "https://fullnode.devnet.sui.io:443", network: "devnet" }
};
function SuiAdapterBridge({ onAdapter }) {
  const adapter = useSuiAdapter();
  useEffect(() => {
    onAdapter("sui", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function SuiProvider({ children, config, onAdapter }) {
  const suiNetwork = config.suiNetwork || "mainnet";
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsx(SuiClientProvider, { networks: suiNetworks, defaultNetwork: suiNetwork, children: /* @__PURE__ */ jsxs(WalletProvider, { autoConnect: persistSession, children: [
    /* @__PURE__ */ jsx(SuiAdapterBridge, { onAdapter }),
    children
  ] }) });
}

export { SuiProvider as default };
