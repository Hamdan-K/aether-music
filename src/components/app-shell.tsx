import { Link } from "@tanstack/react-router";
import {
  ChevronDown, Disc3, Heart, Home, Library, ListMusic, Maximize2, Menu, MoreHorizontal,
  Pause, Play, Repeat2, Search, Settings, Shuffle, SkipBack, SkipForward, Volume2, X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { albums, artists, formatTime, playlists, songs } from "@/data/music";
import { usePlayer } from "@/context/player-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: Library },
  { to: "/playlists", label: "Playlists", icon: ListMusic },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { setSearchOpen } = usePlayer();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-sidebar px-4 py-7 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3 px-3" aria-label="Aether home">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40"><Disc3 className="size-4 text-primary" /></span>
          <span className="text-lg font-semibold tracking-tight">Aether</span>
        </Link>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" activeProps={{ className: "bg-accent text-foreground" }}>
              <Icon className="size-[18px]" />{label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">Your music</div>
        <div className="mt-3 space-y-1">
          {playlists.slice(0, 4).map((playlist) => (
            <Link key={playlist.id} to="/playlists/$playlistId" params={{ playlistId: playlist.id }} className="block truncate rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{playlist.title}</Link>
          ))}
        </div>
        <Link to="/settings" className="mt-auto flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Settings className="size-[18px]" />Settings</Link>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-20 flex h-20 items-center border-b border-border bg-background/75 px-5 backdrop-blur-xl lg:left-60 lg:px-10">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <Button variant="outline" className="hidden h-10 max-w-lg justify-between rounded-lg px-4 text-muted-foreground sm:flex" onClick={() => setSearchOpen(true)}>
            <span className="flex items-center gap-3"><Search className="size-4" />Search your library</span>
            <kbd className="rounded border border-border px-2 py-0.5 text-[10px] text-subtle">⌘ K</kbd>
          </Button>
          <span className="font-semibold tracking-tight sm:hidden">Aether</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search className="size-5" /></Button>
            <Button variant="ghost" className="gap-2 px-2 text-foreground"><span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">HA</span><ChevronDown className="hidden size-4 sm:block" /></Button>
          </div>
        </div>
      </header>

      <main className="min-h-screen px-5 pb-44 pt-28 lg:ml-60 lg:px-10 lg:pb-32">{children}</main>
      <MiniPlayer />
      <SearchOverlay />
      <NowPlaying />
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid h-16 grid-cols-4 border-t border-border bg-sidebar/95 px-3 backdrop-blur-xl lg:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground" activeProps={{ className: "text-primary" }}><Icon className="size-5" />{label}</Link>
        ))}
        <Link to="/settings" className="flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground" activeProps={{ className: "text-primary" }}><Settings className="size-5" />Settings</Link>
      </nav>
    </div>
  );
}

function MiniPlayer() {
  const p = usePlayer();
  const progress = (p.progress / p.current.duration) * 100;
  return (
    <div className="fixed bottom-16 left-2 right-2 z-40 rounded-2xl border border-border bg-player/92 shadow-player backdrop-blur-2xl lg:bottom-4 lg:left-[15.5rem] lg:right-4">
      <button className="absolute inset-x-0 top-0 h-1 cursor-pointer overflow-hidden rounded-t-2xl bg-track" aria-label="Seek track" onClick={(event) => p.seek((event.nativeEvent.offsetX / event.currentTarget.clientWidth) * p.current.duration)}>
        <span className="block h-full bg-primary" style={{ width: `${progress}%` }} />
      </button>
      <div className="grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 lg:grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] lg:px-4">
        <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => p.setExpanded(true)}>
          <img src={p.current.artwork} alt="" className="size-11 shrink-0 rounded-lg object-cover" width={1024} height={1024} />
          <span className="min-w-0"><span className="block truncate text-sm font-medium">{p.current.title}</span><span className="block truncate text-xs text-muted-foreground">{p.current.artist}</span></span>
        </button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="iconSm" className="hidden lg:inline-flex" aria-label="Previous" onClick={p.previous}><SkipBack className="size-4" fill="currentColor" /></Button>
          <Button size="icon" aria-label={p.playing ? "Pause" : "Play"} onClick={p.togglePlay}>{p.playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}</Button>
          <Button variant="ghost" size="iconSm" aria-label="Next" onClick={p.next}><SkipForward className="size-4" fill="currentColor" /></Button>
        </div>
        <div className="hidden items-center justify-end gap-3 lg:flex">
          <span className="text-[11px] tabular-nums text-subtle">{formatTime(p.progress)} / {formatTime(p.current.duration)}</span>
          <Volume2 className="size-4 text-muted-foreground" />
          <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={p.volume} onChange={(e) => p.setVolume(Number(e.target.value))} className="aether-range w-24" />
          <Button variant="ghost" size="iconSm" aria-label="Expand player" onClick={() => p.setExpanded(true)}><Maximize2 className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function SearchOverlay() {
  const p = usePlayer();
  const [query, setQuery] = useState("");
  const results = useMemo(() => songs.filter((s) => `${s.title} ${s.artist} ${s.album}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5), [query]);
  if (!p.searchOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-overlay/80 px-4 pt-[8vh] backdrop-blur-md" onMouseDown={() => p.setSearchOpen(false)}>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-popover shadow-player" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-5"><Search className="size-5 text-muted-foreground" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Escape" && p.setSearchOpen(false)} placeholder="Search songs, albums, artists, playlists…" className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-subtle" /><Button variant="ghost" size="iconSm" aria-label="Close search" onClick={() => p.setSearchOpen(false)}><X className="size-4" /></Button></div>
        <div className="max-h-[65vh] overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">Songs</p>
          {results.map((song) => <button key={song.id} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-accent" onClick={() => { p.play(song); p.setSearchOpen(false); }}><img src={song.artwork} alt="" className="size-10 rounded-md object-cover" width={1024} height={1024} loading="lazy" /><span className="min-w-0 flex-1"><span className="block truncate text-sm">{song.title}</span><span className="block truncate text-xs text-muted-foreground">{song.artist} · {song.album}</span></span><Play className="size-4 text-primary" /></button>)}
          {!query && <><p className="mt-3 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">Browse</p><div className="grid grid-cols-2 gap-2 px-2 pb-2">{[albums[0].title, artists[1], playlists[0].title, "Favorites"].map((item) => <div key={item} className="rounded-xl border border-border bg-card p-4 text-sm">{item}</div>)}</div></>}
        </div>
      </div>
    </div>
  );
}

function NowPlaying() {
  const p = usePlayer();
  const [tab, setTab] = useState<"lyrics" | "queue">("lyrics");
  if (!p.expanded) return null;
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-now-playing text-foreground animate-in fade-in duration-300">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 lg:px-10">
        <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Now playing</span><Button variant="ghost" size="icon" aria-label="Close now playing" onClick={() => p.setExpanded(false)}><ChevronDown className="size-5" /></Button></div>
        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(320px,560px)_minmax(300px,1fr)] lg:gap-20">
          <div className="relative mx-auto aspect-square w-full max-w-[540px]"><div className="absolute inset-10 rounded-full bg-primary/15 blur-3xl" /><img src={p.current.artwork} alt={`${p.current.album} cover`} className="relative h-full w-full rounded-2xl object-cover shadow-player" width={1024} height={1024} /></div>
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-10"><p className="text-sm text-primary">{p.current.album}</p><h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">{p.current.title}</h2><p className="mt-3 text-lg text-muted-foreground">{p.current.artist}</p></div>
            <input aria-label="Track progress" type="range" min="0" max={p.current.duration} value={p.progress} onChange={(e) => p.seek(Number(e.target.value))} className="aether-range w-full" /><div className="mt-2 flex justify-between text-xs tabular-nums text-subtle"><span>{formatTime(p.progress)}</span><span>-{formatTime(p.current.duration - p.progress)}</span></div>
            <div className="my-8 flex items-center justify-between"><Button variant="ghost" size="icon" className={p.shuffle ? "text-primary" : ""} aria-label="Shuffle" onClick={p.toggleShuffle}><Shuffle className="size-5" /></Button><Button variant="ghost" size="iconLg" aria-label="Previous" onClick={p.previous}><SkipBack className="size-6" fill="currentColor" /></Button><Button size="iconLg" className="size-16" aria-label={p.playing ? "Pause" : "Play"} onClick={p.togglePlay}>{p.playing ? <Pause className="size-6" fill="currentColor" /> : <Play className="ml-1 size-6" fill="currentColor" />}</Button><Button variant="ghost" size="iconLg" aria-label="Next" onClick={p.next}><SkipForward className="size-6" fill="currentColor" /></Button><Button variant="ghost" size="icon" className={p.repeat !== "off" ? "text-primary" : ""} aria-label={`Repeat ${p.repeat}`} onClick={p.cycleRepeat}><Repeat2 className="size-5" /></Button></div>
            <div className="border-t border-border pt-5"><div className="mb-5 flex gap-6">{(["lyrics", "queue"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={cn("border-b pb-2 text-xs font-semibold uppercase tracking-[0.14em]", tab === item ? "border-primary text-foreground" : "border-transparent text-subtle")}>{item}</button>)}</div>{tab === "lyrics" ? <p className="max-w-sm text-lg leading-9 text-muted-foreground">Light moves slowly<br />through the room<br /><span className="text-foreground">we become the air between</span><br />and leave no sound</p> : <div className="space-y-3">{p.queue.slice(1, 5).map((song) => <button key={song.id} onClick={() => p.play(song)} className="flex w-full items-center gap-3 text-left"><img src={song.artwork} alt="" className="size-9 rounded-md" width={1024} height={1024} loading="lazy" /><span className="flex-1 text-sm">{song.title}</span><span className="text-xs text-subtle">{formatTime(song.duration)}</span></button>)}</div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}