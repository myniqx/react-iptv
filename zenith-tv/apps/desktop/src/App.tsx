import { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { ProfileManager } from './components/ProfileManager';
import { useProfilesStore } from './stores/profiles';

function App() {
  const [showProfileManager, setShowProfileManager] = useState(false);

  const {
    profiles,
    currentProfile,
    loadProfiles,
    addProfile,
    selectProfile,
    deleteProfile,
  } = useProfilesStore();

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
      <main className="flex-1 flex">
        {/* Sidebar - will be implemented in next step */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-sm text-gray-400">
              Category browser<br />coming next
            </p>
          </div>
        </aside>

        {/* Player */}
        <div className="flex-1">
          <VideoPlayer />
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
          onClose={() => setShowProfileManager(false)}
        />
      )}
    </div>
  );
}

export default App;
