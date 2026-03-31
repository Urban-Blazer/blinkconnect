// src/core/session.ts
var STORAGE_KEY = "blinkconnect:session";
function generateId() {
  return `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
var SessionManager = class {
  constructor() {
    this.session = this.createEmptySession();
  }
  createEmptySession() {
    return {
      id: generateId(),
      primary: null,
      linked: [],
      createdAt: Date.now()
    };
  }
  /** Get the current session state */
  getSession() {
    return { ...this.session };
  }
  /** Set the primary wallet (first connected wallet) */
  setPrimary(chain, address, transport) {
    if (this.session.primary && this.session.primary.chain !== chain) {
      if (!this.session.linked.some((w) => w.chain === this.session.primary.chain)) {
        this.session.linked.push({ ...this.session.primary });
      }
    }
    this.session.linked = this.session.linked.filter((w) => w.chain !== chain);
    this.session.primary = { chain, address, transport };
  }
  /** Link an additional wallet (for cross-chain operations) */
  linkWallet(chain, address, transport) {
    if (!this.session.primary) {
      this.setPrimary(chain, address, transport);
      return;
    }
    if (this.session.primary.chain === chain) {
      this.session.primary = { chain, address, transport };
      return;
    }
    this.session.linked = this.session.linked.filter((w) => w.chain !== chain);
    this.session.linked.push({ chain, address, transport });
  }
  /** Unlink a wallet by chain */
  unlinkWallet(chain) {
    if (this.session.primary?.chain === chain) {
      if (this.session.linked.length > 0) {
        this.session.primary = this.session.linked.shift();
      } else {
        this.session.primary = null;
      }
      return;
    }
    this.session.linked = this.session.linked.filter((w) => w.chain !== chain);
  }
  /** Get the address for a specific chain */
  getAddress(chain) {
    if (this.session.primary?.chain === chain) return this.session.primary.address;
    return this.session.linked.find((w) => w.chain === chain)?.address ?? null;
  }
  /** Get the transport for a specific chain */
  getTransport(chain) {
    if (this.session.primary?.chain === chain) return this.session.primary.transport;
    return this.session.linked.find((w) => w.chain === chain)?.transport ?? null;
  }
  /** Check if a chain has a connected wallet in the session */
  hasChain(chain) {
    if (this.session.primary?.chain === chain) return true;
    return this.session.linked.some((w) => w.chain === chain);
  }
  /** Get all addresses across all connected wallets */
  getAllAddresses() {
    const result = [];
    if (this.session.primary) {
      result.push({ chain: this.session.primary.chain, address: this.session.primary.address });
    }
    for (const w of this.session.linked) {
      result.push({ chain: w.chain, address: w.address });
    }
    return result;
  }
  /** Get all wallet entries (primary + linked) */
  getAllWallets() {
    const wallets = [];
    if (this.session.primary) wallets.push({ ...this.session.primary });
    for (const w of this.session.linked) wallets.push({ ...w });
    return wallets;
  }
  /** Total number of connected wallets */
  get count() {
    return (this.session.primary ? 1 : 0) + this.session.linked.length;
  }
  /** Persist session to localStorage */
  persist() {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    } catch {
    }
  }
  /** Restore session from localStorage */
  restore() {
    if (typeof window === "undefined" || !window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.id || typeof parsed.createdAt !== "number") return null;
      this.session = parsed;
      return this.getSession();
    } catch {
      return null;
    }
  }
  /** Clear the session (disconnect all) */
  clear() {
    this.session = this.createEmptySession();
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
    }
  }
};

export { SessionManager };
