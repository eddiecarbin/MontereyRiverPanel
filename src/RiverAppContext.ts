import appJson from '../riverdata.json'; // This import style requires "esModuleInterop", see "side notes"

import { MoviePlayer } from "./MoviePlayer"
import { ButtonController } from './ButtonController';
import { IMachine } from './state/IMachine';
import { Machine } from './state/Machine';
import { ProtectedBorderState } from './ProtectedBorderState';
import { WatershedState } from './WatershedState';
import { HistoricCurrentState } from './HistoricCurrentState';
import { EelAndRussianState } from './EelAndRussianState';
import { AppParam, Utils, RootObject } from './AppParam';
import { LedController } from './LedController';
import { RelayController, RelayState } from './RelayController';

/*
https://www.waveshare.com/wiki/RPi_Relay_Board

CH1	37	P25	26	Channel 1
CH2	38	P28	20	Channel 2
CH3	40	P29	21	Channel 3

https://cdn-shop.adafruit.com/product-files/2711/EzConnect.pdf

https://wiki.52pi.com/index.php/DockerPi_4_Channel_Relay_SKU:_EP-0099

https://learn.adafruit.com/adafruit-dotstar-leds/python-circuitpython

./node_modules/.bin/electron-rebuild

https://learn.adafruit.com/adafruit-dotstar-leds/python-circuitpython
http://json2ts.com/#

*/

export class RiverAppContext {

    private moviePlayer: MoviePlayer = new MoviePlayer();

    private ledController: LedController;

    private protectedBorderButton: ButtonController = new ButtonController(AppParam.BUTTON_PIN0, ProtectedBorderState.NAME);
    private watershedButton: ButtonController = new ButtonController(AppParam.BUTTON_PIN1, WatershedState.NAME);
    private currentAndHistoricRiver: ButtonController = new ButtonController(AppParam.BUTTON_PIN2, HistoricCurrentState.NAME);
    private eelAndRussianButton: ButtonController = new ButtonController(AppParam.BUTTON_PIN3, EelAndRussianState.NAME);

    private riverStateMachine: IMachine = new Machine();
    private relayController0: RelayController
    private relayController1: RelayController
    private relayController2: RelayController

    constructor() {
        // console.log(colorsJson.rivers);
    }

    public start(fps: number, spi: any): void {

        this.ledController = new LedController(spi, appJson.totalLeds);

        this.protectedBorderButton.on(ButtonController.BUTTON_EVENT, (eve) => { this.handleEvent(eve) });
        this.watershedButton.on(ButtonController.BUTTON_EVENT, (eve) => { this.handleEvent(eve) });
        this.currentAndHistoricRiver.on(ButtonController.BUTTON_EVENT, (eve) => { this.handleEvent(eve) });
        this.eelAndRussianButton.on(ButtonController.BUTTON_EVENT, (eve) => { this.handleEvent(eve) });
        
        let appData: RootObject = appJson as RootObject;
        
        this.riverStateMachine.addState(ProtectedBorderState.NAME, new ProtectedBorderState(this.moviePlayer, Utils.getSceneByName(ProtectedBorderState.NAME, appData.scene)));
        this.riverStateMachine.addState(WatershedState.NAME, new WatershedState(this.moviePlayer, Utils.getSceneByName(WatershedState.NAME, appData.scene)));
        this.riverStateMachine.addState(EelAndRussianState.NAME, new EelAndRussianState(this.moviePlayer, this.ledController, Utils.getSceneByName(EelAndRussianState.NAME, appData.scene)));
        this.riverStateMachine.addState(HistoricCurrentState.NAME, new HistoricCurrentState(this.moviePlayer, this.ledController, Utils.getSceneByName(HistoricCurrentState.NAME, appData.scene)));

        /*
        this.relayController0 = new RelayController(AppParam.RelayChannel0);
        this.relayController0.state = RelayState.ON;

        this.relayController1 = new RelayController(AppParam.RelayChannel1);
        this.relayController1.state = RelayState.OFF;

        this.relayController2 = new RelayController(AppParam.RelayChannel2);
        this.relayController2.state = RelayState.ON;
        */
        this.riverStateMachine.setCurrentState(ProtectedBorderState.NAME);
     
        setInterval(() => {
            this.update();
        }, fps);

        console.log("init app");
    }

    private handleEvent(state: string): void {

        console.log("state = " + state);
        this.riverStateMachine.setCurrentState(state);
    }

    private update(): void {
        this.riverStateMachine.tick();
    }

    public destroy(): void {

       /*  this.relayController0.state =  RelayState.OFF;
        this.relayController1.state =  RelayState.OFF; */
        this.riverStateMachine.destroy();
        this.ledController.destroy();
        this.moviePlayer.destroy();
    }
}
