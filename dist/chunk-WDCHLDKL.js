import { useState, useEffect, useCallback } from 'react';
import { NearConnector } from '@hot-labs/near-connect';

function extractAccountId(entry) {
  if (typeof entry === "string") return entry;
  if (typeof entry === "object" && typeof entry.accountId === "string") return entry.accountId;
  return null;
}
async function resolveAccountId(wallet, timeoutMs = 1e4) {
  if (!wallet.getAccounts) return null;
  const result = await Promise.race([
    wallet.getAccounts(),
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))
  ]);
  if (!result || !Array.isArray(result) || result.length === 0) return null;
  return extractAccountId(result[0]);
}
function useNearAdapter(options) {
  const [address, setAddress] = useState(null);
  const [connector, setConnector] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const networkId = options?.networkId || "mainnet";
    const nc = new NearConnector({
      networkId,
      network: networkId,
      logger: { log: console.log, error: console.error }
    });
    setConnector(nc);
    const checkConnection = async () => {
      try {
        const wallet = await nc.wallet();
        if (!wallet) return;
        const accountId = await resolveAccountId(wallet);
        if (accountId) setAddress(accountId);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn("[BlinkConnect] NEAR check connection:", message);
      }
    };
    const timer = setTimeout(checkConnection, 500);
    const onSignIn = async () => {
      try {
        const wallet = await nc.wallet();
        if (!wallet) return;
        const accountId = await resolveAccountId(wallet);
        if (accountId) setAddress(accountId);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn("[BlinkConnect] NEAR sign-in handler:", message);
      }
    };
    const onSignOut = () => setAddress(null);
    nc.on("wallet:signIn", onSignIn);
    nc.on("wallet:signOut", onSignOut);
    return () => {
      clearTimeout(timer);
      nc.off("wallet:signIn", onSignIn);
      nc.off("wallet:signOut", onSignOut);
    };
  }, [options?.networkId]);
  const connect = useCallback(async () => {
    if (!connector) {
      console.error("[BlinkConnect] NEAR connector not initialized \u2014 wallet SDK may still be loading");
      return;
    }
    console.log("[BlinkConnect] Connecting NEAR wallet...");
    try {
      const wallet = await Promise.race([
        connector.connect(),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("NEAR connection timed out after 10s")), 1e4)
        )
      ]);
      const accountId = await resolveAccountId(wallet);
      if (accountId) {
        setAddress(accountId);
      } else {
        console.warn("[BlinkConnect] NEAR: connected but no account ID returned");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[BlinkConnect] NEAR connect failed:", message);
    }
  }, [connector]);
  const disconnect = useCallback(async () => {
    if (!connector) return;
    try {
      await connector.disconnect();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[BlinkConnect] NEAR disconnect:", message);
    }
    setAddress(null);
  }, [connector]);
  return {
    chain: "near",
    address,
    connected: !!address,
    transport: address ? "injected" : null,
    connect,
    disconnect
  };
}

export { useNearAdapter };
