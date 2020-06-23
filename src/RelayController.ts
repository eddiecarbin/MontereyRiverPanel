
import { EventEmitter as EventDispatcher } from "events"
import { Gpio } from "onoff";

export class RelayController extends EventDispatcher {

    private relay: Gpio;

    constructor(pin: number) {
        super();
        this.relay = new Gpio(pin, 'out');
    }

    /**
     * set state
     */
    public set state(value: boolean) {

        if (value)
            this.relay.writeSync(1);
        else
            this.relay.writeSync(0);
    }

    public destroy(): void {

        this.relay?.unexport();
        this.relay = null;
    }

}