import 'isomorphic-fetch'

import { viewTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

export const toggleMainMenu = isOpen => (dispatch, getState) => {
	const state = getState()

	dispatch({
		type: viewTypes.TOGGLE_MAIN_MENU, 
		payload: isOpen instanceof Boolean ? isOpen : !state.view.mainMenuOpened
	})
}

export const setAppbarTitle = title => {
	return {type: viewTypes.SET_APPBAR_TITLE, payload: title}
}

export const toggleLessonsMenu = opened => {
	return {type: viewTypes.TOGGLE_LESSONS_MENU, payload: opened}
}

export const togglePathwayModal = opened => {
	return {type: viewTypes.TOGGLE_PATHWAY_MODAL, payload: opened}
}

export const dismissPathwayModal = opened => (dispatch, getState) => {
	dispatch(pending(viewTypes.DISMISS_PATHWAY_MODAL))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('hidePathway', true)
			.then(() => {
				dispatch(fulfilled(viewTypes.DISMISS_PATHWAY_MODAL))
			})
			.catch(err => {
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				dispatch(rejected(viewTypes.DISMISS_PATHWAY_MODAL, err))
			})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(viewTypes.DISMISS_PATHWAY_MODAL, e))
	}
}

export const setLocale = locale => (dispatch, getState) => {
	dispatch(pending(viewTypes.SET_LOCALE))

	const state = getState()
	const { systemLocaleMap } = state.view

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('locale', locale)
			.then(() => {
				dispatch(fulfilled(viewTypes.SET_LOCALE, locale))
			})
			.catch(err => {
				dispatch(rejected(viewTypes.SET_LOCALE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(viewTypes.SET_LOCALE, e))
	}
}

export const getContentLocaleMap = () => async (dispatch, getState) => {
	await dispatch(pending(viewTypes.GET_CONTENT_LOCALE_MAP))

	try {
		await fetch(`${process.env.ROOT}/api/github/locale`)
		.then(res => {
			if (!res.ok) throw res
			return res.json()
		})
		.then(async map => {
			await dispatch(fulfilled(viewTypes.GET_CONTENT_LOCALE_MAP, map))
		})
		.catch(async err => {
			await dispatch(rejected(viewTypes.GET_CONTENT_LOCALE_MAP, err))
		})
	} catch (e) {
		// no alert
		await dispatch(rejected(viewTypes.GET_CONTENT_LOCALE_MAP, e))
	}
}

export const openAlert = (type, message) => ({
	type: viewTypes.OPEN_ALERT,
	payload: {type, message},
})

export const closeAlert = () => (dispatch) => {
	setTimeout(() => {
		dispatch(unsetAlert())
	}, 300)

	dispatch({type: viewTypes.CLOSE_ALERT})
}

export const unsetAlert = () => ({type: viewTypes.UNSET_ALERT})

export const clearView = () => ({type: viewTypes.CLEAR_VIEW})

// Separate from syncDb, since view is not dependent on password
export const syncView = () => async (dispatch, getState) => {
	const ClientDB = require('../../db')

	const locale = await ClientDB.default.get('locale')
	const hidePathway = await ClientDB.default.get('hidePathway')

	dispatch(setLocale(locale))
	dispatch({type: viewTypes.SYNC_PATHWAY, payload: !hidePathway})
}
