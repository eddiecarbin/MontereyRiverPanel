

export class Effects {


    protected clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(min, num), max);
    }

    protected getRandomVelocity(): number {
        return Math.floor(Math.random() * 4) + 3;
    }
    public beforeRender(delta: number): void {

    }
    public render(rawIndex: number): void {

    }

    protected createArray(size: number, valueOrFn: any, isFn: boolean): Array<any> {

        var arr: Array<any> = new Array();
        if (!valueOrFn) return arr;
        for (var i = 0; i < size; i++) {
            arr[i] = isFn ? valueOrFn(i) : valueOrFn;
        }
        return arr
    }

    protected packRGB(r: number, g: number, b: number): number { return this._packColor(r, g, b) }
    protected getR(value: number): number { return this._getFirstComponent(value); }
    protected getG(value: number): number { return this._getSecondComponent(value); }
    protected getB(value: number): number { return this._getThirdComponent(value); }

    private _packColor(a: number, b: number, c: number): number { return (a << 8) + b + (c >> 8) }
    private _getFirstComponent(value: number): number { return (value >> 8) & 0xff; } // R or H
    private _getSecondComponent(value: number): number { return value & 0xff; } // G or S
    private _getThirdComponent(value: number): number { return (value << 8) & 0xff; } // B or V


}