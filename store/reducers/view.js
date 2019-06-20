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

		/* TOGGLE_PATHWAY_MODAL */
		case viewTypes.TOGGLE_PATHWAY_MODAL:
			return {
				...state,
				pathwayModalOpened: action.payload,
			}

		/* DISMISS_PATHWAY_MODAL */
		case pending(viewTypes.DISMISS_PATHWAY_MODAL):
			return {
				...state,
				dismissPathywayModalLoading: true,
				dismissPathywayModalError: null,
			}
		case rejected(viewTypes.DISMISS_PATHWAY_MODAL):
			return {
				...state,
				dismissPathywayModalLoading: false,
				dismissPathywayModalError: action.payload,
			}
		case fulfilled(viewTypes.DISMISS_PATHWAY_MODAL):
			return {
				...state,
				dismissPathywayModalLoading: false,
				dismissPathywayModalError: null,
				pathwayModalOpened: false,
			}

		/* SYNC_PATHWAY */
		case viewTypes.SYNC_PATHWAY:
			return {
				...state,
				pathwayModalOpened: action.payload,
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

		/* GET_LOCALE_MAP */
		case pending(viewTypes.GET_LOCALE_MAP):
			return {
				...state,
				getLocaleMapLoading: true,
				getLocaleMapError: null,
			}
		case rejected(viewTypes.GET_LOCALE_MAP):
			return {
				...state,
				getLocaleMapLoading: false,
				getLocaleMapError: action.payload,
			}
		case fulfilled(viewTypes.GET_LOCALE_MAP):
			return {
				...state,
				getLocaleMapLoading: false,
				getLocaleMapError: null,
				localeMap: action.payload,
			}

		/* OPEN_ALERT */
		case viewTypes.OPEN_ALERT:
			return {
				...state,
				alertOpen: true,
				alertType: action.payload.type,
				alertMessage: action.payload.message,
			}

		/* CLOSE_ALERT */
		case viewTypes.CLOSE_ALERT:
			return {
				...state,
				alertOpen: false,
			}

		/* UNSET_ALERT */
		case viewTypes.UNSET_ALERT:
			return {
				...state,
				alertType: null,
				alertMessage: null,
			}

		/* CLEAR_VIEW */
		case viewTypes.CLEAR_VIEW:
			return {
				...state,
				...initialState.view,
			}
	}

	return state
}
