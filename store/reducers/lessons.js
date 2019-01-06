import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_LESSON_CATEGORIES */
		case pending(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				getLessonCategoriesLoading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				getLessonCategoriesLoading: false,
				getLessonCategoriesError: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_CATEGORIES):
			return {
				...state,
				getLessonCategoriesLoading: false,
				getLessonCategoriesError: null,
				lessonCategories: action.payload,
			};

		/* GET_LESSON_CARDS */
		case pending(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				getLessonCardsLoading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				getLessonCardsLoading: false,
				getLessonCardsError: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_CARDS):
			return {
				...state,
				getLessonCardsLoading: false,
				getLessonCardsError: null,
				lessonCards: action.payload,
			};
	}

	return state;
}
