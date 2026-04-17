import { motion } from "framer-motion";
import { siteConfig } from "./engine/siteConfig";
import { SceneCanvas } from "./components/SceneCanvas";
import { MonetizationPanel } from "./components/MonetizationPanel";
import { ContentFeed } from "./components/ContentFeed";
import { FeatureGrid } from "./components/FeatureGrid";

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="rounded-2xl border border-cyan-400/30 bg-slate-900/75 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Empire Core System</p>
        <motion.h1 className="mt-2 bg-gradient-to-r from-amber-200 via-cyan-200 to-fuchsia-200 bg-clip-text text-4xl font-black text-transparent" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {siteConfig.title}
        </motion.h1>
        <p className="mt-2 text-slate-200/85">{siteConfig.subtitle}</p>
        <p className="text-sm text-purple-200/80">Scene profile: {siteConfig.scene} • Domain target: {siteConfig.domain}</p>
      </header>
      <SceneCanvas />
      <FeatureGrid />
      <ContentFeed />
      <MonetizationPanel />
    </main>
  );
}
