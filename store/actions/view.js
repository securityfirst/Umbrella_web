import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export const toggleMainMenu = (isOpen) => {
	return (dispatch, getState) => {
		dispatch({
			type: viewTypes.TOGGLE_MAIN_MENU, 
			payload: isOpen instanceof Boolean ? isOpen : !getState().view.mainMenuOpened
		});
	}
}

export const setAppbarTitle = (title) => {
	return {type: viewTypes.SET_APPBAR_TITLE, payload: title};
}

export const toggleLessonsMenu = (opened) => {
	return {type: viewTypes.TOGGLE_LESSONS_MENU, payload: opened};
}

export const setLessonsContentType = (type) => {
	return {type: viewTypes.SET_LESSONS_CONTENT_TYPE, payload: type};
}

export const setLessonsContentPath = (type) => {
	return {type: viewTypes.SET_LESSONS_CONTENT_PATH, payload: type};
}

export const setLessonFileView = () => {
	return {type: viewTypes.SET_LESSON_FILE_VIEW};
}

export const closeLessonFileView = () => {
	return {type: viewTypes.CLOSE_LESSON_FILE_VIEW};
}

export const setLocale = (localeCode) => {
	return {type: viewTypes.SET_LOCALE, payload: localeCode};
}