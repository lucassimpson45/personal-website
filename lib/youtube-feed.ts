import type { YoutubeFeedVideo } from "@/lib/youtube-public";

const FEED_REVALIDATE_SECONDS = 30;

/**
 * Pull the latest N videos from a public YouTube channel (Atom feed, no API key).
 * Revalidates on a short interval so new uploads show up quickly.
 */
function channelFeedUrl(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

function decodeXmlEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, String.fromCharCode(34))
    .replace(/&#39;/g, String.fromCharCode(39))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function parseFeedXml(xml: string, count: number): YoutubeFeedVideo[] {
  const parts = xml.split("<entry>");
  const out: YoutubeFeedVideo[] = [];
  for (let i = 1; i < parts.length && out.length < count; i++) {
    const entry = parts[i].split("</entry>")[0];
    const idMatch = entry.match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/);
    if (!idMatch) continue;
    const titleMatch = entry.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? decodeXmlEntities(titleMatch[1].trim()) : "Video";
    out.push({ videoId: idMatch[1], title });
  }
  return out;
}

export async function fetchLatestChannelVideos(
  channelId: string | undefined,
  count: number,
): Promise<YoutubeFeedVideo[]> {
  if (!channelId?.trim()) {
    return [];
  }
  try {
    /**
     * Next.js rejects `cache: 'no-store'` together with `next.revalidate` on the same
     * fetch (both are ignored). Use either time-based revalidation or no-store.
     * Set `YOUTUBE_FEED_NO_STORE=1` to force uncached RSS reads (e.g. smoke tests after deploy).
     */
    const res = await fetch(
      channelFeedUrl(channelId.trim()),
      process.env.YOUTUBE_FEED_NO_STORE === "1"
        ? { cache: "no-store" as const }
        : { next: { revalidate: FEED_REVALIDATE_SECONDS } },
    );
    if (!res.ok) {
      return [];
    }
    const xml = await res.text();
    return parseFeedXml(xml, count);
  } catch {
    return [];
  }
}
