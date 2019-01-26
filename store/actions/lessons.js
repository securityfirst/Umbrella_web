import 'isomorphic-unfetch';

import { lessonsTypes, viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export const getLessons = () => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSONS));

		const state = getState();

		if (state.lessons.lessons) {
			return dispatch(fulfilled(lessonsTypes.GET_LESSONS, state.lessons.lessons));
		}

		await fetch(`${process.env.ROOT}/api/github/tree`)
			.then(res => res.json())
			.then(content => dispatch(fulfilled(lessonsTypes.GET_LESSONS, content)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSONS, err)));
	}
}

export const setLesson = paths => {
	return (dispatch, getState) => {
		const state = getState();
		const { lessons } = state.lessons;
		const { locale } = state.view;

		let index = 0;
		let content = {...lessons}[locale];

		while (index < paths.length) {
			content = content[paths[index]];
			index++;
		}

		content = [...content.content];
		content = {
			level: paths[paths.length - 1],
			path: `../../static/assets/content/${locale}/${paths.join('/')}`,
			files: content.reduce((list, c) => {
				if (c.filename.indexOf('s_') === 0) {
					list.push({
						name: c.filename,
						sha: c.sha,
					});
				}

				return list;
			}, []),
			checklist: content.find(c => c.filename.indexOf('c_') > -1)
		};

		dispatch({type: lessonsTypes.SET_LESSON, payload: content});
	}
}

export const getLessonsFavorites = () => {
	// TODO: Get favorites from client data store
}

export const setLessonsGlossaryIndex = index => {
	return (dispatch, getState) => {
		const state = getState();
		const { lessons } = state.lessons;
		const { locale } = state.view;
		const range = index.toLowerCase().split("-");

		let content = [...lessons[locale].glossary.content];

		content = {
			path: `../../static/assets/content/${locale}/glossary`,
			files: content.reduce((list, c) => {

				if (
					c.filename.indexOf('s_') === 0 && // if it's a file
					c.filename[2] >= range[0] && // if it's within glossary range
					c.filename[2] <= range[1] // if it's within glossary range
				) {
					list.push({
						name: c.filename,
						sha: c.sha,
					});
				}

				return list;
			}, []),
			checklist: null
		};

		dispatch({type: lessonsTypes.SET_LESSON, payload: content});
	}
}

export const getLessonChecklist = sha => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_CHECKLIST));

		await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => res.text())
			.then(content => dispatch(fulfilled(lessonsTypes.GET_LESSON_CHECKLIST, content)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSON_CHECKLIST, err)));
	}
}

export const getLessonFile = sha => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_FILE));

		await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => res.text())
			.then(content => dispatch(fulfilled(lessonsTypes.GET_LESSON_FILE, content)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSON_FILE, err)));
	}
}

export const closeLesson = () => {
	return {type: lessonsTypes.CLOSE_LESSON};
}

export const closeLessonFile = () => {
	return {type: lessonsTypes.CLOSE_LESSON_FILE};
}

export const resetLessons = () => {
	return (dispatch, getState) => {
		dispatch({type: lessonsTypes.RESET_LESSONS});
		dispatch({type: viewTypes.RESET_LESSONS});
	}
}