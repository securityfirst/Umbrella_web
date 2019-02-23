import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* LOGIN */
		case pending(accountTypes.LOGIN):
			return {
				...state,
				loginLoading: true,
			}
		case rejected(accountTypes.LOGIN):
			return {
				...state,
				loginLoading: false,
				loginError: action.payload,
				password: null,
			}
		case fulfilled(accountTypes.LOGIN):
			return {
				...state,
				loginLoading: false,
				loginError: null,
				password: action.payload,
			}

		/* LOGOUT */
		case pending(accountTypes.LOGOUT):
			return {
				...state,
				logoutLoaidng: true,
			}
		case rejected(accountTypes.LOGOUT):
			return {
				...state,
				logoutLoaidng: false,
				logoutError: action.payload,
			}
		case fulfilled(accountTypes.LOGOUT):
			return {
				...state,
				logoutLoaidng: false,
				logoutError: null,
				password: null,
			}

		/* SAVE_PASSWORD */
		case pending(accountTypes.SAVE_PASSWORD):
			return {
				...state,
				savePasswordLoading: true,
				savePasswordError: null,
				savePasswordSuccess: false,
			}
		case rejected(accountTypes.SAVE_PASSWORD):
			return {
				...state,
				savePasswordLoading: false,
				savePasswordError: action.payload,
				savePasswordSuccess: false,
			}
		case fulfilled(accountTypes.SAVE_PASSWORD):
			return {
				...state,
				savePasswordLoading: false,
				savePasswordError: null,
				savePasswordSuccess: true,
				password: action.payload,
			}
	}

	return state
}
