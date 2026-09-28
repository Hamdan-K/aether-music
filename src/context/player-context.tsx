import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialSong, songs, type Song } from "@/data/music";

type RepeatMode = "off" | "all" | "one";
type PlayerContextValue = {
  current: Song;
  playing: boolean;
  progress: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  favorites: Set<string>;
  queue: Song[];
  expanded: boolean;
  searchOpen: boolean;
  play: (song: Song) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleFavorite: (id: string) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Song>(initialSong);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const [volume, setVolume] = useState(0.72);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [favorites, setFavorites] = useState(new Set(["song-1", "song-4", "song-9", "song-13"]));
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const play = useCallback((song: Song) => {
    setCurrent(song);
    setProgress(0);
    setPlaying(true);
  }, []);

  const next = useCallback(() => {
    const currentIndex = songs.findIndex((song) => song.id === current.id);
    const index = shuffle ? Math.floor(Math.random() * songs.length) : (currentIndex + 1) % songs.length;
    setCurrent(songs[index] ?? initialSong);
    setProgress(0);
    setPlaying(true);
  }, [current.id, shuffle]);

  const previous = useCallback(() => {
    if (progress > 5) return setProgress(0);
    const currentIndex = songs.findIndex((song) => song.id === current.id);
    setCurrent(songs[(currentIndex - 1 + songs.length) % songs.length] ?? initialSong);
    setProgress(0);
  }, [current.id, progress]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value < current.duration) return value + 1;
        return value;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, current.duration]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.code === "Space" && !typing) {
        event.preventDefault();
        setPlaying((value) => !value);
      } else if (event.key === "ArrowLeft" && !typing) {
        setProgress((value) => Math.max(0, value - 5));
      } else if (event.key === "ArrowRight" && !typing) {
        setProgress((value) => Math.min(current.duration, value + 5));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current.duration]);

  const value = useMemo<PlayerContextValue>(() => ({
    current, playing, progress, volume, shuffle, repeat, favorites, queue: songs, expanded, searchOpen,
    play,
    togglePlay: () => setPlaying((value) => !value),
    next,
    previous,
    seek: (seconds) => setProgress(Math.max(0, Math.min(current.duration, seconds))),
    setVolume,
    toggleFavorite: (id) => setFavorites((value) => {
      const nextFavorites = new Set(value);
      nextFavorites.has(id) ? nextFavorites.delete(id) : nextFavorites.add(id);
      return nextFavorites;
    }),
    toggleShuffle: () => setShuffle((value) => !value),
    cycleRepeat: () => setRepeat((value) => value === "off" ? "all" : value === "all" ? "one" : "off"),
    setExpanded,
    setSearchOpen,
  }), [current, playing, progress, volume, shuffle, repeat, favorites, expanded, searchOpen, play, next, previous]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error("usePlayer must be used within PlayerProvider");
  return value;
}