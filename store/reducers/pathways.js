import { pathwaysTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_PATHWAY_FILE */
		case pending(pathwaysTypes.GET_PATHWAY_FILE):
			return {
				...state,
				getPathwayFileLoading: true,
			}
		case rejected(pathwaysTypes.GET_PATHWAY_FILE):
			return {
				...state,
				getPathwayFileLoading: false,
				getPathwayFileError: action.payload,
			}
		case fulfilled(pathwaysTypes.GET_PATHWAY_FILE):
			return {
				...state,
				getPathwayFileLoading: false,
				getPathwayFileError: null,
				currentPathwayFile: action.payload,
			}

		/* UPDATE_PATHWAYS_CHECKED */
		case pending(pathwaysTypes.UPDATE_PATHWAYS_CHECKED):
			return {
				...state,
				updatePathwaysCheckedLoading: true,
			}
		case rejected(pathwaysTypes.UPDATE_PATHWAYS_CHECKED):
			return {
				...state,
				updatePathwaysCheckedLoading: false,
				updatePathwaysCheckedError: action.payload,
			}
		case fulfilled(pathwaysTypes.UPDATE_PATHWAYS_CHECKED):
			return {
				...state,
				updatePathwaysCheckedLoading: false,
				updatePathwaysCheckedError: null,
				pathwaysChecked: action.payload,
			}

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

		/* SYNC_PATHWAYS */
		case pathwaysTypes.SYNC_PATHWAYS:
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
