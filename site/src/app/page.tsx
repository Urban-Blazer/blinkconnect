"use client";

import { useState, useEffect } from "react";

/* ─── Syntax Highlighting ─────────────────────────── */

function highlightCode(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"([^"]*?)"/g, '<span class="text-amber-300">"$1"</span>')
    .replace(
      /(&lt;\/?)([\w]+)/g,
      '$1<span class="text-cyan-400">$2</span>'
    )
    .replace(
      /\b(import|from|export|default|function|const|let|var|return|if|else|true|false|null|undefined|async|await)\b/g,
      '<span class="text-emerald-400">$1</span>'
    )
    .replace(/=&gt;/g, '<span class="text-emerald-400">=&gt;</span>');
}

/* ─── Components ──────────────────────────────────── */

function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className={`text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  const highlighted = highlightCode(code);

  return (
    <div className="relative group rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
          <span className="text-xs font-mono text-zinc-500">{title}</span>
          <CopyButton text={code} />
        </div>
      )}
      {!title && (
        <CopyButton
          text={code}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
      <pre className="p-4 text-sm leading-relaxed overflow-x-auto font-mono text-zinc-300">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-12 reveal">
      <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-emerald-400 mb-3">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── Data ────────────────────────────────────────── */

const chains = [
  { name: "EVM", subtitle: "15 chains", symbol: "⬡", gradient: "from-blue-400 to-indigo-400" },
  { name: "Solana", subtitle: "Mainnet & Devnet", symbol: "◎", gradient: "from-purple-400 to-fuchsia-400" },
  { name: "Bitcoin", subtitle: "BTC & Ordinals", symbol: "₿", gradient: "from-orange-400 to-amber-400" },
  { name: "Sui", subtitle: "Move VM", symbol: "◆", gradient: "from-sky-400 to-blue-400" },
  { name: "NEAR", subtitle: "Protocol", symbol: "N", gradient: "from-green-400 to-emerald-400" },
  { name: "Aptos", subtitle: "Move VM", symbol: "A", gradient: "from-teal-400 to-emerald-400" },
  { name: "Starknet", subtitle: "L2 ZK-Rollup", symbol: "★", gradient: "from-violet-400 to-purple-400" },
  { name: "TON", subtitle: "The Open Network", symbol: "◇", gradient: "from-sky-400 to-cyan-400" },
  { name: "TRON", subtitle: "TRC-20", symbol: "▲", gradient: "from-red-400 to-rose-400" },
];

const features = [
  {
    icon: "⚡",
    title: "Single Provider",
    description:
      "Replace 7+ nested provider wrappers with one <BlinkConnectProvider>. Clean, readable, maintainable.",
  },
  {
    icon: "🔗",
    title: "Unified API",
    description:
      "One useWallet() hook for all 9 ecosystems. Same interface whether you're on Ethereum or Sui.",
  },
  {
    icon: "🌳",
    title: "Tree-Shakeable",
    description:
      "Only bundle the chains you use. Import EVM + Solana? That's all that ships. Zero bloat.",
  },
  {
    icon: "📱",
    title: "Multi-Connect",
    description:
      "Users can connect wallets from multiple chains simultaneously. No disconnecting to switch.",
  },
  {
    icon: "🔑",
    title: "Social Login",
    description:
      "Google, Apple, Discord, X, GitHub login via ReOwn AppKit. Onboard non-crypto users instantly.",
  },
  {
    icon: "🛡️",
    title: "TypeScript-First",
    description:
      "Full type safety across all chain adapters. Autocomplete for every chain, wallet, and method.",
  },
  {
    icon: "🧩",
    title: "Framework Agnostic",
    description:
      "React components + vanilla JS client. Use with Next.js, Vite, Remix, or plain JavaScript.",
  },
  {
    icon: "💾",
    title: "Persistent Sessions",
    description:
      "Wallet connections persist across page reloads. Users reconnect automatically on return.",
  },
];

const comparisonRows: {
  feature: string;
  blink: boolean;
  rainbow: boolean;
  connect: boolean;
  appkit: boolean | "partial";
}[] = [
  { feature: "EVM", blink: true, rainbow: true, connect: true, appkit: true },
  { feature: "Solana", blink: true, rainbow: false, connect: false, appkit: true },
  { feature: "Bitcoin", blink: true, rainbow: false, connect: false, appkit: true },
  { feature: "Sui", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "NEAR", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "Aptos", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "Starknet", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "TON", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "TRON", blink: true, rainbow: false, connect: false, appkit: false },
  { feature: "Multi-connect", blink: true, rainbow: false, connect: false, appkit: "partial" },
  { feature: "Social login", blink: true, rainbow: false, connect: false, appkit: true },
];

/* ─── Code Strings ────────────────────────────────── */

const beforeCode = `<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
      <SolanaProvider>
        <BitcoinProvider>
          <SuiProvider>
            <NEARProvider>
              <App />
            </NEARProvider>
          </SuiProvider>
        </BitcoinProvider>
      </SolanaProvider>
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>`;

const afterCode = `<BlinkConnectProvider
  chains={["evm", "solana", "bitcoin", "sui", "near"]}
  appName="My dApp"
>
  <App />
</BlinkConnectProvider>`;

const providerCode = `import { goBlink ConnectProvider } from "@goblink/connect";

export default function App({ children }) {
  return (
    <BlinkConnectProvider
      chains={["evm", "solana", "bitcoin", "sui"]}
      appName="My dApp"
      socialLogin={["google", "github", "discord"]}
    >
      {children}
    </BlinkConnectProvider>
  );
}`;

const hookCode = `import { useWallet } from "@goblink/connect";

function WalletInfo() {
  const {
    address,
    chain,
    connect,
    disconnect,
    isConnected,
  } = useWallet();

  if (!isConnected) {
    return (
      <button onClick={() => connect()}>
        Connect Wallet
      </button>
    );
  }

  return (
    <div>
      <p>{chain}: {address}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}`;

const buttonCode = `import { ConnectButton } from "@goblink/connect";

function Header() {
  return (
    <header>
      <h1>My dApp</h1>
      <ConnectButton
        theme="dark"
        showBalance={true}
        showChainIcon={true}
      />
    </header>
  );
}`;

const installCmd = "npm install @goblink/connect";

/* ─── Page ────────────────────────────────────────── */

export default function Home() {
  const [npmCopied, setNpmCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const copyNpm = () => {
    navigator.clipboard.writeText(installCmd).then(() => {
      setNpmCopied(true);
      setTimeout(() => setNpmCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* ── Nav ──────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <a
            href="#"
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Blink
            </span>
            <span>Connect</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a
              href="https://docs.goblink.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-100 transition-colors hidden sm:block"
            >
              Docs
            </a>
            <a
              href="https://github.com/Urban-Blazer/blinkconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://goblink.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-100 transition-colors hidden sm:block"
            >
              goblink.io
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              @goblink/connect v0.1.0
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
              One provider. One hook.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Every chain.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Universal multi-chain wallet SDK. 9 blockchain ecosystems, 350+
              wallets, one unified API. Drop the provider hell.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/Urban-Blazer/blinkconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-semibold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all"
              >
                Get Started
                <span aria-hidden="true">&rarr;</span>
              </a>
              <button
                onClick={copyNpm}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 font-mono text-sm text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"
              >
                <span>npm i @goblink/connect</span>
                <span className="text-xs text-zinc-500 border-l border-zinc-700 pl-3">
                  {npmCopied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Before / After */}
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto reveal">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-red-400/80 uppercase tracking-wider">
                  Before
                </span>
                <span className="text-xs text-zinc-600">
                  — 7 nested providers
                </span>
              </div>
              <CodeBlock code={beforeCode} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  After
                </span>
                <span className="text-xs text-zinc-600">
                  — 1 provider, all chains
                </span>
              </div>
              <CodeBlock code={afterCode} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Chain Grid ───────────────────────────── */}
      <section id="chains" className="py-20 md:py-28 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Ecosystems"
            title="9 Ecosystems. 350+ Wallets."
            description="From EVM mainnets to Sui Move contracts — one SDK covers every major blockchain ecosystem."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {chains.map((chain, i) => (
              <div
                key={chain.name}
                className="reveal flex items-center gap-4 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${chain.gradient} text-zinc-950 font-bold text-lg shrink-0`}
                >
                  {chain.symbol}
                </div>
                <div>
                  <div className="font-semibold text-sm">{chain.name}</div>
                  <div className="text-xs text-zinc-500">{chain.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code Examples ────────────────────────── */}
      <section
        id="code"
        className="py-20 md:py-28 px-6 border-t border-zinc-800/50 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Developer Experience"
            title="Three APIs. That's It."
            description="A provider, a hook, and a button. Everything you need to connect any wallet on any chain."
          />

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="reveal lg:col-span-2">
              <h3 className="text-sm font-mono font-semibold text-emerald-400 mb-3">
                Drop-in Provider
              </h3>
              <CodeBlock code={providerCode} title="app.tsx" />
            </div>

            <div className="reveal">
              <h3 className="text-sm font-mono font-semibold text-cyan-400 mb-3">
                Ready-made Button
              </h3>
              <CodeBlock code={buttonCode} title="header.tsx" />
            </div>

            <div className="reveal lg:col-span-3">
              <h3 className="text-sm font-mono font-semibold text-violet-400 mb-3">
                Universal Hook
              </h3>
              <CodeBlock code={hookCode} title="wallet-info.tsx" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────── */}
      <section
        id="features"
        className="py-20 md:py-28 px-6 border-t border-zinc-800/50 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Features"
            title="Built for Real dApps"
            description="Everything you need to ship production wallet connections. Nothing you don't."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="reveal p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────── */}
      <section
        id="compare"
        className="py-20 md:py-28 px-6 border-t border-zinc-800/50 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Comparison"
            title="The Only SDK That Covers All 9"
            description="See how goBlink Connect stacks up against the alternatives."
          />
          <div className="reveal overflow-x-auto max-w-4xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 font-normal">
                    Feature
                  </th>
                  <th className="p-4 font-mono text-xs font-semibold text-emerald-400">
                    goBlink Connect
                  </th>
                  <th className="p-4 font-mono text-xs text-zinc-500 font-normal">
                    RainbowKit
                  </th>
                  <th className="p-4 font-mono text-xs text-zinc-500 font-normal">
                    ConnectKit
                  </th>
                  <th className="p-4 font-mono text-xs text-zinc-500 font-normal">
                    AppKit
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-zinc-800/50 last:border-0"
                  >
                    <td className="p-4 font-medium text-zinc-300">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-emerald-400 font-bold">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      {row.rainbow ? (
                        <span className="text-zinc-400">✓</span>
                      ) : (
                        <span className="text-zinc-700">✗</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.connect ? (
                        <span className="text-zinc-400">✓</span>
                      ) : (
                        <span className="text-zinc-700">✗</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.appkit === "partial" ? (
                        <span className="text-amber-400 text-xs font-mono">
                          Partial
                        </span>
                      ) : row.appkit ? (
                        <span className="text-zinc-400">✓</span>
                      ) : (
                        <span className="text-zinc-700">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Install ──────────────────────────────── */}
      <section
        id="install"
        className="py-20 md:py-28 px-6 border-t border-zinc-800/50 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto text-center">
          <SectionHeader label="Install" title="Up and Running in Seconds" />
          <div className="reveal inline-flex items-center gap-4 px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 font-mono text-sm mb-6">
            <span className="text-zinc-500">$</span>
            <span className="text-emerald-400">npm install</span>
            <span className="text-zinc-300">@goblink/connect</span>
            <CopyButton text={installCmd} />
          </div>
          <p className="reveal text-xs text-zinc-500 max-w-md mx-auto">
            Peer dependencies:{" "}
            <span className="text-zinc-400">react</span> {">="} 18,{" "}
            <span className="text-zinc-400">react-dom</span> {">="} 18. Chain
            adapters are auto-installed based on your config.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-t border-zinc-800/50">
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl" />
          </div>
          <div className="relative reveal">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Start building with{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                goBlink Connect
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
              MIT licensed. Open source. Ship multi-chain wallet connections in
              minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/Urban-Blazer/blinkconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all"
              >
                View on GitHub
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="https://docs.goblink.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-800 text-zinc-300 font-semibold hover:border-zinc-700 hover:bg-zinc-900 transition-all"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-sm mb-4">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Blink
                </span>
                Connect
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Universal multi-chain wallet SDK by the goBlink team. MIT
                licensed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-500 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a
                    href="https://docs.goblink.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-100 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Urban-Blazer/blinkconnect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-100 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-500 mb-4">
                Ecosystem
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a
                    href="https://goblink.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-100 transition-colors"
                  >
                    goblink.io
                  </a>
                </li>
                <li>
                  <a
                    href="https://merchant.goblink.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-100 transition-colors"
                  >
                    merchant.goblink.io
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-500 mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a
                    href="https://docs.goblink.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-100 transition-colors"
                  >
                    docs.goblink.io
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} goBlink. MIT License.
            </p>
            <p className="text-xs text-zinc-700 font-mono">
              @goblink/connect
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
