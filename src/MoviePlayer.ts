
import { Player } from "omxconductor";
import { EventEmitter } from "events";
//https://github.com/RandomStudio/omxconductor


export enum PlayerState {

}

export class MoviePlayer extends EventEmitter {

    static readonly MOVIE_TRIGGER_EVENT: string = "MoviePlayer_MovieTriggerEvent";

    static readonly MOVIE_COMPLETE_EVENT: string = "MoviePlayer_MovieCompleteEvent";

    static readonly MOVIE_PLAYING_EVENT: string = "MoviePlayer_MoviePlaying";

    private player: Player | undefined;

    private isPlaying: boolean = false;

    private position: number;

    private duration: number;

    private progress: number;

    private eventCount: number;



    // add url and trigger evnets
    constructor() {
        super();
        // this.player = Omx();
        //this.omxPlayer.open("./videos/beeShort.mp4", { loop: false, adev: 'hdmi', pos: 0 });
    }

    public play(url: string, loop: boolean = true): void {
        // this.omxPlayer.open("./videos/beeShort.mp4", { loop: false, adev: 'hdmi', pos: 0 });

        this.player = new Player(url, { loop: loop });
        this.player.open().then((result) => {
            // console.log('Clip started playing OK! Some information:', result)
            this.emit(MoviePlayer.MOVIE_PLAYING_EVENT, "Movie Playing");
        }).catch((err) => {
            console.error('error on open:', err);
        });;

        this.eventCount = 0;

        this.player.on('open', (result) => {
            // console.log('open event:', result);
        });
        this.player.on('progress', (result) => {
            // console.log('progress event:', result);
            this.position = result.position;
            this.duration = result.duration;
            this.progress = result.progress;
        });
        this.player.on('close', (result) => {
            this.isPlaying = false;
            // console.log('progress event:', result);
        });
        this.player.on('stopped', (result) => {
            // console.log('progress event:', result);
            this.isPlaying = false;
            this.onStopped(result);
        });

    }

    public addTrigger(frame: number): void {

        this.player.registerPositionTrigger(frame, (actualPosition) => {
            // console.log('hit 3000ms trigger @', actualPosition);
            this.onDispatchEvent(actualPosition);
        });
    }

    private onDispatchEvent(position: number): void {
        this.emit(MoviePlayer.MOVIE_TRIGGER_EVENT, this.eventCount);
        this.eventCount += 1;
    }

    public set pause(value: boolean) {
        if (value) {
            this.player.pause();
            this.isPlaying = false;
        }
        else {
            this.isPlaying = true;
            this.player.resume();
        }
    }

    public stop(): void {
        this.player.stop();
        this.player.removeAllListeners()
        this.isPlaying = false;
    }

    private onStopped(event: any): void {
        this.isPlaying = false;
        // console.log("stopped action");
        // this.player?.removeAllListeners();
    }

    public update(): void {
        //console.log(this.player);
    }

    public destroy(): void {
        if (this.player) {
            this.player.stop();
            this.player.removeAllListeners();
        }
    }
}