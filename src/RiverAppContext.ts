
import colorsJson from '../riverdata.json'; // This import style requires "esModuleInterop", see "side notes"

import { MoviePlayer } from "./MoviePlayer"

export class RiverAppContext {

    private moviePlayer: MoviePlayer = new MoviePlayer();

    constructor() {
        console.log(colorsJson.rivers);
    }

    public start(): void {
        setInterval(this.update, 1000 / 60);

        this.moviePlayer.play("./videos/beeLong.mp4");
    }

    private update(): void {
        this.moviePlayer.update();
    }
}