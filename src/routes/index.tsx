import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Aether — Your listening space" },
    { name: "description", content: "A calm, personal home for your music collection." },
    { property: "og:title", content: "Aether — Your listening space" },
    { property: "og:description", content: "A calm, personal home for your music collection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});
