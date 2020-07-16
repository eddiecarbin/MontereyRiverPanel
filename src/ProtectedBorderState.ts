import { State, Stage } from "./state/State";
import { MoviePlayer } from "./MoviePlayer";
import { IMachine } from "./state/IMachine";
import { RelayController, RelayState } from "./RelayController";
import { AppParam, Scene, Trigger } from "./AppParam";
import appJson from '../riverdata.json'; // This import style requires "esModuleInterop", see "side notes"

export class ProtectedBorderState extends State {

    static readonly NAME: string = "ProtectedBorderState";

    private moviePlayer: MoviePlayer;
    private relayController: RelayController;

    private data: Scene;

    constructor(moviePlayer: MoviePlayer, data: Scene) {
        super(ProtectedBorderState.NAME);

        this.moviePlayer = moviePlayer;

        this.data = data;

        this.relayController = new RelayController(AppParam.RelayChannel1);
    }

    public enter(fsm: IMachine): void {
        super.enter(fsm);
        
        this.relayController.state = RelayState.ON;
        //this.moviePlayer.play("./videos/beeShort.mp4", true);
        this.moviePlayer.play(this.data.movie);
        this.moviePlayer.on(MoviePlayer.MOVIE_PLAYING_EVENT, (eve) => { this.handleActionEvent(eve) });

        
        if (this.data.triggers.length > 0) {
            let trigger: Trigger;
            for (let i = 0; i < this.data.triggers.length; ++i) {
                trigger = this.data.triggers[i];
                this.moviePlayer.addTrigger(trigger.time);
            }
            this.moviePlayer.on(MoviePlayer.MOVIE_TRIGGER_EVENT, (eve) => { this.handleActionEvent(eve) });
        }
    }

    public handleActionEvent(eve: any): void {
        //console.log("trigger state event " + eve);
        this._stage = Stage.READY;

        
    }

    public exit(fsm: IMachine): void {
        this.relayController.state = RelayState.OFF;
        this.moviePlayer.stop();
        this.moviePlayer.removeAllListeners();
    }

    public tick(fsm: IMachine): void {

    }
}