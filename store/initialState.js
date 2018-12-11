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
	loading: true,
	erorr: null,
	data: [],
	current: null,
};

const lessons = {
	loading: true,
	erorr: null,
	categories: [],
	current: null,
};

const checklists = {
	loading: true,
	erorr: null,
	data: [],
	current: null,
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