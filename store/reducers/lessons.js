import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	const {GET_LESSON_CARDS} = lessonsTypes;

	switch (action.type) {
		/* GET_LESSON_CARDS */
		case pending(GET_LESSON_CARDS):
			return {
				...state,
				loading: true,
			};
		case rejected(GET_LESSON_CARDS):
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case fulfilled(GET_LESSON_CARDS):
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
