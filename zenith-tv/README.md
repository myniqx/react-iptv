# Zenith TV

Modern cross-platform IPTV player with peer-to-peer remote control support.

## Features

- 🎬 **Universal Player**: Watch IPTV streams on Desktop (Linux/Windows/macOS), Tizen TV, and Android TV
- 🔄 **Peer-to-Peer Remote Control**: Control any device from any other device on your local network
- 📺 **Smart Categorization**: Automatically organizes content into Movies, TV Series, and Live Streams
- 🎯 **Episode Detection**: Intelligent parsing of series episodes (S01E01, 1x01, etc.)
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- ⚡ **High Performance**: Rust-powered M3U parser with zero-copy streaming
- 🔊 **Multi-Track Support**: Multiple audio tracks and subtitle support
- 💾 **Offline First**: Local database with sync capabilities
- 🌐 **Local Network Sync**: Share favorites, watch history, and control playback across devices

## Architecture

### Platforms

- **Desktop**: Electron + React (Linux, Windows, macOS)
- **Tizen TV**: Web App + React
- **Android TV/Mobile**: Flutter

### Core Technologies

- **Parser**: Rust (compiled to WASM for web, FFI for native)
- **Database**: SQLite (rusqlite for native, sql.js for web)
- **UI Framework**: React 19 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Network**: WebSocket + mDNS for device discovery

## Project Structure

```
zenith-tv/
├── core/
│   ├── parser/         # Rust M3U parser (WASM + FFI)
│   ├── db-native/      # Rust SQLite wrapper (Desktop + Android)
│   └── db-web/         # sql.js wrapper (Tizen)
├── shared/
│   ├── types/          # TypeScript type definitions
│   ├── protocol/       # WebSocket protocol
│   └── ui/             # Shared React components
└── apps/
    ├── desktop/        # Electron app
    ├── tizen/          # Tizen Web app
    └── mobile/         # Flutter app
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Rust >= 1.75 (for core development)
- wasm-pack (for WASM builds)

### Installation

```bash
# Clone repository
git clone https://github.com/myniqx/zenith-tv.git
cd zenith-tv

# Install dependencies
pnpm install

# Build core (Rust → WASM)
pnpm build:core

# Run desktop app in development
pnpm dev:desktop
```

### Development

```bash
# Desktop app
pnpm dev:desktop

# Tizen app
pnpm dev:tizen

# Build all
pnpm build:all
```

## Roadmap

### Phase 1: Core & Desktop (Current)
- [x] Project structure
- [ ] Rust M3U parser
- [ ] Episode detection
- [ ] Desktop app UI
- [ ] SQLite integration
- [ ] Video player

### Phase 2: Network Sync
- [ ] WebSocket server/client
- [ ] mDNS device discovery
- [ ] Peer-to-peer protocol
- [ ] Device pairing

### Phase 3: Tizen
- [ ] Tizen Web app
- [ ] AVPlay integration
- [ ] sql.js database
- [ ] Tizen packaging

### Phase 4: Android
- [ ] Flutter app
- [ ] Rust FFI bindings
- [ ] ExoPlayer integration
- [ ] Adaptive UI (phone/tablet/TV)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with ❤️ using:
- [Rust](https://www.rust-lang.org/)
- [React](https://react.dev/)
- [Electron](https://www.electronjs.org/)
- [Flutter](https://flutter.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
