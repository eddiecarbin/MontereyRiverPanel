
import { State } from "./state/State";
import { MoviePlayer } from "./MoviePlayer";
import { IMachine } from "./state/IMachine";
import { RelayController } from "./RelayController";
import { AppParam, Scene, Trigger } from "./AppParam";
import { LedController } from "./LedController";
import { RiverLEDEfx } from "./effects/RiverLEDEfx";

export class HistoricCurrentState extends State {

    static readonly NAME: string = "HistoricCurrentState";

    private moviePlayer: MoviePlayer;

    private ledController: LedController;

    private data: Scene;

    constructor(moviePlayer: MoviePlayer, led: LedController, data: Scene) {
        super(HistoricCurrentState.NAME);
        this.data = data;
        this.ledController = led;

        let effect: RiverLEDEfx = new RiverLEDEfx(50);

        this.ledController.setEffect(effect);
        this.moviePlayer = moviePlayer;
    }

    public enter(fsm: IMachine): void {
        console.log(this.name);
        this.moviePlayer.play("./videos/beeShort.mp4");

        if (this.data.triggers.length > 0) {
            let trigger: Trigger;
            for (let i = 0; i < this.data.triggers.length; ++i) {
                trigger = this.data.triggers[i];
                this.moviePlayer.addTrigger(trigger.time);
            }

            console.log("add some triggers");
            this.moviePlayer.on(MoviePlayer.MOVIE_TRIGGER_EVENT, (eve) => { this.handleActionEvent(eve) });
        }
    }

    public handleActionEvent(eve: any): void {
        console.log("trigger state event " + eve);
    }
    
    public exit(fsm: IMachine): void {
        this.moviePlayer.stop();
        this.moviePlayer.removeAllListeners();
        this.ledController.stop();
    }

    public tick(fsm: IMachine): void {
        this.ledController.update();
    }
}