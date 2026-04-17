export type SiteId = "citadel" | "referrals" | "usa" | "media";

  export interface ContentCard {
    id: string;
    title: string;
    category: string;
    site: SiteId;
    score: number;
    excerpt: string;
    url: string;
  }

  export const monetizationBlocks = [
    "AdSense slot",
    "Affiliate recommendation",
    "Sponsored feature slot",
    "Premium membership CTA",
    "Donation CTA",
    "Digital product upsell",
    "Subscription conversion",
    "Referral monetization",
    "Email capture funnel",
    "Video ad overlay",
    "Game rewards hook"
  ];

  const baseFeed: ContentCard[] = [
    { id: "r1", title: "Top Referral Funnels This Hour", category: "growth", site: "referrals", score: 94, excerpt: "High-conversion referral tactics from marketplace leaders.", url: "https://referrals.3000studios.vip" },
    { id: "u1", title: "US Economic Signal Tracker", category: "news", site: "usa", score: 92, excerpt: "Daily analysis template populated via autonomous content engine.", url: "https://usa.3000studios.vip" },
    { id: "m1", title: "Neon Session: TMACK48 Live Edit", category: "media", site: "media", score: 90, excerpt: "Behind-the-scenes music/video production showcase.", url: "https://media.3000studios.vip" }
  ];

  export function generateTrendingFeed(seed = Date.now()): ContentCard[] {
    const offset = Math.floor(seed / 1000) % 7;
    return baseFeed
      .map((item, idx) => ({ ...item, score: Math.max(60, item.score - ((idx + offset) % 5) * 2) }))
      .sort((a, b) => b.score - a.score);
  }

  export function trafficLoop(current: SiteId): SiteId {
    const loop: SiteId[] = ["referrals", "usa", "media", "citadel"];
    const i = loop.indexOf(current);
    return loop[(i + 1) % loop.length];
  }

  export function generateArticleTemplate(topic: string, vertical: string): string {
    const now = new Date().toISOString();
    return `# ${topic}

Updated: ${now}

${vertical} Briefing

- Trend summary
- Monetization angle
- Internal cross-links
- Conversion CTA`;
  }

  export const sharedTags = ["trending", "automation", "monetization", "seo", "affiliate", "premium"];
