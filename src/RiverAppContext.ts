
import colorsJson from '../riverdata.json'; // This import style requires "esModuleInterop", see "side notes"

import { MoviePlayer } from "./MoviePlayer"

export class RiverAppContext {

    private moviePlayer: MoviePlayer = new MoviePlayer();

    constructor() {
        console.log(colorsJson.rivers);
    }

    public start(): void {
        setInterval(() => {
            this.update();
        }, 1000 / 60);
        // setTimeout(() => alert("never happens"), 1000);
        this.moviePlayer.play("./videos/beeShort.mp4");
    }

    private update(): void {
        this.moviePlayer.update();
    }

    public destroy(): void {
        this.moviePlayer.destroy();
        // this.moviePlayer = null;
    }
}