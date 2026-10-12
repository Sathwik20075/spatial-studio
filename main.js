const { app, BrowserWindow, Tray, Menu, nativeImage, session, ipcMain, shell } = require('electron');
const path = require('path');

// Keep audio running when the window is hidden / minimised / in the tray.
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let win = null;
let tray = null;
let quitting = false;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', showWindow);
}

function createWindow(hidden) {
  win = new BrowserWindow({
    width: 1040,
    height: 820,
    minWidth: 420,
    show: !hidden,
    title: 'Spatial Sound Studio',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Closing the window hides it to the tray so the audio keeps being processed.
  win.on('close', (e) => {
    if (!quitting) {
      e.preventDefault();
      win.hide();
    }
  });
}

function showWindow() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createTray() {
  const img = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png')).resize({ width: 18, height: 18 });
  tray = new Tray(img);
  tray.setToolTip('Spatial Sound Studio – running in background');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Spatial Sound Studio', click: showWindow },
    { type: 'separator' },
    { label: 'Quit (stops spatial audio)', click: () => { quitting = true; app.quit(); } }
  ]));
  tray.on('click', showWindow);
}

app.whenReady().then(() => {
  // Allow audio device access (needed to read the virtual cable) without prompts.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => cb(permission === 'media'));
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => permission === 'media');

  const startHidden = process.argv.includes('--hidden');
  createWindow(startHidden);
  createTray();
});

app.on('before-quit', () => { quitting = true; });
app.on('activate', showWindow);
// Do not quit when all windows are closed – we live in the tray.
app.on('window-all-closed', () => {});

ipcMain.handle('open-sound', () => {
  const url = process.platform === 'win32' ? 'ms-settings:sound'
    : process.platform === 'darwin' ? 'x-apple.systempreferences:com.apple.Sound-Settings.extension' : null;
  if (url) shell.openExternal(url);
});
ipcMain.handle('get-login', () => app.getLoginItemSettings().openAtLogin);
ipcMain.handle('set-login', (_e, on) => {
  app.setLoginItemSettings({ openAtLogin: !!on, args: ['--hidden'] });
  return app.getLoginItemSettings().openAtLogin;
});
