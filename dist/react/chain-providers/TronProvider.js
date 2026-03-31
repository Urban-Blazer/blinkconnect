import { useTronAdapter } from '../../chunk-AMVR2NCL.js';
import { useEffect } from 'react';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { jsxs, jsx } from 'react/jsx-runtime';

var tronAdapters = [new TronLinkAdapter()];
function TronAdapterBridge({ onAdapter }) {
  const adapter = useTronAdapter();
  useEffect(() => {
    onAdapter("tron", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function TronProvider({ children, config, onAdapter }) {
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsxs(WalletProvider, { adapters: tronAdapters, autoConnect: persistSession, children: [
    /* @__PURE__ */ jsx(TronAdapterBridge, { onAdapter }),
    children
  ] });
}

export { TronProvider as default };
