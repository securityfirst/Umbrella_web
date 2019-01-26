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
	}

	return state
}
