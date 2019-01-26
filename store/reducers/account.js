import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* LOGIN */
		case pending(accountTypes.LOGIN):
			return {
				...state,
				loading: true,
			}
		case rejected(accountTypes.LOGIN):
			return {
				...state,
				loading: false,
				error: action.payload,
				isLoggedIn: false,
			}
		case fulfilled(accountTypes.LOGIN):
			return {
				...state,
				loading: false,
				error: null,
				isLoggedIn: true,
			}

		/* LOGOUT */
		case pending(accountTypes.LOGOUT):
			return {
				...state,
				loading: true,
			}
		case rejected(accountTypes.LOGOUT):
			return {
				...state,
				loading: false,
				error: action.payload,
				isLoggedIn: false,
			}
		case fulfilled(accountTypes.LOGOUT):
			return {
				...state,
				loading: false,
				error: null,
				isLoggedIn: false,
			}
	}

	return state
}
