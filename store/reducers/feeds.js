import { feedsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_FEEDS */
		case pending(feedsTypes.GET_FEEDS):
			return {
				...state,
				getFeedsLoading: true,
			}
		case rejected(feedsTypes.GET_FEEDS):
			return {
				...state,
				getFeedsLoading: false,
				getFeedsError: action.payload,
			}
		case fulfilled(feedsTypes.GET_FEEDS):
			return {
				...state,
				getFeedsLoading: false,
				getFeedsError: null,
				feeds: action.payload,
			}

		/* GET_RSS */
		case pending(feedsTypes.GET_RSS):
			return {
				...state,
				getRssLoading: true,
			}
		case rejected(feedsTypes.GET_RSS):
			return {
				...state,
				getRssLoading: false,
				getRssError: action.payload,
			}
		case fulfilled(feedsTypes.GET_RSS):
			return {
				...state,
				getRssLoading: false,
				getRssError: null,
				rss: action.payload,
			}

		/* SYNC_RSS_SOURCES */
		case feedsTypes.SYNC_RSS_SOURCES:
			return {
				...state,
				rssSources: state.feeds.rssSources.concat(action.payload),
			}

	}

	return state
}
