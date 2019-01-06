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
	getLessonCategoriesLoading: true,
	getLessonCategoriesError: null,
	lessonCategories: [],
	getLessonCardsLoading: true,
	getLessonCardsError: null,
	lessonCards: [],
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
	appbarTitle: null,
	lessonsMenuOpened: 0,
};

export default {
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
};