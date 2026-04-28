import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroLoadingFallback } from "@/components/HeroLoadingFallback";
import { LearnSection } from "@/components/LearnSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { fetchLatestChannelVideos } from "@/lib/youtube-feed";

const HeroColosseum = dynamic(() => import("@/components/HeroColosseum"), {
  ssr: false,
  loading: () => <HeroLoadingFallback />,
});

const YOUTUBE_CARD_COUNT = 3;

export default async function Home() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const latestYoutube = await fetchLatestChannelVideos(channelId, YOUTUBE_CARD_COUNT);

  return (
    <main className="relative z-10 min-h-screen bg-bg">
      <Suspense fallback={<HeroLoadingFallback />}>
        <HeroColosseum />
      </Suspense>
      <AboutSection />
      <PortfolioSection latestYoutube={latestYoutube} hasYoutubeConfig={!!channelId?.trim()} />
      <LearnSection />
      <ContactSection />
    </main>
  );
}
