import { viewTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* TOGGLE_MAIN_MENU */
		case viewTypes.TOGGLE_MAIN_MENU:
			return {
				...state,
				mainMenuOpened: action.payload,
			}

		/* SET_APPBAR_TITLE */
		case viewTypes.SET_APPBAR_TITLE:
			return {
				...state,
				appbarTitle: action.payload,
			}

		/* TOGGLE_LESSONS_MENU */
		case viewTypes.TOGGLE_LESSONS_MENU:
			return {
				...state,
				lessonsMenuOpened: action.payload,
			}

		/* SET_LOCALE */
		case pending(viewTypes.SET_LOCALE):
			return {
				...state,
				setLocaleLoading: true,
				setLocaleError: null,
			}
		case rejected(viewTypes.SET_LOCALE):
			return {
				...state,
				setLocaleLoading: false,
				setLocaleError: action.payload,
			}
		case fulfilled(viewTypes.SET_LOCALE):
			return {
				...state,
				setLocaleLoading: false,
				setLocaleError: null,
				locale: action.payload,
			}

		/* SYNC_VIEW */
		case viewTypes.SYNC_VIEW: return action.payload
	}

	return state
}
