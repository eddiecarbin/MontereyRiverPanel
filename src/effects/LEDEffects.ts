

//https://electromage.com/patterns/


export class Color {

}
export class RGB extends Color {
    public red: number = 0;
    public green: number = 0;
    public blue: number = 0;

    constructor(r: number = 0, g: number = 0, b: number = 0) {
        super();
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

export class HSV extends Color {

}

export class LEDEffects {

    public name: string;

    private _start: number;
    private _end: number;

    protected paletteRGBs: Array<number> = new Array();

    protected pixelCount: number = 0;

    protected RGB: RGB = new RGB();

    constructor(name: string, start: number, end: number) {
        
        this.name = name;
        this._start = start;
        this._end = end;
        
        this.pixelCount = this.total;

        console.log( "loaded river = " + this.name + " , start = " + this._start);


    }
    protected clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(min, num), max);
    }

    protected getRandomVelocity(): number {
        return Math.floor(Math.random() * 4) + 3;
    }

    public render(delta: number): void {

    }

    public update(rawIndex: number): Color {
        return this.RGB;
    }

    protected createArray(size: number, valueOrFn: any = null, isFn: boolean = false): Array<any> {

        var arr: Array<any> = new Array();
        if (!valueOrFn) return arr;
        for (var i = 0; i < size; i++) {
            arr[i] = isFn ? valueOrFn(i) : valueOrFn;
        }
        return arr
    }

    public get start(): number {
        return this._start;
    }

    public get total(): number {
        return this._end - this._start;
    }

    protected packRGB(r: number, g: number, b: number): number { return this._packColor(r, g, b) }
    protected getR(value: number): number { return this._getFirstComponent(value); }
    protected getG(value: number): number { return this._getSecondComponent(value); }
    protected getB(value: number): number { return this._getThirdComponent(value); }

    protected packHSV(h: number, s: number, v: number) { return this._packColor(h, s, v) }
    protected getH(value: number) { return this._getFirstComponent(value) }
    protected getS(value: number) { return this._getSecondComponent(value) }
    protected getV(value: number) { return this._getThirdComponent(value) }

    private _packColor(a: number, b: number, c: number): number { return (a << 8) + b + (c >> 8) }
    private _getFirstComponent(value: number): number { return (value >> 8) & 0xff; } // R or H
    private _getSecondComponent(value: number): number { return value & 0xff; } // G or S
    private _getThirdComponent(value: number): number { return (value << 8) & 0xff; } // B or V


}