import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	const {TOGGLE_CHECKLISTS_MENU} = viewTypes;

	switch (action.type) {
		/* TOGGLE_CHECKLISTS_MENU */
		case TOGGLE_CHECKLISTS_MENU:
			return {
				...state,
				checklistMenuIndex: action.payload,
			};
	}

	return state;
}
