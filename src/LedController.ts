
import { SPI } from "pi-spi"
import { Dotstar } from "dotstar"
import { LEDEffects, RGB, Color } from "./effects/LEDEffects";
import { AllRiver, RiverData } from "./AppParam";
import { RiverLEDEfx } from "./effects/RiverLEDEfx";

export class LedController {

    private totalLed: number;

    private ledStrip: Dotstar;

    private spi: SPI;

    private riverMap: LEDEffects[];

    private activeRivers: LEDEffects[];

    private _brightness: number = 0.8;

    constructor(spi: any, numled: number) {

        this.totalLed = numled;

        this.ledStrip = new Dotstar(spi, {
            length: this.totalLed
        });

        // ledStrip.all(255, 255, 0, 0.8);
        // ledStrip.sync();
        // this.ledStrip.all(255, 255, 0, 1);

        // this.ledStrip.sync();

        this.ledStrip.off();
        this.ledStrip.clear();
        this.ledStrip.sync();

        this.activeRivers = new Array<LEDEffects>();

    }

    public buildRivers(riverList: RiverData[]): void {

        let river: RiverData;

        this.riverMap = new Array<LEDEffects>();

        let riverEfx: LEDEffects;

        for (let i = 0; i < riverList.length; ++i) {
            river = riverList[i];
            this.riverMap.push(new RiverLEDEfx(river.id, river.led[0], river.led[1]));
        }
    }

    public activiateRiver(name: string): boolean {

        console.log(name);
        let river: LEDEffects = this.getRiverByName(name);
        if (river)
            this.activeRivers.push(river);
        return (river != null);
    }

    public getRiverByName(id: string): LEDEffects {

        for (let river of this.riverMap)
            if (river.name == id)
                return river;

        return null;
    }

    public reset(): void {
        this.activeRivers.length = 0;
        this.activeRivers = new Array<LEDEffects>();

        this.ledStrip.clear();
        this.ledStrip.off();
    }

    public stop(): void {
        this.ledStrip.clear();
        this.ledStrip.off();
    }

    /* public setAll():void{
        this.ledStrip.all(255, 255, 255, 0.8);
        this.ledStrip.sync();
    } */

    public update(): void {

        let l: number = this.activeRivers.length;
        let effect: LEDEffects;
        let total: number;
        let start: number;
        let rgb: RGB;

        // total number of active river effect
        for (let i = 0; i < l; ++i) {

            effect = this.activeRivers[i];
            effect.render(1000 / 60);

            total = effect.total;
            start = effect.start;
            //console.log("led total: " + total);
            for (let n = 0; n < total; n++) {
                rgb = effect.update(n) as RGB;
                this.ledStrip.set(start + n, rgb.red * 255, rgb.green * 255, rgb.blue * 255, this._brightness);
                //this.ledStrip.set(start + n, 255, 255, 255, this._brightness);

            }
        }

        this.ledStrip.sync();

    }

    public destroy(): void {
        // this.ledStrip.clear();
        // this.ledStrip.sync();
        this.ledStrip.off();
    }

}