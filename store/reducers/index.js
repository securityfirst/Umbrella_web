import { combineReducers } from 'redux';
import content from './content';
import account from './account';
import feeds from './feeds';
import forms from './forms';
import lessons from './lessons';
import checklists from './checklists';
import view from './view';

const reducer = combineReducers({
	content,
	account,
	feeds,
	forms,
	lessons,
	checklists,
	view,
});

export default reducer;
