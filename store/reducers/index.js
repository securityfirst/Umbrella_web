import { combineReducers } from 'redux';
import account from './account.js';
import feeds from './feeds.js';
import forms from './forms.js';
import lessons from './lessons.js';
import checklists from './checklists.js';
import view from './view.js';

const reducer = combineReducers({
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
});

export default reducer;
