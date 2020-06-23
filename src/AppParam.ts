


export interface Action {
    command: string;
    riverID: string[];
}

export interface Trigger {
    time: number;
    action: Action;
}

export interface River {
    id: string;
    led: number[];
}

export interface Scene {
    name: string;
    movie: string;
    triggers: Trigger[];
    rivers: River[];
}

export interface AllRiver {
    id: string;
    led: number[];
}

export interface RootObject {
    totalLeds: number;
    scene: Scene[];
    allRivers: AllRiver[];
}

export class Utils {

    public static getSceneByName(id: string, list: Scene[]): Scene {

        for (let i = 0; i < list.length; i++) {
            if (list[i].name == id)
                return list[i];
        }

        return null;
    }
}


export class AppParam {

    static readonly RelayChannel0 = 26;
    static readonly RelayChannel1 = 20;
    static readonly RelayChannel2 = 21;

    static readonly BUTTON_PIN0: number = 17;
    static readonly BUTTON_PIN1: number = 22;
    static readonly BUTTON_PIN2: number = 27;
    static readonly BUTTON_PIN3: number = 23;

}


