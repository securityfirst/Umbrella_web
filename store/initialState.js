const content = {
	getContentLoading: true,
	getContentError: null,
	content: null,
}

const account = {
	loading: false,
	error: null,
	loggedIn: false,
}

const feeds = {
	loading: true,
	error: null,
	data: [],
	current: null,
}

const forms = {
	getFormLoading: true,
	getFormError: null,
	form: null,
	postFormLoading: false,
	postFormError: null,
	postFormSuccess: false,
}

const lessons = {
	currentLesson: null,
	lessonsGlossaryIndex: null,
	getLessonChecklistLoading: false,
	getLessonChecklistError: null,
	currentLessonChecklist: null,
	getLessonFileLoading: true,
	getLessonFileError: null,
	currentLessonFile: null,
}

const checklists = {
	getSystemChecklistsLoading: true,
	getSystemChecklistsError: null,
	systemChecklists: {},
	getCustomChecklistsLoading: true,
	getCustomChecklistsError: null,
	getCustomChecklistsSuccess: false,
	customChecklists: [],
}

const view = {
	mainMenuOpened: false,
	appbarTitle: null,
	lessonsMenuOpened: 0,
	lessonsContentType: null,
	lessonsContentPath: null,
	lessonsFavoritesView: false,
	lessonFileView: false,
	locale: 'en',
}

export default {
	content,
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
}