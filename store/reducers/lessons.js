import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_LESSON_CATEGORIES */
		case pending(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				loading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				loading: false,
				error: null,
				categories: action.payload,
			};
	}

	return state;
}
