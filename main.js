const { app, BrowserWindow } = require('electron');
//var Omx = require('node-omxplayer');
// const { RiverAppContext } = require("./build/src/RiverAppContext");
// const { VLC } = require("./node_modules/vlc/vlc.js");
// const OmxPlayer = require('omxplayer-dbus');

//https://github.com/RandomStudio/omxconductor

// const { Player } = require('omxconductor');
const { RiverAppContext } = require("./build/src/RiverAppContext");

let riverApp;

// let player;

//export DISPLAY=:0.0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        fullscreen: true,
        // kiosk: true,
        backgroundColor: "#E5D47D",
        webPreferences: {
            nodeIntegration: true
        }
    });

    // player = new Player('./videos/beeShort.mp4', { loop: false })
    // player.open().then((result) => {
    //     console.log('Clip started playing OK! Some information:', result)
    // }).catch((err) => {
    //     console.error('error on open:', err);
    // });

    // player.on('open', (result) => {
    //     console.log('open event:', result);
    // });
    // player.on('progress', (result) => {
    //     //console.log('progress event:', result);
    // });
    // player.on('close', (result) => {
    //     //console.log('progress event:', result);
    // });
    // player.on('stopped', (result) => {
    //     //console.log('progress event:', result);
    // });

    // player.registerPositionTrigger(3000, (actualPosition) => {
    //     console.log('hit 3000ms trigger @', actualPosition);
    //     //player.seekAbsolute(0)
    // });

    // player.registerPositionTrigger(4000, (actualPosition) => {
    //     console.log('hit 3000ms trigger @', actualPosition);

    //     // player.pause();
    //     player.stop();
    //     player = null;

    //     sleep(500).then(() => {
    //         console.log("World!")

    //         player = new Player('./videos/beeLong.mp4', { loop: false });
    //         player.open().then((result) => {
    //             console.log('Clip started playing OK! Some information:', result)
    //         }).catch((err) => {
    //             console.error('error on open:', err);
    //         });;

    //         player.on('open', (result) => {
    //             console.log('open event:', result);
    //         });
    //         player.on('progress', (result) => {
    //             //console.log('progress event:', result);
    //         });
    //         player.on('close', (result) => {
    //             //console.log('progress event:', result);
    //         });
    //         player.on('stopped', (result) => {
    //             //console.log('progress event:', result);


    //         });
    //     });
    //     //player.seekAbsolute(0)
    // });

    win.on('close', () => {
        console.log("close");

        player.stop();
        player = null;

        //riverApp.destroy();
        //riverApp = null;
    })

    win.on('closed', () => {

        console.log("closed");
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.on('error'), () => {
        console.log(error);
    }


    riverApp = new RiverAppContext();
    riverApp.start();
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