# Aether Music

Build a personal music player web app named "Aether" with a calm, high-end hi-fi brand feel (restrained, precise, and alive, dark minimal aesthetic).

Selected specifications:
- Brand & Tone: Aether (Modern Monolith) — ultra-crisp typography, deep ink obsidian (#0B0C0E) surfaces, refined micro-accents.
- Accent Color: Amber Gold (#E5A93C) used sparingly for active states, play button, and progress scrubbers.
- Platform & Layout: Desktop-First with a pinned left sidebar and persistent mini-player; fully responsive with bottom navigation and docked mini-player on mobile.
- Artwork Density: Balanced Grid (approx 160px cards, 4–5 per row).

Information Architecture (build routes for all, in this exact structure):
- Home: Recently Played, Recently Added, Favorites, Personal Mixes
- Library: Songs, Albums, Artists (as tabs)
- Playlists: All Playlists, Playlist Detail
- Search: Songs, Albums, Artists (one global search with command-style overlay)
- Now Playing: full-screen player, opened smoothly from persistent mini-player
- Settings: Music Library, Playback, Appearance

Build Order (Phase 1):
Build ONLY the Home page to production quality, plus the app shell (sidebar/bottom nav, top bar, persistent mini-player). All other routes exist as elegant placeholder pages with a title and a subtle "Coming next" state.

Design Direction:
- Dark, clean, premium. Near-black base (#0B0C0E / #121316), layered surfaces with subtle elevation through slightly lighter panels (#181A20) and 1px low-opacity borders (rgba(255, 255, 255, 0.06)).
- ONE restrained accent color (Amber Gold #E5A93C) used sparingly (active states, play button, progress). Everything else is neutral grays.
- Generous whitespace, strict 8px spacing grid, large confident type hierarchy (Inter / Geist sans) with tight tracking on headings.
- Soft corner radii on cards (16px / rounded-2xl); subtle glass/blur on the mini-player dock and top bar.
- Rich generated gradient/abstract placeholder album covers (no broken links). Soft ambient glow matching the active track.
- No neon overload, no clutter, thin-stroke Lucide icons.

Home Page Features:
- Greeting header (time-aware: Good morning / afternoon / evening) with quiet subline.
- "Recently Played / Continue listening": horizontal scroll row with snap.
- "Personal Mixes": visually distinct cards with a gradient identity per mix.
- "Recently Added": balanced grid of album cards.
- "Favorites": compact list of songs with live heart state.
- Cards feature hover lift, smooth play button fade-in.
- Skeleton loading state on first mount, followed by staggered fade-in.

Interactivity & Player State:
- Global player state (Zustand or React Context): play/pause, next/prev, seek timer simulation, volume, shuffle, repeat, queue.
- Clicking any song or card plays it and updates the persistent mini-player instantly.
- Mini-player: scrubbable progress bar, volume slider, track metadata, expands into a full-screen Now Playing modal/overlay with vinyl/cover art, lyrics/queue tabs, and full controls.
- Heart/favorite toggles update across the entire app live.
- Keyboard shortcuts: Space (play/pause), ArrowLeft/ArrowRight (seek 5s), "/" focuses search.
- Global Command-K / search overlay with grouped results (Songs, Albums, Artists, Playlists).
- Provide rich mock data in a dedicated data file: 30+ songs, 8 albums, 6 artists, 5 playlists, 4 mixes.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8dc9ed81-b858-4ddb-9561-7187f8e108d5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
