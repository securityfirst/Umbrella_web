const account = {
	loading: false,
	error: null,
	loggedIn: false,
};

const feeds = {
	loading: true,
	error: null,
	data: [],
	current: null,
};

const forms = {
	getFormTypesLoading: true,
	getFormTypesError: null,
	formTypes: [],
	getFormsLoading: true,
	getFormsError: null,
	getFormsSuccess: false,
	forms: [],
	postFormLoading: false,
	postFormError: null,
	postFormSuccess: false,
};

const lessons = {
	getLessonsLoading: true,
	getLessonsError: null,
	lessons: null,
	currentLesson: null,
	lessonsGlossaryIndex: null,
	getLessonChecklistLoading: false,
	getLessonChecklistError: null,
	currentLessonChecklist: null,
	getLessonFileLoading: true,
	getLessonFileError: null,
	currentLessonFile: null,
};

const checklists = {
	getSystemChecklistsLoading: true,
	getSystemChecklistsError: null,
	systemChecklists: {},
	getCustomChecklistsLoading: true,
	getCustomChecklistsError: null,
	getCustomChecklistsSuccess: false,
	customChecklists: [],
};

const view = {
	mainMenuOpened: false,
	appbarTitle: null,
	lessonsMenuOpened: 0,
	lessonsContentType: null,
	lessonsContentPath: null,
	lessonsFavoritesView: false,
	lessonFileView: false,
	locale: 'en',
};

export default {
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
};