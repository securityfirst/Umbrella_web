const content = {
	getContentLoading: true,
	getContentError: null,
	content: null,
}

const account = {
	loginLoading: false,
	loginError: null,
	password: null,
	checkPasswordLoading: false,
	checkPasswordError: null,
	passwordExists: false,
	savePasswordLoading: false,
	savePasswordError: null,
	savePasswordSuccess: false,
}

const feeds = {
	loading: true,
	error: null,
	feeds: [],
	feedLocation: null,
	feedSources: [],
	getRssLoading: true,
	getRssError: null,
	rss: [],
	rssSources: [
		'http://feeds.bbci.co.uk/news/world/rss.xml',
		'https://www.aljazeera.com/xml/rss/all.xml',
		'https://threatpost.com/feed/',
		'https://krebsonsecurity.com/feed/',
		'https://nakedsecurity.sophos.com/feed/',
		'http://rss.cnn.com/rss/cnn_world.rss',
		'https://www.theguardian.com/world/rss',
	],
}

const forms = {
	getFormLoading: true,
	getFormError: null,
	form: null,
	getFormSavedLoading: true,
	getFormSavedError: null,
	formSaved: null,
	saveFormLoading: false,
	saveFormError: null,
	saveFormSuccess: false,
	deleteFormLoading: false,
	deleteFormError: null,
	deleteFormSuccess: false,
	formsSaved: [],
}

const lessons = {
	lessonsGlossaryIndex: null,
	getLessonChecklistLoading: false,
	getLessonChecklistError: null,
	currentLessonChecklist: null,
	getLessonFileLoading: true,
	getLessonFileError: null,
	currentLessonFile: null,
	getLessonCardsFavorites: true,
	getLessonCardsError: null,
	lessonCardsFavorites: [],
	addLessonCardFavoriteLoading: false,
	addLessonCardFavoriteError: null,
	removeLessonCardFavoriteLoading: false,
	removeLessonCardFavoriteError: null,
}

const checklists = {
	getChecklistsSystemLoading: true,
	getChecklistsSystemError: null,
	checklistsSystem: {},
	updateChecklistsSystemLoading: false,
	updateChecklistsSystemError: null,
	deleteChecklistSystemLoading: false,
	deleteChecklistSystemError: null,
	getChecklistsSystemFavoritesLoading: true,
	getChecklistsSystemFavoritesError: null,
	checklistsSystemFavorites: [],
	getChecklistsCustomLoading: true,
	getChecklistsCustomError: null,
	getChecklistsCustomSuccess: false,
	checklistsCustom: [],
	toggleChecklistFavoriteLoading: false,
	toggleChecklistFavoriteError: false,
	checklistFavorites: [],
}

const view = {
	mainMenuOpened: false,
	appbarTitle: null,
	lessonsMenuOpened: 0,
	locale: 'en',
}

const db = {
	loading: true,
	error: null,
}

export default {
	content,
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
	db,
}