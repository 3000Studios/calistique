import { monetizationBlocks } from "@empire/shared";

export function MonetizationPanel() {
  return (
    <section className="rounded-2xl border border-amber-300/40 bg-amber-500/10 p-5">
      <h2 className="text-xl font-semibold">Monetization Stack</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {monetizationBlocks.map((item) => (
          <div key={item} className="rounded-xl border border-amber-200/30 bg-slate-900/60 p-3 text-sm">{item}</div>
        ))}
      </div>
    </section>
  );
}
