import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const now = new Date();
const payload = {
  generatedAt: now.toISOString(),
  status: "ok",
  featured: [
    { id: "auto-1", title: "Hourly market pulse", site: "referrals-live" },
    { id: "auto-2", title: "US trendline update", site: "theunitedstates-site" },
    { id: "auto-3", title: "Media drop spotlight", site: "tmack48-media" }
  ]
};

const out = resolve(process.cwd(), "content-feed.json");
writeFileSync(out, JSON.stringify(payload, null, 2));
console.log(`Content engine simulated hourly update -> ${out}`);
