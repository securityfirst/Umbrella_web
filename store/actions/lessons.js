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
			const repoReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/branches/master?access_token=${GITHUB_ACCESS_TOKEN}`);
			const repo = await repoReq.json();

			const masterTreeReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/git/trees/${repo.commit.sha}?access_token=${GITHUB_ACCESS_TOKEN}&recursive=1`);
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

export const getLessonFile = ({sha, url}) => {
	return async (dispatch, getState) => {
		dispatch(pending(lessonsTypes.GET_LESSON_FILE));

		const state = getState();

		if (state.lessons.lessonFiles[sha]) dispatch(fulfilled(lessonsTypes.GET_LESSON_FILE, state.lessons.lessonfiles[sha]));

		await fetch(url)
			.then(res => res.blob())
			.then(data => dispatch(fulfilled(lessonsTypes.GET_LESSON_FILE, data)))
			.catch(err => dispatch(rejected(lessonsTypes.GET_LESSON_FILE, err)));
	}
}