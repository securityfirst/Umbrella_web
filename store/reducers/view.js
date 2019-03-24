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

		/* SET_LESSONS_CONTENT_TYPE */
		case viewTypes.SET_LESSONS_CONTENT_TYPE:
			return {
				...state,
				lessonsContentType: action.payload,
			}

		/* SET_LESSONS_CONTENT_PATH */
		case viewTypes.SET_LESSONS_CONTENT_PATH:
			return {
				...state,
				lessonsContentPath: action.payload,
			}

		/* TOGGLE_LESSON_FILE_VIEW */
		case viewTypes.TOGGLE_LESSON_FILE_VIEW:
			return {
				...state,
				lessonFileView: action.payload,
			}

		/* RESET_LESSONS */
		case viewTypes.RESET_LESSONS:
			return {
				...state,
				lessonsContentType: null,
				lessonsContentPath: null,
				lessonFileView: false,
			}

		/* SET_LOCALE */
		case viewTypes.SET_LOCALE:
			return {
				...state,
				locale: action.payload,
			}
	}

	return state
}
