import 'isomorphic-unfetch'
import merge from 'lodash.merge'
import get from 'lodash.get'

import { feedsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { openAlert } from './view'

import { urlParams } from '../../utils/fetch'
import Crypto from '../../utils/crypto'

export const getFeeds = () => async (dispatch, getState) => {
	dispatch(pending(feedsTypes.GET_FEEDS))

	const store = getState()

	if (!store.feeds.feedLocation) {
		const message = 'Feed location is required'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.GET_FEEDS, message))
	}
	
	if (!store.feeds.feedSources.length) {
		const message = 'Feed sources are required'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.GET_FEEDS, message))
	}

	try {
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
			.then(res => {
				if (!res.ok) throw res
				return res.json()
			})
			.then(data => {
				dispatch(fulfilled(feedsTypes.GET_FEEDS, data))
			})
			.catch(err => {
				return dispatch(rejected(feedsTypes.GET_FEEDS, err))
			})
	} catch (e) {
		dispatch(rejected(feedsTypes.GET_FEEDS, e))
	}
}

export const setFeedLocation = location => (dispatch, getState) => {
	dispatch(pending(feedsTypes.SET_FEED_LOCATION))

	const state = getState()

	if (state.account.isProtected && !state.account.password) {
		const message = 'Login to update the feed location'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.SET_FEED_LOCATION, message))
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default.set('fe_l', location, state.account.password)

		dispatch(openAlert('success', 'Location saved'))
		dispatch(fulfilled(feedsTypes.SET_FEED_LOCATION, location))
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(feedsTypes.SET_FEED_LOCATION, e))
	}
}

export const setFeedSources = sources => (dispatch, getState) => {
	dispatch(pending(feedsTypes.SET_FEED_SOURCES))

	const state = getState()

	if (state.account.isProtected && !state.account.password) {
		const message = 'Login to update the feed sources'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.SET_FEED_SOURCES, message))
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default.set('fe_s', sources, state.account.password)

		dispatch(openAlert('success', 'Sources saved'))
		dispatch(fulfilled(feedsTypes.SET_FEED_SOURCES, sources))
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(feedsTypes.SET_FEED_SOURCES, e))
	}
}

export const getRss = () => (dispatch, getState) => {
	dispatch(pending(feedsTypes.GET_RSS))

	if (process.env.ENABLE_MOCK === 'true') {
		const { rss } = require('../../mock/rss')
		return dispatch(fulfilled(feedsTypes.GET_RSS, rss))
	}

	const state = getState()

	try {
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
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(feedsTypes.GET_RSS, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		return dispatch(rejected(feedsTypes.GET_RSS, e))
	}
}

export const addRssSource = (source, successCb) => (dispatch, getState) => {
	dispatch(pending(feedsTypes.ADD_RSS_SOURCE))

	const state = getState()

	if (state.account.isProtected && !state.account.password) {
		const message = 'Login to update the RSS sources'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, message))
	}

	if (state.feeds.rssSources.includes(source)) {
		const message = 'This RSS source is already added to your list'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, message))
	}

	try {
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
					dispatch(openAlert('error', `${res.statusText}\nPlease check your URL`))
					throw res
				}

				return res.json()
			})
			.then(data => {
				const sources = state.feeds.rssSources.concat([source])
				const rss = state.feeds.rss.concat([data])

				const ClientDB = require('../../db')

				ClientDB.default.set('rs_s', sources, state.account.password)

				dispatch(openAlert('success', 'RSS source saved'))
				dispatch(fulfilled(feedsTypes.ADD_RSS_SOURCE, {sources, rss}))
				!!successCb && successCb()
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		return dispatch(rejected(feedsTypes.ADD_RSS_SOURCE, e))
	}
}

export const removeRssSource = index => (dispatch, getState) => {
	dispatch(pending(feedsTypes.REMOVE_RSS_SOURCE))

	const state = getState()
	const source = state.feeds.rssSources[index]

	if (state.account.isProtected && !state.account.password) {
		const message = 'Login to update the RSS sources'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.REMOVE_RSS_SOURCE, message))
	}

	if (!source) {
		const message = 'This RSS source does not exist on your list'
		dispatch(openAlert('error', message))
		return dispatch(rejected(feedsTypes.REMOVE_RSS_SOURCE, message))
	}

	try {
		const sources = state.feeds.rssSources.filter(s => s !== source)
		const rss = state.feeds.rss.filter((r, i) => i !== index)

		const ClientDB = require('../../db')

		ClientDB.default.set('rs_s', sources, state.account.password)

		dispatch(openAlert('success', 'RSS source has been removed'))		
		dispatch(fulfilled(feedsTypes.REMOVE_RSS_SOURCE, {sources, rss}))
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(feedsTypes.REMOVE_RSS_SOURCE, e))
	}
}

export const clearFeeds = () => ({type: feedsTypes.CLEAR_FEEDS})