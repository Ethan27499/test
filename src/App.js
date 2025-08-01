import React, { useState } from "react";
import {
  useAccount,
  useDisconnect,
  WagmiConfig,
  createConfig,
  mainnet,
  configureChains
} from "wagmi";
import { RainbowKitProvider, ConnectButton, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { Dialog } from "@headlessui/react";
import { CheckBadgeIcon, UserIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import "@rainbow-me/rainbowkit/styles.css";

// Wagmi + RainbowKit config
const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);
const { connectors } = getDefaultWallets({ appName: "HyperBacker", chains });
const wagmiConfig = createConfig({ autoConnect: true, connectors, publicClient });

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "More", href: "#more" }
];

const MOCK_TRADERS = [
  {
    id: 1, name: "Trader Phoenix",
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=phoenix",
    roi: 33.5, backers: 182, isTop: true,
    badges: ["Consistent", "Hot Streak"],
    vault: 120000, epoch: 3
  },
  {
    id: 2, name: "CryptoNinja",
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=ninja",
    roi: 17.1, backers: 95, isTop: false,
    badges: ["Risk Taker"],
    vault: 53000, epoch: 5
  },
  {
    id: 3, name: "Zen Master",
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=zen",
    roi: 8.2, backers: 41, isTop: false,
    badges: ["Safe Guard"],
    vault: 20000, epoch: 2
  }
];

const bgGradient = "bg-gradient-to-br from-[#131423] via-[#181926] to-[#090b14]";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Header({ active, setActive }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
      className={cn(
        "fixed z-50 top-0 w-full flex items-center",
        "bg-[#181926]/95 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(14,18,43,0.50)]",
        "border-b border-[#23243a] py-3 px-3 md:px-14"
      )}
      style={{ boxShadow: "0 4px 30px 0 #13142340" }}
    >
      <div className="flex items-center gap-3">
        <img
          src="https://i.ibb.co/yB0KJQ9/hyperbacker-logo.png"
          className="h-9 drop-shadow-glow"
          alt="HyperBacker"
        />
        <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 via-cyan-400 to-[#7f59f0] bg-clip-text text-transparent tracking-wide select-none">HyperBacker</span>
      </div>
      <nav className="hidden md:flex gap-5 ml-10">
        {NAV_ITEMS.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setActive(idx)}
            className={cn(
              "relative px-4 py-1.5 rounded-xl font-medium transition-all",
              "text-cyan-100 hover:text-cyan-400 focus:outline-none group",
              active === idx
                ? "bg-gradient-to-tr from-[#151730] to-[#20235a] shadow-lg shadow-cyan-500/20 border border-cyan-600/50 text-cyan-200"
                : "bg-none"
            )}
            style={{ boxShadow: active === idx ? "0 0 12px 2px #06b6d477" : undefined }}
          >
            <span>{item.label}</span>
            {active === idx && (
              <motion.span
                layoutId="nav-underline"
                className="absolute left-3 right-3 -bottom-1 h-[3px] rounded-full bg-cyan-400 shadow-[0_0_6px_2px_#06b6d4aa]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="absolute inset-0 rounded-xl group-hover:ring-2 group-hover:ring-[#06b6d455] pointer-events-none transition"></span>
          </button>
        ))}
      </nav>
      <div className="flex-1" />
      <AccountBar />
    </motion.header>
  );
}

function AccountBar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      {isConnected ? (
        <>
          <span className="bg-[#23243a] text-cyan-200 rounded-full px-4 py-1 font-mono text-xs flex items-center gap-1 shadow-[0_0_6px_0_#06b6d440]">
            <UserIcon className="w-4 h-4 text-cyan-400" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button onClick={disconnect} className="ml-2 text-cyan-400/80 hover:text-pink-400 text-xs underline">Disconnect</button>
        </>
      ) : (
        <ConnectButton chainStatus="icon" showBalance={false} />
      )}
    </motion.div>
  );
}

function GlowCard({ children, className, ...rest }) {
  return (
    <motion.div
      whileHover={{ scale: 1.025, boxShadow: "0 0 24px 2px #7f59f088, 0 2px 10px #0ff2" }}
      className={cn(
        "bg-gradient-to-br from-[#181926] via-[#0F192E] to-[#111215] rounded-2xl shadow-xl p-5 border border-[#23243a] hover:border-cyan-400 transition",
        "relative overflow-hidden", className
      )}
      {...rest}
    >
      {/* Glow shadow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 blur-[16px] bg-gradient-to-r from-cyan-700/30 via-[#7f59f0]/20 to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function TraderCard({ trader, onView }) {
  return (
    <GlowCard onClick={() => onView(trader)} className="cursor-pointer select-none hover:scale-[1.03] transition-all duration-200">
      <div className="flex items-center gap-3">
        <img src={trader.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-md shadow-cyan-700/10" />
        <div>
          <div className="text-lg font-semibold text-cyan-300 flex items-center gap-1">
            {trader.name}
            {trader.isTop && <TrophyIcon className="w-5 h-5 text-yellow-400 ml-1 animate-bounce" />}
          </div>
          <div className="text-xs text-gray-400">Epoch #{trader.epoch}</div>
        </div>
      </div>
      <div className="flex gap-6 mt-2 text-sm">
        <div>
          <span className="text-gray-400">ROI</span>
          <div className="text-xl font-bold text-cyan-200">{trader.roi}%</div>
        </div>
        <div>
          <span className="text-gray-400">Backers</span>
          <div className="text-xl font-bold">{trader.backers}</div>
        </div>
        <div>
          <span className="text-gray-400">Vault</span>
          <div className="text-xl font-bold">${trader.vault.toLocaleString()}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {trader.badges.map((b, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="bg-gradient-to-tr from-[#242b55] to-cyan-700/80 text-cyan-100 px-2 py-1 rounded-xl text-xs flex items-center gap-1 shadow shadow-cyan-700/10 sparkle"
          >
            <CheckBadgeIcon className="w-4 h-4 animate-pulse" /> {b}
          </motion.span>
        ))}
      </div>
    </GlowCard>
  );
}

function TraderModal({ trader, open, setOpen }) {
  if (!trader) return null;
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Dialog.Panel className="bg-[#191B28] p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-[#23243a]">
                <div className="flex items-center gap-4">
                  <img src={trader.avatar} className="w-16 h-16 rounded-full border-2 border-cyan-400 shadow-cyan-700/10 shadow-lg" />
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-cyan-300">{trader.name}</Dialog.Title>
                    <div className="flex gap-2 mt-1">
                      {trader.badges.map((b, i) => (
                        <span key={i} className="bg-gradient-to-tr from-[#1b223d] to-cyan-700/70 text-cyan-100 px-2 py-1 rounded-xl text-xs flex items-center gap-1 shadow shadow-cyan-700/10">
                          <CheckBadgeIcon className="w-4 h-4 animate-pulse" /> {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div><b>Vault size:</b> <span className="text-cyan-200">${trader.vault.toLocaleString()}</span></div>
                  <div><b>Epoch:</b> #{trader.epoch}</div>
                  <div><b>ROI:</b> <span className="text-green-400 font-bold">{trader.roi}%</span></div>
                  <div><b>Backers:</b> {trader.backers}</div>
                  <div className="text-sm text-gray-400 mt-2">*Xem chi tiết vị thế, biểu đồ, lịch sử giao dịch, hỗ trợ trực tiếp khi tích hợp backend!</div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    className="bg-cyan-500 hover:bg-cyan-700 text-white px-5 py-2 rounded-xl text-lg font-semibold transition shadow-lg"
                    onClick={() => setOpen(false)}
                  >Close</button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

function Dashboard() {
  const [viewTrader, setViewTrader] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="dashboard" className="pt-8">
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-extrabold mb-4 text-cyan-400"
      >
        🔥 Top Traders
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {MOCK_TRADERS.map(trader =>
          <TraderCard
            key={trader.id}
            trader={trader}
            onView={t => { setViewTrader(t); setModalOpen(true); }}
          />
        )}
      </div>
      <TraderModal trader={viewTrader} open={modalOpen} setOpen={setModalOpen} />
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState(1); // default = Dashboard

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact" theme={{
        blurs: { modalOverlay: "var(--rk-blur-12)" },
        colors: {
          accentColor: "#06b6d4",
          accentColorForeground: "#fff",
          actionButtonBorder: "1px solid #22273b",
          modalBackground: "#181926",
          modalBorder: "1px solid #23243a"
        }
      }}>
        <div className={cn(
          "min-h-screen w-full font-inter relative overflow-x-hidden",
          bgGradient,
          "text-gray-100 pb-16"
        )}>
          {/* Dynamic gradient background animation */}
          <div className="fixed inset-0 -z-10 pointer-events-none animate-gradient-move" style={{
            background: "radial-gradient(ellipse at 70% 20%, #7f59f022 60%, transparent 100%), radial-gradient(ellipse at 10% 80%, #06b6d433 55%, transparent 100%)"
          }} />
          <Header active={active} setActive={setActive} />
          <main className="px-3 md:px-16 pt-28 md:pt-32">
            <AnimatePresence mode="wait">
              {active === 1 && <Dashboard key="dashboard" />}
              {active === 0 && (
                <motion.section
                  key="home"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center min-h-[40vh] text-center"
                >
                  <motion.h1
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-cyan-300 via-cyan-400 to-[#7f59f0] bg-clip-text text-transparent"
                  >Revolutionize Trading with <span className="drop-shadow-glow">HyperBacker</span></motion.h1>
                  <p className="max-w-xl text-lg text-gray-400 mb-8">Gamified Backing – Where Smart Investors Meet Elite Traders. <br />No more blind copy trading. Back the best. Share the upside. Experience the future!</p>
                  <ConnectButton />
                </motion.section>
              )}
              {active === 2 && (
                <motion.section
                  key="portfolio"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[40vh] text-center flex flex-col items-center justify-center"
                >
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-cyan-400">Portfolio</h2>
                  <div className="text-gray-400">Connect your wallet to view your backing portfolio and earnings dashboard.</div>
                </motion.section>
              )}
              {active === 3 && (
                <motion.section
                  key="more"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[40vh] text-center flex flex-col items-center justify-center"
                >
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-cyan-400">More Features Coming Soon</h2>
                  <div className="text-gray-400">Leaderboard, Gamification, Jackpots, Community Quests... Stay tuned!</div>
                </motion.section>
              )}
            </AnimatePresence>
            <div className="mt-20 text-center text-gray-500 text-xs opacity-80">
              Built with <span className="text-pink-400 animate-pulse">❤️</span> by HyperBacker Team &middot; Inspired by Hyperliquid
            </div>
          </main>
        </div>
        <style>{`
          .drop-shadow-glow { filter: drop-shadow(0 0 6px #7f59f088); }
          .animate-gradient-move {
            animation: gradientMove 9s linear infinite alternate;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%, 100% 50%; }
            100% { background-position: 100% 60%, 10% 100%; }
          }
          .sparkle { position: relative; }
          .sparkle::after {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            background: radial-gradient(circle, #fff6 20%, transparent 80%);
            opacity: 0.2;
            animation: sparkleAnim 1.8s infinite linear;
          }
          @keyframes sparkleAnim {
            0% { opacity: 0.18; }
            50% { opacity: 0.3; }
            100% { opacity: 0.18; }
          }
        `}</style>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
