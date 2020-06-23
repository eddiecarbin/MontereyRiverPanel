
import { Gpio } from "onoff"
import { EventEmitter as EventDispatcher } from "events"
import { RiverAppContext } from "./RiverAppContext";

export class ButtonController extends EventDispatcher {

    static readonly BUTTON_EVENT: string = "ButtonController_buttonEvent";

    private button: Gpio;

    private id: string;

    constructor(pin: number, id: string) {
        super();
        this.button = new Gpio(pin, 'in', 'rising', { debounceTimeout: 10 });
        this.id = id;

        this.button.watch((err, value) => {
            if (err) {
                throw err;
            }

            console.log("a button was pressed");
            this.onDispatchEvent(value);
        });
        // process.on('SIGINT', _ => {
        //     this.button?.unexport();
        // });
    }

    private onDispatchEvent(event: any): void {
        this.emit(ButtonController.BUTTON_EVENT, this.id);
    }

    public destroy(): void {

        this.button?.unexport();
        this.button = null;
    }
}