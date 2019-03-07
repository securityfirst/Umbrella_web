import { checklistsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_CHECKLISTS_SYSTEM */
		case pending(checklistsTypes.GET_CHECKLISTS_SYSTEM):
			return {
				...state,
				getChecklistsSystemLoading: true,
			}
		case rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM):
			return {
				...state,
				getChecklistsSystemLoading: false,
				getChecklistsSystemError: action.payload,
			}
		case fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM):
			return {
				...state,
				getChecklistsSystemLoading: false,
				getChecklistsSystemError: null,
				checklistsSystem: action.payload,
			}

		/* GET_CHECKLISTS_CUSTOM */
		case pending(checklistsTypes.GET_CHECKLISTS_CUSTOM):
			return {
				...state,
				getChecklistsCustomLoading: true,
			}
		case rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM):
			return {
				...state,
				getChecklistsCustomLoading: false,
				getChecklistsCustomError: action.payload,
			}
		case fulfilled(checklistsTypes.GET_CHECKLISTS_CUSTOM):
			return {
				...state,
				getChecklistsCustomLoading: false,
				getChecklistsCustomError: null,
				checklistsCustom: action.payload,
			}

		/* SYNC_CHECKLISTS */
		case checklistsTypes.SYNC_CHECKLISTS: return action.payload

		/* CLEAR_CHECKLISTS */
		case checklistsTypes.CLEAR_CHECKLISTS:
			return {
				...state,
				...initialState.checklists,
			}
	}

	return state
}
