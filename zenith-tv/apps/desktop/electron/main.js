const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getDatabase } = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode
    mainWindow.loadFile(path.join(__dirname, '../dist-renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize database
  db = getDatabase();
  db.init();

  // Setup IPC handlers
  setupIPCHandlers();

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db?.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  db?.close();
});

// IPC Handlers
function setupIPCHandlers() {
  // Profiles
  ipcMain.handle('db:getProfiles', () => db.getProfiles());
  ipcMain.handle('db:addProfile', (_, name, url) => db.addProfile(name, url));
  ipcMain.handle('db:deleteProfile', (_, id) => db.deleteProfile(id));

  // Items
  ipcMain.handle('db:getItemsByProfile', (_, profileId) => db.getItemsByProfile(profileId));
  ipcMain.handle('db:upsertItems', (_, profileId, items) => db.upsertItems(profileId, items));
  ipcMain.handle('db:updateProfileSync', (_, profileId, count) => db.updateProfileSync(profileId, count));

  // Recent
  ipcMain.handle('db:getRecentItems', (_, profileId) => db.getRecentItems(profileId));
  ipcMain.handle('db:addToRecent', (_, itemUrls) => db.addToRecent(itemUrls));

  // Favorites
  ipcMain.handle('db:toggleFavorite', (_, itemUrl) => db.toggleFavorite(itemUrl));
  ipcMain.handle('db:getFavorites', (_, profileId) => db.getFavorites(profileId));

  // Watch History
  ipcMain.handle('db:saveWatchProgress', (_, itemUrl, position, duration) =>
    db.saveWatchProgress(itemUrl, position, duration)
  );
  ipcMain.handle('db:getWatchHistory', (_, itemUrl) => db.getWatchHistory(itemUrl));

  // M3U Cache
  ipcMain.handle('db:getM3UCache', (_, url) => db.getM3UCache(url));
  ipcMain.handle('db:saveM3UCache', (_, url, content, etag, lastModified, expiresInHours) =>
    db.saveM3UCache(url, content, etag, lastModified, expiresInHours)
  );
  ipcMain.handle('db:invalidateM3UCache', (_, url) => db.invalidateM3UCache(url));
  ipcMain.handle('db:cleanExpiredCache', () => db.cleanExpiredCache());
}
