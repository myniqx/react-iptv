# Zenith TV - Feature Checklist

Cross-platform IPTV player development progress tracker.

**Last Updated:** 2025-11-09

---

## 📊 Overall Progress

| Platform | Core | UI/UX | P2P Remote | Total |
|----------|------|-------|------------|-------|
| **Desktop** | 90% | 95% | 0% | **75%** |
| **Tizen TV** | 0% | 0% | 0% | **0%** |
| **Android** | 0% | 0% | 0% | **0%** |

---

## 💻 Desktop (Electron + React)

### ✅ Completed Features

#### Core Backend
- ✅ Rust M3U parser compiled to WASM
- ✅ TypeScript WASM wrapper (`@zenith-tv/parser`)
- ✅ SQLite database setup (better-sqlite3)
- ✅ Database schema (7 tables)
- ✅ Database service layer with full CRUD
- ✅ IPC handlers (main ↔ renderer)
- ✅ TypeScript API definitions

#### UI Components
- ✅ Electron + React + Vite setup
- ✅ Tailwind CSS configuration
- ✅ Video Player component
- ✅ Player Controls (play/pause, seek, volume, fullscreen)
- ✅ Keyboard shortcuts (Space, F, M, K, ←/→)
- ✅ Profile Manager modal
- ✅ Category Browser sidebar (6 categories)
- ✅ Content Grid with responsive layout
- ✅ Category badges (LIVE, S01E01, MOVIE)
- ✅ Split screen view (Grid + Player)

#### State Management
- ✅ Zustand stores (player, profiles, content)
- ✅ SQLite database integration with stores
- ✅ Profile sync with M3U fetch and parse

#### M3U Integration
- ✅ Fetch M3U from URL with progress tracking
- ✅ Parse with Rust WASM
- ✅ Save to SQLite with upsert
- ✅ Detect new items
- ✅ Update profile sync timestamp
- ✅ Sync UI with progress indicator

### 🚧 In Progress

None currently

### ❌ Pending Features

#### Core Features
- ✅ Replace mock data with DB data
- ✅ Load items from SQLite by profile
- ✅ Favorites toggle + DB persistence
- ✅ Recent tracking (30-day window)
- ✅ Watch history + resume playback
- ✅ Auto-save video position
- ❌ Series episode grouping
- ❌ Season/Episode sorting

#### Search & Filter
- ✅ Search input (title, group)
- ✅ Live search with real-time filtering
- ✅ Sort by (Name, Date, Recently Watched)
- ✅ Sort order toggle (Ascending/Descending)
- ✅ Keyboard shortcut (Ctrl+F)

#### Player Enhancements
- ✅ Auto-resume from last position
- ❌ Next/Previous episode
- ❌ Auto-play next episode
- ❌ Remember volume level
- ❌ Remember subtitle/audio tracks
- ❌ Retry failed streams
- ✅ Detailed error messages

#### P2P Remote Control
- ❌ WebSocket server
- ❌ mDNS service announcement
- ❌ Device discovery UI
- ❌ Device pairing (PIN/QR)
- ❌ Remote control interface
- ❌ Send commands (play, seek, volume, select)
- ❌ Receive commands
- ❌ State synchronization
- ❌ "Controlled by [Device]" notification

#### Settings & Preferences
- ✅ Settings panel
- ✅ Theme (Dark/Light) - Dark implemented
- ✅ Language selection - UI ready
- ✅ Auto-update M3U interval
- ✅ Default category
- ✅ Default volume
- ✅ Auto-resume toggle
- ✅ Network settings (port, device name) - Prepared for P2P

#### UI/UX Polish
- ✅ Toast notifications (success, error, info, warning)
- ❌ Skeleton loaders
- ✅ Progress bar for M3U download
- ✅ Loading states for DB operations
- ❌ Keyboard navigation (Tab, Arrow keys)
- ❌ ARIA labels
- ❌ High contrast mode

#### Performance
- ❌ Virtual scrolling (1000+ items)
- ✅ Lazy load thumbnails (native loading="lazy")
- ❌ Cache parsed M3U
- ✅ Debounce search (300ms)
- ✅ React.memo for ContentCard optimization
- ❌ Optimize DB queries (indexes)

---

## 📺 Tizen TV (Web App)

### ❌ All Features Pending

#### Core
- ❌ Tizen Web App project setup
- ❌ Rust WASM M3U parser integration
- ❌ sql.js database (WASM SQLite)
- ❌ Storage adapter for sql.js

#### Player
- ❌ AVPlay API integration
- ❌ Multi-audio track support
- ❌ Subtitle support (VTT/SRT)
- ❌ D-pad navigation

#### UI
- ❌ React components (shared from Desktop)
- ❌ TV-optimized layout
- ❌ Focus navigation
- ❌ Remote control mapping

#### P2P
- ❌ WebSocket server/client
- ❌ mDNS service
- ❌ Device pairing
- ❌ Remote control (both ways)

#### Build
- ❌ Tizen Studio configuration
- ❌ `.wgt` package generation
- ❌ Certificate signing

---

## 📱 Android (Flutter)

### ❌ All Features Pending

#### Core
- ❌ Flutter project setup
- ❌ Rust FFI bindings
- ❌ drift + rusqlite integration
- ❌ M3U parser via FFI

#### Player
- ❌ ExoPlayer integration
- ❌ Multi-track support
- ❌ PiP mode

#### UI
- ❌ Adaptive layouts (Phone/Tablet/TV)
- ❌ D-pad navigation (TV)
- ❌ Touch gestures (Phone/Tablet)
- ❌ Material 3 Design

#### P2P
- ❌ WebSocket client
- ❌ NSD (Network Service Discovery)
- ❌ Device pairing
- ❌ Remote control interface

#### Build
- ❌ APK build configuration
- ❌ Android TV support
- ❌ Google Play signing

---

## 🔗 Shared Components

### ✅ Completed
- ✅ `@zenith-tv/types` - TypeScript type definitions
- ✅ `@zenith-tv/protocol` - WebSocket protocol helpers
- ✅ `@zenith-tv/ui` - Zustand player store
- ✅ `@zenith-tv/parser` - Rust WASM M3U parser

### ❌ Pending
- ❌ `@zenith-tv/db-web` - sql.js wrapper (Tizen)
- ❌ WebSocket protocol implementation
- ❌ mDNS utilities
- ❌ Device pairing logic
- ❌ Shared React components library

---

## 🎯 Current Sprint (Phase 1)

### Goals ✅ COMPLETE
1. ✅ ~~Build Rust WASM parser~~
2. ✅ ~~SQLite setup + schema~~
3. ✅ ~~M3U fetch & parse integration~~
4. ✅ ~~Replace mock data with DB~~
5. ✅ ~~Favorites functionality~~
6. ✅ ~~Recent tracking~~
7. ✅ ~~Watch history + resume~~

### Phase 2 Goals ✅ COMPLETE
- ✅ ~~Search & filter~~
- ✅ ~~Settings panel~~
- ✅ ~~Toast notifications~~
- ✅ ~~Loading states~~
- ✅ ~~Sort functionality~~
- ✅ ~~Performance optimizations~~

### Future (Phase 3)
- P2P Remote Control
- Tizen app
- Android app

---

## 📝 Notes

### Desktop
- Using better-sqlite3 for native SQLite
- WASM parser integrated with M3U sync
- Profile manager with sync button and progress indicator
- DB-backed content store with favorites and watch history
- Auto-resume playback from last position
- Auto-save watch progress every 10 seconds
- Real-time search with Ctrl+F keyboard shortcut
- Multi-criteria sort (Name, Date, Recently Watched)
- Toast notification system for all operations
- Comprehensive error handling with user-friendly messages
- Settings panel with localStorage persistence
- Debounced search input (300ms)
- React.memo optimization for content cards
- Lazy loading images for better performance

### Tizen
- Not started
- Will share React components with Desktop
- Need AVPlay API research
- sql.js for in-browser SQLite

### Android
- Not started
- Will use Rust FFI for parser
- ExoPlayer for video
- drift for SQLite

---

## 🔗 Related Documents

- [README.md](./README.md) - Project overview
- [core/parser/](./core/parser/) - Rust M3U parser
- [apps/desktop/](./apps/desktop/) - Desktop app
- [apps/tizen/](./apps/tizen/) - Tizen app (planned)
- [apps/mobile/](./apps/mobile/) - Android app (planned)

---

**Legend:**
- ✅ Completed
- 🔄 In Progress
- ❌ Not Started
- 🚧 Blocked/Issues
