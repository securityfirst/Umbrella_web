import 'isomorphic-unfetch';

import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../../utils/error.js';

export function setLessonCategories({categories}) {
	return {type: lessonsTypes.SET_LESSON_CATEGORIES, payload: categories};
}

export function getLessonCards({category, subcategory}) {
	return (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_CARDS));

		/* TODO: Replace with API */
		fetch('http://example.com/movies.json', {
			mode: "no-cors", // no-cors, cors, *same-origi
		})
			.then(res => {
				dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS, true));
			})
			.catch(err => {
				dispatch(rejected(lessonsTypes.GET_LESSON_CARDS, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}