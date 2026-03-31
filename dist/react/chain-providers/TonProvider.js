import { useTonAdapter } from '../../chunk-AQXGPFKE.js';
import { useEffect } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { jsxs, jsx } from 'react/jsx-runtime';

function TonAdapterBridge({ onAdapter }) {
  const adapter = useTonAdapter();
  useEffect(() => {
    onAdapter("ton", adapter);
  }, [adapter.address, adapter.connected]);
  return null;
}
function TonProvider({ children, config, onAdapter }) {
  const tonManifestUrl = config.tonManifestUrl || (typeof window !== "undefined" ? `${window.location.origin}/tonconnect-manifest.json` : "https://goblink.io/tonconnect-manifest.json");
  return /* @__PURE__ */ jsxs(TonConnectUIProvider, { manifestUrl: tonManifestUrl, children: [
    /* @__PURE__ */ jsx(TonAdapterBridge, { onAdapter }),
    children
  ] });
}

export { TonProvider as default };
