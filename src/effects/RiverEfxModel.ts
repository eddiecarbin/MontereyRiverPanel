import { RiverLEDEfx } from "./RiverLEDEfx";
import { LEDEffects } from "./LEDEffects";


export class RiverEfxModel2 {

    public name: string;

    private _start: number;
    private _end: number;

    private effect : LEDEffects;

    constructor(name: string, start: number, end: number) {
        this.name = name;
        this._start = start;
        this._end = end;
        console.log( "loaded river = " + this.name + " , start = " + this._start);

        //this.effect = new RiverLEDEfx(this.total);

    }

    public get start(): number {
        return this._start;
    }

    public get total(): number {
        return this._end - this._start;
    }
}