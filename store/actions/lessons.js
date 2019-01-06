import 'isomorphic-unfetch';

import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { categories } from '../../mock/lessons';

export function getLessonCategories() {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_CATEGORIES));

		await fetch('https://api.secfirst.org/v1/categories', {mode: "cors"})
			.then(res => res.json)
			.then(data => dispatch(fulfilled(lessonsTypes.GET_LESSON_CATEGORIES, categories)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSON_CATEGORIES, err)));
	}
}

export function getLessonCards({category, subcategory}) {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_CARDS));

		/* TODO: Replace with API */
		await fetch('http://example.com/movies.json', {
			mode: "no-cors", // no-cors, cors, *same-origi
		})
			.then(res => res.json)
			.then(data => dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS, true)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSON_CARDS, err)));
	}
}