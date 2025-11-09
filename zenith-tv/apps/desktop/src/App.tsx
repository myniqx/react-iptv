import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { ProfileManager } from './components/ProfileManager';
import { CategoryBrowser } from './components/CategoryBrowser';
import { ContentGrid } from './components/ContentGrid';
import { ToastContainer } from './components/ToastContainer';
import { useProfilesStore } from './stores/profiles';
import { useContentStore } from './stores/content';
import { usePlayerStore } from '@zenith-tv/ui/src/stores/player';

function App() {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showBrowser, setShowBrowser] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    profiles,
    currentProfile,
    loadProfiles,
    addProfile,
    selectProfile,
    deleteProfile,
    syncProfile,
    isSyncing,
    syncProgress,
  } = useProfilesStore();

  const {
    currentCategory,
    setCategory,
    getFilteredItems,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isLoading,
  } = useContentStore();

  const { play } = usePlayerStore();

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Show profile manager if no profiles exist
  useEffect(() => {
    if (profiles.length === 0) {
      setShowProfileManager(true);
    }
  }, [profiles.length]);

  // Keyboard shortcut for search (Ctrl+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddProfile = (url: string, name: string) => {
    addProfile(url, name);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Zenith TV
          </h1>
          {currentProfile && (
            <span className="text-sm text-gray-400">
              • {currentProfile.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfileManager(true)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg
                     transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
            Profiles
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Category Browser */}
        {showBrowser && (
          <CategoryBrowser
            currentCategory={currentCategory}
            onCategoryChange={setCategory}
          />
        )}

        {/* Content Grid or Player */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700 gap-4">
            <button
              onClick={() => setShowBrowser(!showBrowser)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm
                       transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                {showBrowser ? (
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                ) : (
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                )}
              </svg>
              {showBrowser ? 'Hide Browser' : 'Show Browser'}
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or group... (Ctrl+F)"
                className="w-full px-4 py-1.5 pl-10 bg-gray-700 border border-gray-600 rounded
                         text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                         text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm
                         text-white focus:outline-none focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="recent">Sort by Recent</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {sortOrder === 'asc' ? (
                    <path d="M7 14l5-5 5 5z" />
                  ) : (
                    <path d="M7 10l5 5 5-5z" />
                  )}
                </svg>
              </button>
            </div>

            <div className="text-sm text-gray-400 whitespace-nowrap">
              {getFilteredItems().length} items
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 grid grid-cols-2 overflow-hidden">
            {/* Content Grid */}
            <div className="overflow-hidden">
              <ContentGrid
                items={getFilteredItems()}
                onItemClick={(item) => play(item)}
                onToggleFavorite={toggleFavorite}
                isLoading={isLoading}
              />
            </div>

            {/* Video Player */}
            <div className="border-l border-gray-700">
              <VideoPlayer />
            </div>
          </div>
        </div>
      </main>

      {/* Profile Manager Modal */}
      {showProfileManager && (
        <ProfileManager
          profiles={profiles}
          currentProfile={currentProfile}
          onAddProfile={handleAddProfile}
          onSelectProfile={(profile) => {
            selectProfile(profile);
            setShowProfileManager(false);
          }}
          onDeleteProfile={deleteProfile}
          onSyncProfile={syncProfile}
          onClose={() => setShowProfileManager(false)}
          syncProgress={syncProgress}
          isSyncing={isSyncing}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
