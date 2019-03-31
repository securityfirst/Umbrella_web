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

export const setLocale = localeCode => {
	return {type: viewTypes.SET_LOCALE, payload: localeCode}
}