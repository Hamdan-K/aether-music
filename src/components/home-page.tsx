import { Heart, MoreHorizontal, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { albums, formatTime, mixes, songs, type Song } from "@/data/music";
import { usePlayer } from "@/context/player-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const player = usePlayer();
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 700); return () => window.clearTimeout(timer); }, []);
  if (loading) return <HomeSkeleton />;
  return (
    <div className="mx-auto max-w-[1440px] animate-fade-in">
      <header className="mb-12"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your listening space</p><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{greeting()}, Hamdan.</h1><p className="mt-3 text-sm text-muted-foreground">A quiet selection, tuned to where you left off.</p></header>
      <section className="mb-14"><SectionHeader title="Continue listening" subtitle="Recently played" /><div className="scrollbar-none -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3 lg:-mx-0 lg:px-0">{songs.slice(0, 7).map((song, index) => <AlbumCard key={song.id} song={song} priority={index === 0} />)}</div></section>
      <section className="mb-14"><SectionHeader title="Personal mixes" subtitle="Made for you" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{mixes.map((mix, index) => <button key={mix.id} onClick={() => player.play(songs[index * 4] ?? songs[0]!)} className={cn("mix-card group relative h-44 overflow-hidden rounded-2xl border border-border p-5 text-left transition-transform duration-300 hover:-translate-y-1", mix.className)}><span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Mix {String(index + 1).padStart(2, "0")}</span><span className="relative z-10 mt-12 block text-xl font-semibold">{mix.title}</span><span className="relative z-10 mt-1 block text-xs text-muted-foreground">{mix.subtitle}</span><span className="absolute bottom-5 right-5 grid size-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"><Play className="ml-0.5 size-4" fill="currentColor" /></span></button>)}</div></section>
      <section className="mb-14"><SectionHeader title="Recently added" subtitle="New to your library" /><div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">{albums.map((album, index) => <AlbumTile key={album.id} album={album} song={songs[index] ?? songs[0]!} />)}</div></section>
      <section><SectionHeader title="Favorites" subtitle="The ones you keep close" /><Favorites /></section>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">{subtitle}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2></div><button className="text-xs font-medium text-muted-foreground hover:text-foreground">View all</button></div>;
}

function AlbumCard({ song, priority }: { song: Song; priority?: boolean }) {
  const p = usePlayer(); const active = p.current.id === song.id;
  return <button onClick={() => p.play(song)} className="group w-[168px] shrink-0 snap-start text-left sm:w-[184px]"><span className="relative block aspect-square overflow-hidden rounded-2xl bg-card"><img src={song.artwork} alt={`${song.album} cover`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" width={1024} height={1024} loading={priority ? "eager" : "lazy"} /><span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">{active && p.playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}</span></span><span className="mt-3 block truncate text-sm font-medium">{song.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{song.artist}</span></button>;
}

function AlbumTile({ album, song }: { album: (typeof albums)[number]; song: Song }) {
  const p = usePlayer();
  return <button onClick={() => p.play(song)} className="group min-w-0 text-left"><span className="relative block aspect-square overflow-hidden rounded-2xl bg-card"><img src={album.artwork} alt={`${album.title} cover`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" width={1024} height={1024} loading="lazy" /><span className="absolute inset-0 bg-overlay/0 transition-colors group-hover:bg-overlay/20" /><span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"><Play className="ml-0.5 size-4" fill="currentColor" /></span></span><span className="mt-3 block truncate text-sm font-medium">{album.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{album.artist} · {album.year}</span></button>;
}

function Favorites() {
  const p = usePlayer(); const favorites = songs.filter((song) => p.favorites.has(song.id)).slice(0, 6);
  return <div className="divide-y divide-border border-y border-border">{favorites.map((song, index) => <div key={song.id} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[40px_minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]"><button onClick={() => p.play(song)} className="grid size-10 place-items-center rounded-lg text-xs text-subtle hover:bg-accent hover:text-primary"><span className="group-hover:hidden">{String(index + 1).padStart(2, "0")}</span><Play className="hidden size-3.5 group-hover:block" fill="currentColor" /></button><button onClick={() => p.play(song)} className="flex min-w-0 items-center gap-3 text-left"><img src={song.artwork} alt="" className="size-10 shrink-0 rounded-lg object-cover" width={1024} height={1024} loading="lazy" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{song.title}</span><span className="block truncate text-xs text-muted-foreground sm:hidden">{song.artist}</span></span></button><span className="hidden truncate text-sm text-muted-foreground sm:block">{song.artist}</span><span className="hidden text-xs tabular-nums text-subtle sm:block">{formatTime(song.duration)}</span><div className="flex items-center"><Button variant="ghost" size="iconSm" className="text-primary" aria-label={`Remove ${song.title} from favorites`} onClick={() => p.toggleFavorite(song.id)}><Heart className="size-4" fill="currentColor" /></Button><Button variant="ghost" size="iconSm" aria-label="More options"><MoreHorizontal className="size-4" /></Button></div></div>)}</div>;
}

function HomeSkeleton() {
  return <div className="mx-auto max-w-[1440px] animate-pulse"><div className="mb-12 space-y-3"><div className="h-3 w-32 rounded bg-card" /><div className="h-12 w-80 max-w-full rounded bg-card" /><div className="h-4 w-64 rounded bg-card" /></div>{[1, 2, 3].map((row) => <div className="mb-14" key={row}><div className="mb-5 h-7 w-48 rounded bg-card" /><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">{[1,2,3,4,5].map((item) => <div key={item}><div className="aspect-square rounded-2xl bg-card" /><div className="mt-3 h-3 w-2/3 rounded bg-card" /></div>)}</div></div>)}</div>;
}