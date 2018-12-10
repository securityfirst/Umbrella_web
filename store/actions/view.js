import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export function toggleMainMenu(isOpen) {
	return (dispatch, getState) => {
		dispatch({
			type: viewTypes.TOGGLE_MAIN_MENU, 
			payload: isOpen instanceof Boolean ? isOpen : !getState().view.mainMenuOpened
		});
	}
}

export function setAppbarTitle(title) {
	return {type: viewTypes.SET_APPBAR_TITLE, payload: title};
}

export function toggleLessonsMenu(opened) {
	return {type: viewTypes.TOGGLE_LESSONS_MENU, payload: opened};
}