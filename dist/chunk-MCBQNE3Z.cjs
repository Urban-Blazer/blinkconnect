'use strict';

// src/core/detector.ts
function detectPlatform() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      platform: "desktop-browser",
      isMobile: false,
      isWalletBrowser: false,
      walletBrowser: null,
      injectedProviders: [],
      recommendedTransport: {}
    };
  }
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const injectedProviders = [];
  const win = window;
  const hasEthereum = !!win.ethereum;
  const hasPhantomSolana = !!win.phantom?.solana;
  const hasSuiWallet = !!win.suiWallet;
  const hasTronLink = !!win.tronLink || !!win.tronWeb;
  if (hasEthereum) injectedProviders.push("evm");
  if (hasPhantomSolana || hasEthereum && win.ethereum?.isPhantom)
    injectedProviders.push("solana");
  if (hasSuiWallet) injectedProviders.push("sui");
  if (hasTronLink) injectedProviders.push("tron");
  let walletBrowser = null;
  if (hasEthereum) {
    const eth = win.ethereum;
    if (eth.isMetaMask && !eth.isBraveWallet) walletBrowser = "metamask";
    else if (eth.isTrust || eth.isTrustWallet) walletBrowser = "trust";
    else if (eth.isCoinbaseWallet || eth.isCoinbaseBrowser) walletBrowser = "coinbase";
  }
  if (!walletBrowser && hasPhantomSolana) {
    walletBrowser = "phantom";
  }
  if (!walletBrowser && hasSuiWallet) {
    walletBrowser = "sui-wallet";
  }
  const isWalletBrowser = isMobile && walletBrowser !== null;
  let platform;
  if (isWalletBrowser) {
    platform = "wallet-browser";
  } else if (isMobile) {
    platform = "mobile-browser";
  } else {
    platform = "desktop-browser";
  }
  const recommendedTransport = {};
  const allChains = ["evm", "solana", "bitcoin", "sui", "near", "aptos", "starknet", "ton", "tron"];
  for (const chain of allChains) {
    if (chain === "ton") {
      recommendedTransport[chain] = "tonconnect";
      continue;
    }
    if (platform === "desktop-browser") {
      recommendedTransport[chain] = "injected";
    } else if (platform === "wallet-browser") {
      if (injectedProviders.includes(chain)) {
        recommendedTransport[chain] = "injected";
      } else {
        recommendedTransport[chain] = "walletconnect";
      }
    } else {
      recommendedTransport[chain] = "walletconnect";
    }
  }
  return {
    platform,
    isMobile,
    isWalletBrowser,
    walletBrowser,
    injectedProviders,
    recommendedTransport
  };
}
var cachedPlatformInfo = null;
function getPlatformInfo() {
  if (!cachedPlatformInfo) {
    cachedPlatformInfo = detectPlatform();
  }
  return cachedPlatformInfo;
}
function resetPlatformCache() {
  cachedPlatformInfo = null;
}

exports.detectPlatform = detectPlatform;
exports.getPlatformInfo = getPlatformInfo;
exports.resetPlatformCache = resetPlatformCache;
