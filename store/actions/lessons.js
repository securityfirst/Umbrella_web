import 'isomorphic-unfetch';
import set from 'lodash/set';
import get from 'lodash/get';

import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

const GITHUB_ACCESS_TOKEN = 'fa4d9091276a5532bb2a23fe0ecdebf2552682fe';

export const getLessons = () => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSONS));

		const state = getState();

		if (state.lessons.lessons) {
			dispatch(fulfilled(lessonsTypes.GET_LESSONS, state.lessons.lessons));
			return;
		}

		try {
			const repoReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/branches/master`);
			const repo = await repoReq.json();

			const masterTreeReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/git/trees/${repo.commit.sha}?recursive=1`);
			let lessons = await masterTreeReq.json();

			lessons = lessons.tree.reduce((lessonsSet, node) => {
				// if the node is a directory
				if (node.type === "tree") {
					// get the path string in dot notation
					const pathDotNotation = node.path.replace(/\//g, ".");
					// preset path with content array
					set(lessonsSet, pathDotNotation, get(lessonsSet, pathDotNotation, {content: []}));
				} 
				// otherwise if the node is a file
				else if (node.type === "blob") {
					// get the path string without filname in dot notation
					const nodePaths = node.path.split("/");
					const pathDotNotation = nodePaths.slice(0, -1).join(".");
					const filename = nodePaths.slice(-1)[0];
					// get the original object, default {content: []}
					let obj = get(lessonsSet, pathDotNotation);
					// add file sha
					obj.content.push({filename, sha: node.sha, url: node.url});
					// overwrite the object
					set(lessonsSet, pathDotNotation, obj);
				}

				else console.error("Content type is neither tree nor blob: " + node.type);

				return lessonsSet;
			}, {});

			dispatch(fulfilled(lessonsTypes.GET_LESSONS, lessons));
		} catch (err) {
			console.error(err);
			dispatch(rejected(lessonsTypes.GET_LESSONS, err));
		}
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
				path: `/assets/content/${locale}/${paths.join('/')}`,
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