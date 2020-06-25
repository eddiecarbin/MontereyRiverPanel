import { State } from "./state/State";
import { MoviePlayer } from "./MoviePlayer";
import { IMachine } from "./state/IMachine";
import { RelayController, RelayState } from "./RelayController";
import { AppParam, Scene, Trigger } from "./AppParam";

export class WatershedState extends State {

    static readonly NAME: string = "WatershedState";

    private moviePlayer: MoviePlayer;

    private relayController: RelayController;
    private data: Scene;

    constructor(moviePlayer: MoviePlayer, data: Scene) {
        super(WatershedState.NAME);
        this.data = data;

        this.moviePlayer = moviePlayer;
        this.relayController = new RelayController(AppParam.RelayChannel0);

    }

    public enter(fsm: IMachine): void {
        this.relayController.state = RelayState.ON;
        console.log(this.data.movie);
        this.moviePlayer.play("./videos/beeShort.mp4");
        if (this.data.triggers.length > 0) {
            let trigger: Trigger;
            for (let i = 0; i < this.data.triggers.length; ++i) {
                trigger = this.data.triggers[i];
                this.moviePlayer.addTrigger(trigger.time);
            }

            //console.log("add some triggers");
            this.moviePlayer.on(MoviePlayer.MOVIE_TRIGGER_EVENT, (eve) => { this.handleActionEvent(eve) });
        }
    }

    public handleActionEvent(eve: any): void {
        //console.log("trigger state event " + eve);
    }

    public exit(fsm: IMachine): void {
        this.relayController.state = RelayState.OFF;
        this.moviePlayer.stop();
        this.moviePlayer.removeAllListeners();

    }

    public tick(fsm: IMachine): void {

    }
}