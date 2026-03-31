import { useAptosAdapter } from '../../chunk-7V2RUMX2.js';
import { useEffect } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { jsxs, jsx } from 'react/jsx-runtime';

function AptosAdapterBridge({ onAdapter }) {
  const adapter = useAptosAdapter();
  useEffect(() => {
    onAdapter("aptos", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function AptosProvider({ children, config, onAdapter }) {
  const persistSession = config.features?.persistSession ?? false;
  return /* @__PURE__ */ jsxs(AptosWalletAdapterProvider, { autoConnect: persistSession, children: [
    /* @__PURE__ */ jsx(AptosAdapterBridge, { onAdapter }),
    children
  ] });
}

export { AptosProvider as default };
