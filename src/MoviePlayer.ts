
import Omx from "node-omxplayer";

export class MoviePlayer {

    private player: any;

    constructor() {
        this.player = Omx();
        console.log(this.player);
    }

    public play(url: string): void {
        this.player.newSource(url);
    }

    public update () : void{
        console.log("what");
        console.log(this.player.info());
    }
}