

import { IMachine } from "./IMachine";
import { IState } from "./IState";



export class State implements IState {
		
	public stateMachine!: IMachine;

	private _name: string;

	constructor(name: string = "") {
		this._name = name;
	}

	public enter(fsm: IMachine): void {
	}

	public exit(fsm: IMachine): void {
	}

	public get name(): string {
		return this._name;
	}

	public tick(fsm: IMachine): void {
	}

	protected goToPreviousState(): boolean {
		return this.stateMachine.goToPreviousState();
	}

	protected gotoState(value: string): void {
		this.stateMachine.setCurrentState(value);
	}
}
