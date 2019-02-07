import 'isomorphic-unfetch'

import { feedsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { urlParams } from '../../utils/fetch'

import { feeds } from '../../mock/feeds'

export const getFeeds = () => {
	return async (dispatch, getState) => {
		dispatch(pending(feedsTypes.GET_FEEDS))

		/* TODO: Replace with API */
		await fetch('https://jsonplaceholder.typicode.com/users')
			.then(async res => {
				if (!res.ok) throw new Error(res)
				return res.json()
			})
			.then(data => dispatch(fulfilled(feedsTypes.GET_FEEDS, feeds)))
			.catch(err => dispatch(rejected(feedsTypes.GET_FEEDS, err)))
	}
}

export const getRss = () => {
	return async (dispatch, getState) => {
		dispatch(pending(feedsTypes.GET_RSS))

		const store = getState()

		fetch(`${process.env.ROOT}/api/feeds/rss`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({sources: store.feeds.rssSources}),
		})
			.then(res => {
				if (!res.ok) throw new Error(res)
				return res.json()
			})
			.then(data => {
				console.log("data: ", data);
				dispatch(fulfilled(feedsTypes.GET_RSS, data))
			})
			.catch(err => {
				console.error('[ACTION] getRss fetch error: ', err)
				dispatch(rejected(feedsTypes.GET_RSS, err))
			})
	}
}

export const syncRssSources = () => {
	/* TODO: Get RSS sources from local storage */
	const sources = []

	return {type: feedsTypes.SYNC_RSS_SOURCES, payload: sources}
}

export const addRssSource = source => {
	/* TODO: Add source to local storage */

	return {type: feedsTypes.ADD_RSS_SOURCE, payload: [source]}
}