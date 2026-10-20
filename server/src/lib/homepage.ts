import homepageCopy from "../../../aul sports/homepage-copy.json" with { type: "json" };
// Shared field definitions keep the homepage and its admin editor in sync.
export const homepageCopyFields = homepageCopy as Array<{ key: string; value: string; attribute?: string; legacy?: string }>;
export type HomepageContent = {
  copy: Record<string, string>;
  siteTitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryButtonLabel: string;
  primaryButtonUrl: string;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
  liveTitle: string;
  liveMatches: Array<{ label: string; score: string; status: string }>;
  fantasyTitle: string;
  fantasyFootballTitle: string;
  fantasyFootballDescription: string;
  fantasyFootballButtonLabel: string;
  fantasyFootballButtonUrl: string;
  fantasyBasketballTitle: string;
  fantasyBasketballDescription: string;
  fantasyBasketballButtonLabel: string;
  fantasyBasketballButtonUrl: string;
  communityTitle: string;
  communityDescription: string;
  communityTitleLabel: string;
  communityDetailsLabel: string;
  communitySubmitLabel: string;
  newsTitle: string;
  newsArticles: Array<{ title: string; description: string }>;
};

export const defaultHomepageContent: HomepageContent = {
  copy: Object.fromEntries(homepageCopyFields.map(field => [field.key, field.value])),
  siteTitle: "Anchor University Sports Hub",
  heroTitle: "Every game. Every team. Our university.",
  heroDescription: "The fixtures, the rivalries, the moments that bring us together. Stay close to every play.",
  primaryButtonLabel: "Explore the match centre",
  primaryButtonUrl: "aupl-fixtures.html",
  secondaryButtonLabel: "Play Fantasy",
  secondaryButtonUrl: "aupl fantasy.html",
  liveTitle: "🔴 Live Now",
  liveMatches: [
    { label: "⚽ Male Football", score: "Computer Science 2 - 1 Engineering", status: "65'" },
    { label: "⚽ Girls Football", score: "Team A 1 - 1 Team B", status: "72'" },
    { label: "🏀 Basketball", score: "Team C 45 - 41 Team D", status: "Q3" },
    { label: "🏐 Volleyball", score: "Team E 2 - 1 Team F", status: "Set 4" },
  ],
  fantasyTitle: "Think you know the game?",
  fantasyFootballTitle: "⚽ Fantasy Football",
  fantasyFootballDescription: "Build your dream football team and compete with other students.",
  fantasyFootballButtonLabel: "Play Fantasy Football",
  fantasyFootballButtonUrl: "aupl fantasy.html",
  fantasyBasketballTitle: "🏀 Fantasy Basketball",
  fantasyBasketballDescription: "Pick your basketball players and earn points from their performances.",
  fantasyBasketballButtonLabel: "Play Fantasy Basketball",
  fantasyBasketballButtonUrl: "aupl fantasy.html",
  communityTitle: "📣 Community Posts",
  communityDescription: "Share an update with the School Sports Hub community.",
  communityTitleLabel: "Title",
  communityDetailsLabel: "Details",
  communitySubmitLabel: "Publish Post",
  newsTitle: "📰 Latest News",
  newsArticles: [
    { title: "Football Championship Begins", description: "The school football competition has officially started." },
    { title: "Basketball Competition", description: "See the latest basketball fixtures and results." },
    { title: "Volleyball Update", description: "Follow the latest volleyball action." },
  ],
};

export function parseHomepageContent(value?: string | null): HomepageContent {
  if (!value) return defaultHomepageContent;
  try {
    const parsed = JSON.parse(value) as Partial<HomepageContent>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaultHomepageContent;
    const safe = { ...defaultHomepageContent };
    for (const key of Object.keys(defaultHomepageContent) as Array<keyof HomepageContent>) {
      const value = parsed[key];
      if (typeof defaultHomepageContent[key] === "string" && typeof value === "string" && value.length <= 2000) (safe as unknown as Record<string, unknown>)[key] = value;
    }
    safe.liveMatches = Array.isArray(parsed.liveMatches) ? parsed.liveMatches.slice(0, 8).filter(item => item && typeof item.label === "string" && typeof item.score === "string" && typeof item.status === "string") : defaultHomepageContent.liveMatches;
    safe.newsArticles = Array.isArray(parsed.newsArticles) ? parsed.newsArticles.slice(0, 8).filter(item => item && typeof item.title === "string" && typeof item.description === "string") : defaultHomepageContent.newsArticles;
    safe.copy = { ...defaultHomepageContent.copy };
    for (const field of homepageCopyFields) {
      const candidate = parsed.copy?.[field.key] ?? (field.legacy ? (parsed as unknown as Record<string, unknown>)[field.legacy] : undefined);
      if (typeof candidate === "string" && candidate.length <= 2000) safe.copy[field.key] = candidate;
    }
    return safe;
  } catch {
    return defaultHomepageContent;
  }
}
