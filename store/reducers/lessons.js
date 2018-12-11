import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* SET_LESSON_CATEGORIES */
		case (lessonsTypes.SET_LESSON_CATEGORIES):
			return {
				...state.lessons,
				categories: action.payload
			};

		/* GET_LESSON_CARDS */
		case pending(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				loading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				loading: false,
				error: null,
				// lessons: {
				// 	...state.lessons,
				// 	[`${action.category}.${action.subcategory}`]: action.payload,
				// },
			};
	}

	return state;
}
