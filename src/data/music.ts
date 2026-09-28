import amberArc from "@/assets/album-amber-arc.jpg";
import silverMonolith from "@/assets/album-silver-monolith.jpg";
import smokedTide from "@/assets/album-smoked-tide.jpg";
import nightOrbit from "@/assets/album-night-orbit.jpg";

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
};

export const artists = ["Nia Arden", "Serein", "Theo Vale", "Mara Elio", "Kaito Moss", "Lumen Park"];

export const albums = [
  { id: "glass-hours", title: "Glass Hours", artist: "Nia Arden", year: 2026, artwork: amberArc },
  { id: "still-form", title: "Still Form", artist: "Serein", year: 2025, artwork: silverMonolith },
  { id: "tidal-memory", title: "Tidal Memory", artist: "Theo Vale", year: 2026, artwork: smokedTide },
  { id: "afterlight", title: "Afterlight", artist: "Mara Elio", year: 2024, artwork: nightOrbit },
  { id: "soft-static", title: "Soft Static", artist: "Kaito Moss", year: 2025, artwork: silverMonolith },
  { id: "amber-room", title: "Amber Room", artist: "Lumen Park", year: 2026, artwork: amberArc },
  { id: "night-geometry", title: "Night Geometry", artist: "Serein", year: 2024, artwork: nightOrbit },
  { id: "undertow", title: "Undertow", artist: "Theo Vale", year: 2025, artwork: smokedTide },
];

const titles = [
  "Halcyon", "Air Between", "Slow Current", "Pale Signal", "Aperture", "Nocturne II", "Still Life", "Low Tide",
  "Open Window", "Quiet Engine", "Vesper", "Soft Focus", "Parallel", "Held Light", "After Image", "Meridian",
  "Blue Hour", "Faint Lines", "Drift", "Inner Orbit", "Folding Time", "Warm Static", "Elsewhere", "First Light",
  "Unsaid", "Contour", "Silver Thread", "Night Bloom", "Remain", "Liminal", "Aether", "Return",
];

export const songs: Song[] = titles.map((title, index) => {
  const album = albums[index % albums.length] ?? albums[0];
  if (!album) throw new Error("Aether requires at least one album");
  return {
    id: `song-${index + 1}`,
    title,
    artist: artists[index % artists.length] ?? "Unknown artist",
    album: album.title,
    duration: 198 + ((index * 17) % 116),
    artwork: album.artwork,
  };
});

export const initialSong: Song = songs[0] ?? {
  id: "song-fallback",
  title: "Halcyon",
  artist: "Nia Arden",
  album: "Glass Hours",
  duration: 240,
  artwork: amberArc,
};

export const playlists = [
  { id: "late-hours", title: "Late Hours", count: 18 },
  { id: "deep-focus", title: "Deep Focus", count: 24 },
  { id: "slow-mornings", title: "Slow Mornings", count: 16 },
  { id: "night-drive", title: "Night Drive", count: 21 },
  { id: "quiet-rooms", title: "Quiet Rooms", count: 14 },
];

export const mixes = [
  { id: "mix-1", title: "Low Light", subtitle: "Ambient · Minimal · Electronic", className: "mix-amber" },
  { id: "mix-2", title: "Still Water", subtitle: "Modern classical · Drone", className: "mix-silver" },
  { id: "mix-3", title: "After Dark", subtitle: "Downtempo · Nocturnal", className: "mix-ink" },
  { id: "mix-4", title: "Soft Pulse", subtitle: "Organic · Leftfield", className: "mix-smoke" },
];

export function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}