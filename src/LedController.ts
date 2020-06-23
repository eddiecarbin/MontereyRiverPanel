
import { SPI } from "pi-spi"
import { Dotstar } from "dotstar"
import { LEDEffects, RGB, Color } from "./effects/LEDEffects";

export class LedController {

    private totalLed: number;

    private ledStrip: Dotstar;

    private spi: SPI;

    private effect: LEDEffects;

    constructor(spi: any, numled: number) {

        this.totalLed = numled;

        this.ledStrip = new Dotstar(spi, {
            length: this.totalLed
        });

        // ledStrip.all(255, 255, 0, 0.8);
        // ledStrip.sync();
        // this.ledStrip.all(255, 255, 0, 1);

        // this.ledStrip.clear();
        // this.ledStrip.sync();

        this.ledStrip.off();

    }

    public setEffect(e: LEDEffects) {
        this.effect = e;
    }

    public stop(): void {
        this.ledStrip.off();
    }

    public update(): void {
        if (this.effect) {

            this.effect.render(1000 / 30);
            let rgb: RGB;
            for (var i = 0; i < this.totalLed; i++) {
                rgb = this.effect.update(i) as RGB;
                this.ledStrip.set(i, rgb.red * 255, rgb.green * 255, rgb.blue * 255, 1);
                // console.log(RGB[0])
            }
            this.ledStrip.sync();

        }
    }

    public destroy(): void {
        // this.ledStrip.clear();
        // this.ledStrip.sync();
        this.ledStrip.off();
    }

}