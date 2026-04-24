import { generateTrendingFeed, trafficLoop } from "@empire/shared";

export function ContentFeed() {
  const trending = generateTrendingFeed();
  const nextHop = trafficLoop("citadel");
  return (
    <section className="rounded-2xl border border-purple-300/30 bg-purple-500/10 p-5">
      <h2 className="text-xl font-semibold">Cross-Site Trending Feed</h2>
      <p className="mt-1 text-sm text-purple-100/80">Traffic loop next hop: <span className="font-semibold">{nextHop}</span></p>
      <div className="mt-4 space-y-3">
        {trending.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-600/40 bg-slate-900/70 p-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-cyan-200">
              <span>{item.site}</span>
              <span>score {item.score}</span>
            </div>
            <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-200/85">{item.excerpt}</p>
            <a className="mt-1 inline-block text-sm text-cyan-300 underline" href={item.url}>Open source site</a>
          </article>
        ))}
      </div>
    </section>
  );
}
