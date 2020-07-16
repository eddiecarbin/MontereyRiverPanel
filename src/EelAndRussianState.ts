import { State, Stage } from "./state/State";
import { MoviePlayer } from "./MoviePlayer";
import { IMachine } from "./state/IMachine";
import { LedController } from "./LedController";
import { RiverLEDEfx } from "./effects/RiverLEDEfx";
import { Scene, Trigger } from "./AppParam";

export class EelAndRussianState extends State {

    static readonly NAME: string = "EelAndRussianState";

    private moviePlayer: MoviePlayer;

    private ledController: LedController;

    private data: Scene;

    constructor(moviePlayer: MoviePlayer, led: LedController, data: Scene) {
        super(EelAndRussianState.NAME);
        this.data = data;
        this.ledController = led;

        this.moviePlayer = moviePlayer;
    }

    public enter(fsm: IMachine): void {
        super.enter(fsm);

        console.log(this.name);

        let rivers = this.data.rivers

        console.log( rivers );

        this.ledController.reset();
        for (let i = 0; i < rivers.length; ++i) {

            this.ledController.activiateRiver(rivers[i]);

        }

        //this.moviePlayer.play("./videos/Test0.mp4");
        this.moviePlayer.play(this.data.movie);
        this.moviePlayer.on(MoviePlayer.MOVIE_PLAYING_EVENT, (eve) => { this.handleActionEvent(eve) });


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

        this._stage = Stage.READY;

    }

    public exit(fsm: IMachine): void {
        super.exit(fsm);

        this.moviePlayer.stop();
        this.moviePlayer.removeAllListeners();
        this.ledController.stop();
    }

    public tick(fsm: IMachine): void {
        this.ledController.update();
    }
}