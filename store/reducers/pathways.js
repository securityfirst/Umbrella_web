import { pathwaysTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_PATHWAYS_SAVED */
		case pending(pathwaysTypes.GET_PATHWAYS_SAVED):
			return {
				...state,
				getPathwaysSavedLoading: true,
			}
		case rejected(pathwaysTypes.GET_PATHWAYS_SAVED):
			return {
				...state,
				getPathwaysSavedLoading: false,
				getPathwaysSavedError: action.payload,
			}
		case fulfilled(pathwaysTypes.GET_PATHWAYS_SAVED):
			return {
				...state,
				getPathwaysSavedLoading: false,
				getPathwaysSavedError: null,
				pathwaysSaved: action.payload,
			}

		/* UPDATE_PATHWAYS_SAVED */
		case pending(pathwaysTypes.UPDATE_PATHWAYS_SAVED):
			return {
				...state,
				updatePathwaysSavedLoading: true,
			}
		case rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED):
			return {
				...state,
				updatePathwaysSavedLoading: false,
				updatePathwaysSavedError: action.payload,
			}
		case fulfilled(pathwaysTypes.UPDATE_PATHWAYS_SAVED):
			return {
				...state,
				updatePathwaysSavedLoading: false,
				updatePathwaysSavedError: null,
				pathwaysSaved: action.payload,
			}

		/* SYNC_PATHWAYS_SAVED */
		case pathwaysTypes.SYNC_PATHWAYS_SAVED:
			return {
				...state,
				...action.payload,
			}

		/* CLEAR_PATHWAYS_SAVED */
		case pathwaysTypes.CLEAR_PATHWAYS_SAVED:
			return {
				...state,
				...initialState.pathways,
			}
	}

	return state
}
