

import { IState } from "./IState";
import { State } from "./State";
import { IMachine } from "./IMachine";

/**
 * Implementation of IMachine; probably any custom FSM would be based on this.
 *
 * @see IMachine for API docs.
 */
export class Machine implements IMachine {

	/*use*/ /*namespace*/ /*totem_internal*//*;*/

	/**
	 * What state will we start out in?
	 */
	public defaultState: string = "";

	/**
	 * Set of states, indexed by name.
	 */
	public states: Map<string, IState> = new Map<string, IState>();

	private _currentState: IState = null;

	private _previousState: IState = null;

	private _setNewState: boolean = false;

	constructor() {
	}

	public addState(name: string, state: IState): IMachine {
		this.states.set(name, state);
		(<State>state).stateMachine = this;
		// console.log((<State>state).stateMachine);
		return this;
	}

	public get currentState(): IState {
		return this.getCurrentState();
	}

	public get currentStateName(): string {
		return this.getStateName(this.getCurrentState());
	}

	public set currentStateName(value: string) {
		if (!this.setCurrentState(value))
			console.log("set currentStateName", "Could not transition to state '" + value);
	}

	public destroy(): void {
		this.states.clear();
		this._currentState = null;
		this._previousState = null;
	}

	public getCurrentState(): IState {
		if (!this._currentState) {
			if (!this.defaultState)
				return null;

			this.setCurrentState(this.defaultState);
		}

		return this._currentState;
	}

	public getPreviousState(): IState {
		return this._previousState;
	}

	public getState(name: string): IState {
		return <IState>this.states.get(name);
	}

	public getStateName(state: IState): string {

		this.states.forEach((component: IState, key: string) => {
			if (this.states.get(key) == state)
				return name;
		});
		return null;
	}

	public goToPreviousState(): boolean {
		if (this._previousState) {
			let name: string = this.getStateName(this._previousState);
			this.setCurrentState(name);
			return true;
		}
		return false;
	}

	public initialize(): void {

	}

	public reset(): void {
		this._currentState = null;
		this._previousState = null;
	}

	public setCurrentState(name: string): boolean {
		var _newState: IState = this.getState(name);

		if ( _newState == this._currentState)
			return false;
			
		if (!_newState) {
			throw new Error("State named:" + name);
		}

		var oldState: IState = this._currentState;
		this._setNewState = true;

		this._previousState = this._currentState;
		this._currentState = _newState;

		// Old state gets notified it is changing out.
		if (oldState)
			oldState.exit(this);

		// New state finds out it is coming in.    
		_newState.enter(this);

		return true;
	}

	public tick(): void {
		this._setNewState = false;

		// DefaultState - we get it if no state is set.
		if (!this._currentState && this.defaultState) {
			this.setCurrentState(this.defaultState);
		}

		if (this._currentState)
			this._currentState.tick(this);

		// If didn't set a new state, it counts as transitioning to the
		// current state. This updates prev/current state so we can tell
		// if we just transitioned into our current state.
		if (this._setNewState == false && this._currentState) {
			this._previousState = this._currentState;
		}
	}
}
