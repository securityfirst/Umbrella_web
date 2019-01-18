import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import lessons from '../../data/github_tree.json';

export const getLessons = () => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSONS));

		if (lessons) dispatch(fulfilled(lessonsTypes.GET_LESSONS, lessons));
		else dispatch(rejected(lessonsTypes.GET_LESSONS, {status: 404, message: 'Lessons not found.'}));
	}
}

export const setLesson = paths => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.SET_LESSON));

		const state = getState();
		const { lessons } = state.lessons;
		const { locale } = state.view;

		try {
			let index = 0;
			let content = {...lessons}[locale];

			while (index < paths.length) {
				content = content[paths[index]];
				index++;
			}

			if (!content) throw new Error({status: 404, message: 'Lesson not found'});

			content = [...content.content];
			content = {
				level: paths[paths.length - 1],
				path: `../../static/assets/content/${locale}/${paths.join('/')}`,
				files: content.reduce((list, c) => {
					if (c.filename.indexOf('s_') === 0) list.push(c.filename);
					return list;
				}, []),
				checklist: !!content.find(c => c.filename.indexOf('c_') > -1)
			};

			dispatch(fulfilled(lessonsTypes.SET_LESSON, content));
		} catch (err) {
			console.error(err);
			dispatch(rejected(lessonsTypes.SET_LESSON, err));
		}
	}
}