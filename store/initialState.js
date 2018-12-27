const account = {
	loading: false,
	error: null,
	loggedIn: false,
};

const feeds = {
	loading: true,
	erorr: null,
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
	loading: true,
	erorr: null,
	categories: [],
	current: null,
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