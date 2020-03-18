
// import Omx from "node-omxplayer";
// const OmxPlayer = require('omxplayer-dbus');
// const { Player } = require('omxconductor');

import { Player } from "omxconductor";

export class MoviePlayer {

    private player: Player | undefined;

    private isPlaying : boolean = false;

    // add url and trigger evnets
    constructor() {
        // this.player = Omx();
        //this.omxPlayer.open("./videos/beeShort.mp4", { loop: false, adev: 'hdmi', pos: 0 });
    }

    public play(url: string, loop: boolean = false): void {
        // this.omxPlayer.open("./videos/beeShort.mp4", { loop: false, adev: 'hdmi', pos: 0 });

        this.player = new Player(url, { loop: loop });
        this.player.open();
        this.player.addListener('open', (result) => {
            console.log('open event:', result);

            this.isPlaying = true;
        });

        this.player.on('open', (result) => {
            console.log('open event:', result);
        });
        this.player.on('progress', (result) => {
            //console.log('progress event:', result);
        });
        this.player.on('close', (result) => {
            this.isPlaying = false;
            //console.log('progress event:', result);
        });
        this.player.on('stopped', (result) => {
            //console.log('progress event:', result);
            this.isPlaying = false;
            this.onStopped(result);
        });
    }

    private onStopped(event: any): void {
        this.isPlaying = false;
        console.log("stopped action");
        this.player?.removeAllListeners();
    }

    public update(): void {
        //console.log(this.player);
    }

    public destroy(): void {
        if (this.player) {
            console.log("killing");
            this.player.removeAllListeners();
        }
    }
}