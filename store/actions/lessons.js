import set from 'lodash/set';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import { lessonsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../../utils/error.js';

export function getLessonCategories() {
	return async function (dispatch, getState) {
		dispatch(pending(lessonsTypes.GET_LESSON_CATEGORIES));

		try {
			// const repoReq = await fetch('https://api.github.com/repos/klaidliadon/umbrella-content/branches/master');
			// const repo = await repoReq.json();

			const categoriesReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/contents/en`);
			let lessons = await categoriesReq.json();

			console.log("lessons: ", lessons);

			// lessons = lessons.tree.reduce((lessonsSet, node) => {
			// 	// if the node is a directory
			// 	if (node.type === "tree") {
			// 		// get the path string in dot notation
			// 		const pathDotNotation = node.path.replace(/\//g, ".");
			// 		// preset path with content array
			// 		set(lessonsSet, pathDotNotation, get(lessonsSet, pathDotNotation, {content: []}));
			// 	} 
			// 	// otherwise if the node is a file
			// 	else if (node.type === "blob") {
			// 		// get the path string without filname in dot notation
			// 		const pathDotNotation = node.path.split("/").slice(0, -1).join(".");
			// 		// get the original object, default {content: []}
			// 		let obj = get(lessonsSet, pathDotNotation);
			// 		// add file sha
			// 		obj.content.push(node.sha);
			// 		// overwrite the object
			// 		set(lessonsSet, pathDotNotation, obj);
			// 	}

			// 	else console.log("Content type is neither tree nor blob: " + node.type);

			// 	return lessonsSet;
			// }, {});

			dispatch(fulfilled(lessonsTypes.GET_LESSON_CATEGORIES, lessons));
		} catch (e) {
			console.error('Error fetching lessons: ', e);
			dispatch(rejected(lessonsTypes.GET_LESSON_CATEGORIES, e));
		}
	}
}

function convertHyphenCaseToCapitalize(string) {
	return string.name.split("-").map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ");
}