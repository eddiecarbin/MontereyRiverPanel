
import { Gpio } from "onoff"

export class ButtonController {

    private button: Gpio | null | undefined;

    constructor(pin: number) {

        // this.button = new Gpio(pin, 'in', 'rising', { debounceTimeout: 10 });

        const led = new Gpio(17, 'out');
        const button = new Gpio(4, 'in', 'both');

        // this.button.watch((err, value) => {
        //     if (err) {
        //         throw err;
        //     }
        //     this.onDispatchEvent(value);
        // });
        // process.on('SIGINT', _ => {
        //     this.button?.unexport();
        // });
    }

    private onDispatchEvent(event: any): void {
        console.log("button pressed");
    }

    public destroy(): void {

        this.button?.unexport();
        this.button = null;
    }
}