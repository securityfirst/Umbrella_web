import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* SET_APPBAR_TITLE */
		case viewTypes.SET_APPBAR_TITLE:
			return {
				...state,
				appbarTitle: action.payload,
			};

		/* TOGGLE_LESSONS_MENU */
		case viewTypes.TOGGLE_LESSONS_MENU:
			return {
				...state,
				lessonsMenuOpened: action.payload,
			};
	}

	return state;
}
