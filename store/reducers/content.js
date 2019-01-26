import { contentTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_CONTENT */
		case pending(contentTypes.GET_CONTENT):
			return {
				...state,
				getContentLoading: true,
			}
		case rejected(contentTypes.GET_CONTENT):
			return {
				...state,
				getContentLoading: false,
				getContentError: action.payload,
			}
		case fulfilled(contentTypes.GET_CONTENT):
			return {
				...state,
				getContentLoading: false,
				getContentError: null,
				content: action.payload,
			}
	}

	return state
}
