import { LEDEffects, HSV, Color } from "./LEDEffects";

export class RiverLED01Efx extends LEDEffects {

    private boltMin: number;
    private boltMax: number;
    private delayFactor = 15
    private resetDelayFactor = 1000
    private fade = 15

    private pixels: Array<number>;

    private x: number = 0
    private timer: number = 0;

    constructor(count: number) {
        super("count", 9, 3);

        this.pixels = this.createArray(this.pixelCount);
        this.boltMax = Math.ceil(this.pixelCount / 6)
        this.boltMin = Math.floor(this.pixelCount / 15)
    }
    public render(delta: number): void {
        for (var i = 0; i < this.pixelCount; i++)
            this.pixels[i] -= (this.pixels[i] * this.fade * (delta / 1000)) + (1 >> 16)

        this.timer -= delta;

        let boltSize: number;
        if (this.timer <= 0) {
            // boltSize = this.boltMin + random(this.boltMax - this.boltMin)
            boltSize = this.boltMin + ((Math.random() * this.boltMax) + this.boltMin);
            while (boltSize-- > 0 && this.x < this.pixelCount) {
                this.pixels[this.x++] = 1
            }

            this.timer = (Math.random() * this.delayFactor) + this.delayFactor / 5
            this.timer *= this.timer


            if (this.x >= this.pixelCount) {
                this.x = 0
                this.timer = (Math.random() * this.resetDelayFactor) + this.resetDelayFactor / 3
            }
        }
    }

    public update(index: number): Color {
        let v = this.pixels[index]
        // hsv(2/3, 0, v)


        return null;
    }
}
