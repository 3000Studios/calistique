const features = [
  "Global search and instant filtering",
  "User login/register/dashboard shells",
  "Kinetic typography + glitch/wave effects",
  "Ambient audio system + mute toggle",
  "Autoplay hero video and rotating media",
  "Mini games + leaderboard + rewards UI",
  "Affiliate and sponsored placements",
  "Structured SEO data + sitemap + robots"
];

export function FeatureGrid() {
  return (
    <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div key={feature} className="rounded-xl border border-slate-600/50 bg-slate-900/60 p-4 text-sm">{feature}</div>
      ))}
    </section>
  );
}
