import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	let lessonFilesCache = {};

	switch (action.type) {
		/* SET_LESSON */
		case lessonsTypes.SET_LESSON:
			return {
				...state,
				currentLesson: action.payload,
			};

		/* SET_LESSONS_GLOSSARY_INDEX */
		case lessonsTypes.SET_LESSONS_GLOSSARY_INDEX:
			return {
				...state,
				lessonsGlossaryIndex: action.payload,
			};

		/* GET_LESSON_CHECKLIST */
		case pending(lessonsTypes.GET_LESSON_CHECKLIST):
			return {
				...state,
				getLessonChecklistLoading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_CHECKLIST):
			return {
				...state,
				getLessonChecklistLoading: false,
				getLessonChecklistError: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_CHECKLIST):
			return {
				...state,
				getLessonChecklistLoading: false,
				getLessonChecklistError: null,
				currentLessonChecklist: action.payload,
			};

		/* GET_LESSON_FILE */
		case pending(lessonsTypes.GET_LESSON_FILE):
			return {
				...state,
				getLessonFileLoading: true,
			};
		case rejected(lessonsTypes.GET_LESSON_FILE):
			return {
				...state,
				getLessonFileLoading: false,
				getLessonFileError: action.payload,
			};
		case fulfilled(lessonsTypes.GET_LESSON_FILE):
			return {
				...state,
				getLessonFileLoading: false,
				getLessonFileError: null,
				currentLessonFile: action.payload,
			};

		/* CLOSE_LESSON */
		case lessonsTypes.CLOSE_LESSON:
			return {
				...state,
				currentLesson: null,
			};

		/* CLOSE_LESSON_FILE */
		case lessonsTypes.CLOSE_LESSON_FILE:
			return {
				...state,
				getLessonFileLoading: false,
				getLessonFileError: null,
				currentLessonFile: null,
			};

		/* RESET_LESSONS */
		case lessonsTypes.RESET_LESSONS:
			return {
				...state,
				currentLesson: null,
				currentLessonFile: null,
			};
	}

	return state;
}
