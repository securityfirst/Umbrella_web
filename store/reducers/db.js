import { dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* SYNC_DB */
		case pending(dbTypes.SYNC_DB):
			return {
				...state,
				loading: true,
			}
		case rejected(dbTypes.SYNC_DB):
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case fulfilled(dbTypes.SYNC_DB):
			return {
				...state,
				loading: false,
				error: null,
			}
	}

	return state
}
