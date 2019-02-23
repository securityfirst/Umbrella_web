import 'isomorphic-unfetch'
import merge from 'lodash.merge'
import CryptoJS from 'crypto-js'

import { feedsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { urlParams } from '../../utils/fetch'

import ClientDB from '../../db'

export const getFeeds = () => {
	return async (dispatch, getState) => {
		dispatch(pending(feedsTypes.GET_FEEDS))

		const store = getState()

		if (!store.feeds.feedLocation) {
			return dispatch(rejected(feedsTypes.GET_FEEDS, 'Feed location is required'))
		}
		
		if (!store.feeds.feedSources.length) {
			return dispatch(rejected(feedsTypes.GET_FEEDS, 'Feed sources are required'))
		}

		await fetch(`${process.env.ROOT}/api/feeds`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				location: store.feeds.feedLocation.properties.short_code,
				sources: store.feeds.feedSources,
			}),
		})
			.then(async res => {
				if (!res.ok) {
					console.error('[ACTION] getFeeds fetch error: ', res)
					throw new Error(res)
				}

				return res.json()
			})
			.then(data => {
				dispatch(fulfilled(feedsTypes.GET_FEEDS, data))
			})
			.catch(err => {
				console.error('[ACTION] getFeeds fetch error: ', err)
				dispatch(rejected(feedsTypes.GET_FEEDS, err))
			})
	}
}

export const setFeedLocation = location => {
	return (dispatch, getState) => {
		const state = getState()

		if (state.account.password) {
			ClientDB.store.setItem(
				'feeds', 
				CryptoJS.AES.encrypt(
					merge(state.feeds, {feedLocation: location}),
					state.account.password
				).toString()
			)
		}

		dispatch({type: feedsTypes.SET_FEED_LOCATION, payload: location})
	}
}

export const setFeedSources = sources => {
	return (dispatch, getState) => {
		const state = getState()

		if (state.account.password) {
			ClientDB.store.setItem(
				'feeds', 
				CryptoJS.AES.encrypt(
					merge(state.feeds, {feedSources: sources}),
					state.account.password
				).toString()
			)
		}

		dispatch({type: feedsTypes.SET_FEED_SOURCES, payload: sources})
	}
}

export const getRss = () => {
	return (dispatch, getState) => {
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
				if (!res.ok) {
					console.error('[ACTION] getRss fetch error: ', res)
					throw new Error(res)
				}

				return res.json()
			})
			.then(data => {
				dispatch(fulfilled(feedsTypes.GET_RSS, data))
			})
			.catch(err => {
				console.error('[ACTION] getRss fetch error: ', err)
				dispatch(rejected(feedsTypes.GET_RSS, err))
			})
	}
}

export const addRssSource = source => {
	/* TODO: Add source to local storage */

	return {type: feedsTypes.ADD_RSS_SOURCE, payload: [source]}
}