
import { EventEmitter as EventDispatcher } from "events"
import { Gpio } from "onoff";
import { Player } from "omxconductor";


export enum RelayState {
    ON,
    OFF
}
export class RelayController extends EventDispatcher {

    private relay: Gpio;

    constructor(pin: number) {
        super();
        this.relay = new Gpio(pin, 'out');
        this.relay.writeSync(1);
    }

    /**
     * set state
     */
    public set state(value: RelayState) {

        if (value == RelayState.OFF)
            this.relay.writeSync(1);
        else
            this.relay.writeSync(0);
    }

    public destroy(): void {

        this.relay?.unexport();
        this.relay = null;
    }

}