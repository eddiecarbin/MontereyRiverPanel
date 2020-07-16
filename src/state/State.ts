

import { IMachine } from "./IMachine";
import { IState } from "./IState";

export enum Stage{
	BUSY,
	READY
}

export class State implements IState {
		
	public stateMachine!: IMachine;

	private _name: string;

	protected _stage : Stage;

	constructor(name: string = "") {
		this._name = name;
	}

	public enter(fsm: IMachine): void {
		this._stage = Stage.BUSY;
	}
	
	public exit(fsm: IMachine): void {
		this._stage = Stage.BUSY;
	}

	public get name(): string {
		return this._name;
	}

	public tick(fsm: IMachine): void {
	}

	public get stage () : Stage{
		return this._stage;
	}
	
	protected goToPreviousState(): boolean {
		return this.stateMachine.goToPreviousState();
	}

	protected gotoState(value: string): void {
		this.stateMachine.setCurrentState(value);
	}
}
