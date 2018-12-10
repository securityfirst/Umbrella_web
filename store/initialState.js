const account = {
	loggedIn: false
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
	data: [],
	current: null,
};

const checklists = {
	loading: true,
	erorr: null,
	data: [],
	current: null,
};

const view = {
	checklistMenuIndex: 0,
};

export default {
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
};