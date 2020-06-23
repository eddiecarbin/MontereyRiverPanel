
import { IState } from "./IState";

/**
 * Base interface for a finite state machine.
 */
export interface IMachine {

	/**
	 * Register a state under a name.
	 */
	addState(name: string, state: IState): IMachine;

	/**
	 * Get the name of the current state.
	 */
	currentStateName: string;

	/**
	 * What state are we on this tick?
	 */
	getCurrentState(): IState;

	/**
	 * What state were we on on the previous tick?
	 */
	getPreviousState(): IState;

	/**
	 * Get the state registered under the provided name.function get owner() : TotemEntity
	 */
	getState(name: string): IState;

	/**
	 * If this state is registered with us, give back the name it is under.
	 */
	getStateName(state: IState): string;

	/**
	 * Update the FSM to be in a new state. Current/previous states
	 * are updated accordingly, and callbacks and events are dispatched.
	 */
	setCurrentState(name: string): boolean;
	/**
	 * Update the state machine. The current state is given the opportunity
	 * to transition to another state.
	 */
	tick(): void;

	destroy():void;

	goToPreviousState() : boolean;
}