
import colorsJson from '../riverdata.json'; // This import style requires "esModuleInterop", see "side notes"

import { MoviePlayer } from "./MoviePlayer"
import { ButtonController } from './ButtonController';

enum StateEnum {
    ProtectedBorderState,
    WatershedState,
    EelRusianState,
    CurrentHistoricState
}

export class RiverAppContext {

    private moviePlayer: MoviePlayer = new MoviePlayer();

    private protectedBorderButton: ButtonController = new ButtonController(27);
    private watershedButton: ButtonController = new ButtonController(22);
    private currentAndHistoricRiver: ButtonController = new ButtonController(23);
    private eelAndRusianButton: ButtonController = new ButtonController(24);

    // protected currentState: StateEnum = StateEnum.CurrentHistoricState;

    constructor() {
        console.log(colorsJson.rivers);
    }

    public start(): void {
        setInterval(() => {
            this.update();
        }, 1000 / 60);
        // setTimeout(() => alert("never happens"), 1000);
        // this.moviePlayer.play("./videos/beeShort.mp4");

        // 4 button

    }

    private handleEvent(event: string): void {
        // handle 4 different type of events.

    }

    private update(): void {
        // this.moviePlayer.update();
    }

    public destroy(): void {
        // this.moviePlayer.destroy();
        // this.moviePlayer = null;
    }
}