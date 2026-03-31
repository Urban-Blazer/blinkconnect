'use strict';

// src/adapters/base.ts
function createNoopAdapter(chain) {
  return {
    chain,
    address: null,
    connected: false,
    transport: null,
    connect: async () => {
      console.warn(
        `[BlinkConnect] ${chain} adapter dependencies not installed. Skipping connect.`
      );
    },
    disconnect: async () => {
    }
  };
}

exports.createNoopAdapter = createNoopAdapter;
