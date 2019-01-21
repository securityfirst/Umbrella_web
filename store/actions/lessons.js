import 'isomorphic-unfetch';

import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export const getLessons = () => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSONS));

		const state = getState();

		if (state.lessons.lessons) {
			dispatch(fulfilled(lessonsTypes.GET_LESSONS, state.lessons.lessons));
			return;
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
			checklist: !!content.find(c => c.filename.indexOf('c_') > -1)
		};

		dispatch({type: lessonsTypes.SET_LESSON, payload: content});
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

export const closeLessonFile = () => {
	return {type: lessonsTypes.CLOSE_LESSON_FILE};
}