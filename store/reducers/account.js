import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	const {LOGIN, LOGOUT} = accountTypes;

	switch (action.type) {
		/* LOGIN */
		case pending(LOGIN):
			return {
				...state,
				loading: true,
			};
		case rejected(LOGIN):
			return {
				...state,
				loading: false,
				error: action.payload,
				isLoggedIn: false,
			};
		case fulfilled(LOGIN):
			return {
				...state,
				loading: false,
				error: null,
				isLoggedIn: true,
			};

		/* LOGOUT */
		case pending(LOGOUT):
			return {
				...state,
				loading: true,
			};
		case rejected(LOGOUT):
			return {
				...state,
				loading: false,
				error: action.payload,
				isLoggedIn: false,
			};
		case fulfilled(LOGOUT):
			return {
				...state,
				loading: false,
				error: null,
				isLoggedIn: false,
			};
	}

	return state;
}
