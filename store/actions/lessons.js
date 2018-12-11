import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../utils/error.js';

export function getLessonCards({category, subcategory}) {
	const {GET_LESSON_CARDS} = lessonsTypes;

	return (dispatch, getState) => {
		dispatch(pending(GET_LESSON_CARDS));

		/* TODO: Replace with API */
		fetch('http://example.com/movies.json', {
			mode: "no-cors", // no-cors, cors, *same-origi
		})
			.then(res => {
				dispatch(fulfilled(GET_LESSON_CARDS, true));
			})
			.catch(err => {
				dispatch(rejected(GET_LESSON_CARDS, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}