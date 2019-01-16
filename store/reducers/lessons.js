import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	let lessonFilesCache = {};

	switch (action.type) {
		/* GET_LESSONS */
		case pending(lessonsTypes.GET_LESSONS):
			return {
				...state,
				getLessonsLoading: true,
			};
		case rejected(lessonsTypes.GET_LESSONS):
			return {
				...state,
				getLessonsLoading: false,
				getLessonsError: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSONS):
			return {
				...state,
				getLessonsLoading: false,
				getLessonsError: null,
				lessons: action.payload,
			};

		/* SET_LESSON */
		case pending(lessonsTypes.SET_LESSON):
			return {
				...state,
				setLessonLoading: true,
				setLessonError: null,
			};
		case rejected(lessonsTypes.SET_LESSON):
			return {
				...state,
				setLessonLoading: false,
				setLessonError: action.payload,
			};
		case fulfilled(lessonsTypes.SET_LESSON):
			return {
				...state,
				setLessonLoading: false,
				setLessonError: null,
				currentLesson: action.payload,
			};
	}

	return state;
}
