import 'isomorphic-unfetch';

import { feedsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { feeds } from '../../mock/feeds';

export function getFeeds() {
	return async (dispatch, getState) => {
		dispatch(pending(feedsTypes.GET_FEEDS));

		/* TODO: Replace with API */
		await fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => dispatch(fulfilled(feedsTypes.GET_FEEDS, feeds)))
			.catch(err => dispatch(rejected(feedsTypes.GET_FEEDS, err)));
	}
}