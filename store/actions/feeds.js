import 'isomorphic-unfetch'
import merge from 'lodash.merge'
import get from 'lodash.get'

import { feedsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { urlParams } from '../../utils/fetch'
import Crypto from '../../utils/crypto'

export const getFeeds = () => async (dispatch, getState) => {
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
			if (!res.ok) throw res
			return res.json()
		})
		.then(data => {
			dispatch(fulfilled(feedsTypes.GET_FEEDS, data))
		})
		.catch(err => {
			dispatch(rejected(feedsTypes.GET_FEEDS, err))
		})
}

export const setFeedLocation = location => (dispatch, getState) => {
	const state = getState()

	if (state.account.password) {
		const ClientDB = require('../../db')

		ClientDB.default.set('fe_l', location, state.account.password)
	}

	dispatch({type: feedsTypes.SET_FEED_LOCATION, payload: location})
}

export const setFeedSources = sources => (dispatch, getState) => {
	const state = getState()

	if (state.account.password) {
		const ClientDB = require('../../db')

		ClientDB.default.set('fe_s', sources, state.account.password)
	}

	dispatch({type: feedsTypes.SET_FEED_SOURCES, payload: sources})
}

export const getRss = () => (dispatch, getState) => {
	dispatch(pending(feedsTypes.GET_RSS))

	const state = getState()

	fetch(`${process.env.ROOT}/api/feeds/rss`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({sources: state.feeds.rssSources}),
	})
		.then(res => {
			if (!res.ok) throw res
			return res.json()
		})
		.then(data => {
			dispatch(fulfilled(feedsTypes.GET_RSS, data))
		})
		.catch(err => {
			dispatch(rejected(feedsTypes.GET_RSS, err))
		})
}

export const addRssSource = (source, successCb) => (dispatch, getState) => {
	dispatch(pending(feedsTypes.ADD_RSS_SOURCE))

	const state = getState()

	if (state.feeds.rssSources.includes(source)) {
		return dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, 'This RSS source is already added to your list.'))
	}

	fetch(`${process.env.ROOT}/api/feeds/rss/add`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({source}),
	})
		.then(res => {
			if (!res.ok) {
				alert(`${res.statusText}\nPlease check your URL`)
				throw res
			}

			return res.json()
		})
		.then(data => {
			const sources = state.feeds.rssSources.concat([source])
			const rss = state.feeds.rss.concat([data])

			if (state.account.password) {
				const ClientDB = require('../../db')

				ClientDB.default.set('rs_s', sources, state.account.password)
			}

			dispatch(fulfilled(feedsTypes.ADD_RSS_SOURCE, {sources, rss}))
			!!successCb && successCb()
		})
		.catch(err => dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, err)))
}

export const removeRssSource = index => (dispatch, getState) => {
	dispatch(pending(feedsTypes.REMOVE_RSS_SOURCE))

	const state = getState()
	const source = state.feeds.rssSources[index]

	if (!source) {
		return dispatch(rejected(feedsTypes.REMOVE_RSS_SOURCE, 'This RSS source does not exist on your list.'))
	}

	try {
		const sources = state.feeds.rssSources.filter(s => s !== source)
		const rss = state.feeds.rss.filter((r, i) => i !== index)

		if (state.account.password) {
			const ClientDB = require('../../db')

			ClientDB.default.set('rs_s', sources, state.account.password)
		}

		dispatch(fulfilled(feedsTypes.REMOVE_RSS_SOURCE, {sources, rss}))
	} catch (e) {
		dispatch(rejected(feedsTypes.REMOVE_RSS_SOURCE, e))
	}
}

export const clearFeeds = () => ({type: feedsTypes.CLEAR_FEEDS})