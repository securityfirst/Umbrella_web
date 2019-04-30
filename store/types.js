export const contentTypes = {
	GET_CONTENT: 'GET_CONTENT',
}

export const accountTypes = {
	LOGIN: 'LOGIN',
	CHECK_PASSWORD: 'CHECK_PASSWORD',
	SAVE_PASSWORD: 'SAVE_PASSWORD',
	CLEAR_PASSWORD: 'CLEAR_PASSWORD',
}

export const feedsTypes = {
	GET_FEEDS: 'GET_FEEDS',
	SET_FEED_LOCATION: 'SET_FEED_LOCATION',
	SET_FEED_SOURCES: 'SET_FEED_SOURCES',
	GET_RSS: 'GET_RSS',
	ADD_RSS_SOURCE: 'ADD_RSS_SOURCE',
	REMOVE_RSS_SOURCE: 'REMOVE_RSS_SOURCE',
	SYNC_FEEDS: 'SYNC_FEEDS',
	CLEAR_FEEDS: 'CLEAR_FEEDS',
}

export const formsTypes = {
	GET_FORM: 'GET_FORM',
	GET_FORM_SAVED: 'GET_FORM_SAVED',
	SAVE_FORM: 'SAVE_FORM',
	DELETE_FORM: 'DELETE_FORM',
	RESET_SAVE_FORM: 'RESET_SAVE_FORM',
	SYNC_FORMS: 'SYNC_FORMS',
	CLEAR_FORMS: 'CLEAR_FORMS',
}

export const lessonsTypes = {
	GET_LESSON_CHECKLIST: 'GET_LESSON_CHECKLIST',
	UNSET_LESSON_CHECKLIST: 'UNSET_LESSON_CHECKLIST',
	GET_LESSON_FILE: 'GET_LESSON_FILE',
	GET_LESSON_CARDS_FAVORITES: 'GET_LESSON_CARDS_FAVORITES',
	ADD_LESSON_CARD_FAVORITE: 'ADD_LESSON_CARD_FAVORITE',
	REMOVE_LESSON_CARD_FAVORITE: 'REMOVE_LESSON_CARD_FAVORITE',
	RESET_LESSONS: 'RESET_LESSONS',
}

export const checklistsTypes = {
	GET_CHECKLISTS_SYSTEM: 'GET_CHECKLISTS_SYSTEM',
	UPDATE_CHECKLISTS_SYSTEM: 'UPDATE_CHECKLISTS_SYSTEM',
	GET_CHECKLISTS_CUSTOM: 'GET_CHECKLISTS_CUSTOM',
	ADD_CHECKLIST_CUSTOM: 'ADD_CHECKLIST_CUSTOM',
	UPDATE_CHECKLIST_CUSTOM: 'UPDATE_CHECKLIST_CUSTOM',
	DELETE_CHECKLIST_CUSTOM: 'DELETE_CHECKLIST_CUSTOM',
	TOGGLE_CHECKLIST_FAVORITE: 'TOGGLE_CHECKLIST_FAVORITE',
	SYNC_CHECKLISTS: 'SYNC_CHECKLISTS',
	CLEAR_CHECKLISTS: 'CLEAR_CHECKLISTS',
}

export const viewTypes = {
	TOGGLE_MAIN_MENU: 'TOGGLE_MAIN_MENU',
	SET_APPBAR_TITLE: 'SET_APPBAR_TITLE',
	TOGGLE_LESSONS_MENU: 'TOGGLE_LESSONS_MENU',
	SET_LOCALE: 'SET_LOCALE',
}

export const dbTypes = {
	SYNC_DB: 'SYNC_DB',
	CLEAR_DB: 'CLEAR_DB',
}