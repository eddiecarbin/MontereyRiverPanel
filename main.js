const { app, BrowserWindow } = require('electron');
const { RiverAppContext } = require("./build/src/RiverAppContext");

const SPI = require('pi-spi');
let spi = SPI.initialize('/dev/spidev0.0');
let riverApp;

//export DISPLAY=:0.0
// npx tsc --project tsconfig.json

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        fullscreen: true,
        backgroundColor: "#000000",
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.on('close', () => {
        console.log("close");
    })

    win.on('closed', () => {
        console.log("closed = ");
        riverApp.destroy();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // win = null;
    });

    win.on('error', () => {
        console.log(error);
    });

    riverApp = new RiverAppContext();
    riverApp.start(1000 / 60, spi);
}

// Create myWindow, load the rest of the app, etc...

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // relay1.unexport();
        // relay2.unexport();
        // relay3.unexport();
        console.log("quit");
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