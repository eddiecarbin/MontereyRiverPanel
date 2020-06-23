

import { IMachine } from "./IMachine";

/**
 * A state in a state machine. It is given the opportunity each
 * update of the machine to transition to a new state.
 *
 * Callbacks happen AFTER the previous/current state has been updated.
 */
export interface IState {
	/**
	 * Called when the machine enters this state.
	 */
	enter(fsm: IMachine): void;

	/**
	 * Called when we transition out of this state.
	 */
	exit(fsm: IMachine): void;

	/**
	 * Called every time the machine ticks and this is the current state.
	 *
	 * Typically this function will call setCurrentState on the FSM to update
	 * its state.
	 */
	tick(fsm: IMachine): void;

	stateMachine: IMachine;
}