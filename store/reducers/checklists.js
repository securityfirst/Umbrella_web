import { checklistsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_SYSTEM_CHECKLISTS */
		case pending(checklistsTypes.GET_SYSTEM_CHECKLISTS):
			return {
				...state,
				getSystemChecklistsLoading: true,
			}
		case rejected(checklistsTypes.GET_SYSTEM_CHECKLISTS):
			return {
				...state,
				getSystemChecklistsLoading: false,
				getSystemChecklistsError: action.payload,
			}
		case fulfilled(checklistsTypes.GET_SYSTEM_CHECKLISTS):
			return {
				...state,
				getSystemChecklistsLoading: false,
				getSystemChecklistsError: null,
				systemChecklists: action.payload,
			}

		/* GET_CUSTOM_CHECKLISTS */
		case pending(checklistsTypes.GET_CUSTOM_CHECKLISTS):
			return {
				...state,
				getCustomChecklistsLoading: true,
			}
		case rejected(checklistsTypes.GET_CUSTOM_CHECKLISTS):
			return {
				...state,
				getCustomChecklistsLoading: false,
				getCustomChecklistsError: action.payload,
			}
		case fulfilled(checklistsTypes.GET_CUSTOM_CHECKLISTS):
			return {
				...state,
				getCustomChecklistsLoading: false,
				getCustomChecklistsError: null,
				customChecklists: action.payload,
			}
	}

	return state
}
