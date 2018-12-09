import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	const {TOGGLE_MENU} = viewTypes;

	switch (action.type) {
		/* TOGGLE_MENU */
		case TOGGLE_MENU:
			return {
				...state,
				menuToggled: !state.view.menuToggled,
			};
	}

	return state;
}
