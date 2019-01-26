import 'isomorphic-unfetch';

import { contentTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export const getContent = () => {
	return async (dispatch, getState) => {
		dispatch(pending(contentTypes.GET_CONTENT));

		const state = getState();

		if (state.content.content) {
			return dispatch(fulfilled(contentTypes.GET_CONTENT, state.content.content));
		}

		await fetch(`${process.env.ROOT}/api/github/tree`)
			.then(res => res.json())
			.then(content => dispatch(fulfilled(contentTypes.GET_CONTENT, content)))
			.catch(err => dispatch(rejected(contentTypes.GET_CONTENT, err)));
	}
}
