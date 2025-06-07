
# **IPTV Manager**

A modern and user-friendly IPTV management application. Easily manage, edit, and watch your IPTV streams in M3U format.

## Features

- **Multi-Profile Support**: Create separate profiles for different users
- **Catalog Management**: Organize your channels and content into categories
- **Advanced Video Player**: Subtitle support, audio channel selection, and more
- **Translation Services**: Google Translate and DeepL integration for subtitle translation
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Customizable Interface**: Dark/light theme and personalization options
- **Data Storage Options**: Store your data using localStorage or IndexedDB
- **M3U File Support**: Import M3U formatted IPTV lists

## Requirements

- Node.js 18.0 or higher
- npm, yarn or pnpm
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/myniqx/react-iptv.git
cd react-iptv
```
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Set up API keys for translation services:
```bash
# Create a .env.local file
touch .env.local

# Add API keys
echo "NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_google_api_key" >> .env.local
echo "NEXT_PUBLIC_DEEPL_API_KEY=your_deepl_api_key" >> .env.local
```
## Running the Application

To run in development mode:

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:

```bash
npm run build
npm start
# or
yarn build
yarn start
```
## Project Structure

```bash
iptv-manager/
├── app/                  # Next.js App Router
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── videoplayer/      # Video player components
│   └── views/            # View components
├── hooks/                # Custom React hooks
├── lib/                  # Helper functions and types
│   ├── contexts/         # React contexts
│   ├── hooks/            # Domain-specific hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── public/               # Static files
└── styles/               # CSS files
```
## Configuration

### Data Storage

By default, `localStorage` is used. To switch to IndexedDB:

```typescript
// lib/hooks/useDataStorage.ts file
export function useDataStorage<T>(key: string): DataStorage<T> {
  // Use IndexedDB instead of localStorage:
  return useIndexedDBStorage<T>(key);
}
```
### Translation Services

To use translation services, add API keys to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_google_api_key
NEXT_PUBLIC_DEEPL_API_KEY=your_deepl_api_key
```
## Usage

1. Create a profile when the application first opens
2. Add an M3U URL or upload a local M3U file
3. Organize your catalogs and groups
4. Start watching your content

## Contributing

We welcome contributions! Please open an issue before submitting a pull request.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
