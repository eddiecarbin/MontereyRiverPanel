const { app, BrowserWindow } = require('electron');
var Omx = require('node-omxplayer');
let creator;
let player;

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        //fullscreen: true,
        kiosk: true,
        backgroundColor: "#E5D47D",
        webPreferences: {
            nodeIntegration: true
        }
    });
    player = Omx("./videos/beeLong.mp4");
    // and load the index.html of the app.
    //win.loadFile('index.html')

    // omxplayer.start("./video/beeLong.mp4", function (error) {
    //     console.log(error);
    // });

    player.on("close", ()=>{
        player.newSource("./videos/beeShort.mp4");
    });

    // omxplayer.on("prop:position", function (newPosition) {

    // });
    // player.play();
    // Open the DevTools.
    //win.webContents.openDevTools();

    win.on('closed', () => {
        player.quit();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    };
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.