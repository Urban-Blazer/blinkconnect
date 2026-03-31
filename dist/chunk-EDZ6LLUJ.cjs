'use strict';

var chunkMCBQNE3Z_cjs = require('./chunk-MCBQNE3Z.cjs');
var react$1 = require('react');
var wagmi = require('wagmi');
var react = require('@reown/appkit/react');

function useEvmAdapter() {
  const { address: appKitAddress, isConnected: appKitConnected, caipAddress } = react.useAppKitAccount();
  const { disconnect: appKitDisconnect } = react.useDisconnect();
  const { address: wagmiAddress, isConnected: wagmiConnected } = wagmi.useAccount();
  const { disconnect: wagmiDisconnect } = wagmi.useDisconnect();
  const { open: openAppKit } = react.useAppKit();
  const appKitChain = (() => {
    if (!caipAddress) return null;
    if (caipAddress.startsWith("eip155:")) return "evm";
    if (caipAddress.startsWith("solana:")) return "solana";
    if (caipAddress.startsWith("bip122:")) return "bitcoin";
    return null;
  })();
  const evmAddress = appKitChain === "evm" && appKitAddress || wagmiConnected && wagmiAddress || null;
  const solanaAddress = appKitChain === "solana" && appKitAddress || null;
  const bitcoinAddress = appKitChain === "bitcoin" && appKitAddress || null;
  const connect = react$1.useCallback(async () => {
    openAppKit();
  }, [openAppKit]);
  const disconnect = react$1.useCallback(async () => {
    if (appKitConnected) await appKitDisconnect();
    if (wagmiConnected) wagmiDisconnect();
  }, [appKitConnected, appKitDisconnect, wagmiConnected, wagmiDisconnect]);
  const platformInfo = chunkMCBQNE3Z_cjs.getPlatformInfo();
  const getEvmTransport = (chain, isConnected) => {
    if (!isConnected) return null;
    return platformInfo.recommendedTransport[chain] ?? "injected";
  };
  return {
    evm: {
      chain: "evm",
      address: evmAddress,
      connected: !!evmAddress,
      transport: getEvmTransport("evm", !!evmAddress),
      connect,
      disconnect
    },
    solana: {
      chain: "solana",
      address: solanaAddress,
      connected: !!solanaAddress,
      transport: getEvmTransport("solana", !!solanaAddress),
      connect,
      disconnect
    },
    bitcoin: {
      chain: "bitcoin",
      address: bitcoinAddress,
      connected: !!bitcoinAddress,
      transport: getEvmTransport("bitcoin", !!bitcoinAddress),
      connect,
      disconnect
    }
  };
}

exports.useEvmAdapter = useEvmAdapter;
