import { LEDEffects, RGB, Color } from "./LEDEffects";


export class RiverLEDEfx extends LEDEffects {

    // private isForwardDirection: boolean = false;
    // private laserCount: number = 5;
    // private fadeFactor: number = 0.6;
    // private speedFactor: number = 0.03;

    // private useBlueLightning: boolean = false;

    public isForwardDirection: boolean = false;
    public laserCount: number = 10;
    public fadeFactor: number = 0.8;
    public speedFactor: number = 0.08;

    private useBlueLightning: boolean = false;

    private ambientR: number = 0;
    private ambientG: number = 0;
    private ambientB: number = 80;

    private laserRGB: Array<number>;

    private laserPositions: Array<number>;

    private laserVelocities: Array<number>;

    private pixelRGBs: Array<number>;

    constructor(name: string, start: number, end: number) {
        super(name, start, end);
        this.paletteRGBs.push(this.packRGB(13, 140, 255));
        this.paletteRGBs.push(this.packRGB(12, 100, 232));
        // this.paletteRGBs.push(this.packRGB(0, 120, 208));
        this.paletteRGBs.push(this.packRGB(0, 0, 0));
        this.paletteRGBs.push(this.packRGB(12, 148, 232));
        this.paletteRGBs.push(this.packRGB(13, 114, 255));

        this.laserRGB = this.createArray(this.laserCount, (i: number) => {
            return this.paletteRGBs[i % this.paletteRGBs.length]
        }, true);

        this.laserPositions = this.createArray(this.laserCount, () => {
            return Math.floor(Math.random() * this.pixelCount);
        }, true);

        this.laserVelocities = this.createArray(this.laserCount, () => {
            return this.getRandomVelocity()
        }, true);

        this.pixelRGBs = this.createArray(this.pixelCount);
    }

    public render(delta: number): void {
        var laserIndex, pixelIndex;
        for (pixelIndex = 0; pixelIndex < this.pixelCount; pixelIndex++) {
            this.pixelRGBs[pixelIndex] = this.packRGB(
                Math.floor(this.getR(this.pixelRGBs[pixelIndex]) * this.fadeFactor),
                Math.floor(this.getG(this.pixelRGBs[pixelIndex]) * this.fadeFactor),
                Math.floor(this.getB(this.pixelRGBs[pixelIndex]) * this.fadeFactor)
            )
        }

        // advance laser positions:
        var currentLaserPosition, nextLaserPosition;
        for (laserIndex = 0; laserIndex < this.laserCount; laserIndex++) {
            currentLaserPosition = this.laserPositions[laserIndex];
            nextLaserPosition = currentLaserPosition + (delta * this.speedFactor * this.laserVelocities[laserIndex]);
            for (pixelIndex = Math.floor(nextLaserPosition); pixelIndex >= currentLaserPosition; pixelIndex--) {
                // draw new laser edge, but fill in "gaps" from last draw:
                if (pixelIndex < this.pixelCount) {
                    this.pixelRGBs[pixelIndex] = this.packRGB(
                        Math.min(255, this.getR(this.pixelRGBs[pixelIndex]) + this.getR(this.laserRGB[laserIndex])),
                        Math.min(255, this.getG(this.pixelRGBs[pixelIndex]) + this.getG(this.laserRGB[laserIndex])),
                        Math.min(255, this.getB(this.pixelRGBs[pixelIndex]) + this.getB(this.laserRGB[laserIndex]))
                    );
                }
            }

            this.laserPositions[laserIndex] = nextLaserPosition;
            if (this.laserPositions[laserIndex] >= this.pixelCount) {
                // wrap this laser back to the start
                this.laserPositions[laserIndex] = 0;
                this.laserVelocities[laserIndex] = this.getRandomVelocity();
            }
        }
    }

    public update(rawIndex: number): Color {
        let index = this.isForwardDirection ? rawIndex : (this.pixelCount - rawIndex - 1);

        this.RGB.red = this.clamp((this.getR(this.pixelRGBs[index]) + this.ambientR) / 255, 0, 1);
        this.RGB.green = this.clamp((this.getG(this.pixelRGBs[index]) + this.ambientG) / 255, 0, 1);
        this.RGB.blue = this.clamp((this.getB(this.pixelRGBs[this.useBlueLightning ? 0 : index]) + this.ambientB) / 255, 0, 1);

        return this.RGB;
    }
}