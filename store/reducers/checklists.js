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

		/* UPDATE_CHECKLISTS_SYSTEM */
		case pending(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM):
			return {
				...state,
				updateChecklistsSystemLoading: true,
			}
		case rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM):
			return {
				...state,
				updateChecklistsSystemLoading: false,
				updateChecklistsSystemError: action.payload,
			}
		case fulfilled(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM):
			return {
				...state,
				updateChecklistsSystemLoading: false,
				updateChecklistsSystemError: null,
				checklistsSystem: action.payload,
			}

		/* ADD_CHECKLIST_FAVORITE */
		case pending(checklistsTypes.ADD_CHECKLIST_FAVORITE):
			return {
				...state,
				toggleChecklistFavoriteLoading: true,
			}
		case rejected(checklistsTypes.ADD_CHECKLIST_FAVORITE):
			return {
				...state,
				toggleChecklistFavoriteLoading: false,
				toggleChecklistFavoriteError: action.payload,
			}
		case fulfilled(checklistsTypes.ADD_CHECKLIST_FAVORITE):
			return {
				...state,
				toggleChecklistFavoriteLoading: false,
				toggleChecklistFavoriteError: null,
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

		/* ADD_CHECKLIST_CUSTOM */
		case pending(checklistsTypes.ADD_CHECKLIST_CUSTOM):
			return {
				...state,
				addChecklistCustomLoading: true,
			}
		case rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM):
			return {
				...state,
				addChecklistCustomLoading: false,
				addChecklistCustomError: action.payload,
			}
		case fulfilled(checklistsTypes.ADD_CHECKLIST_CUSTOM):
			return {
				...state,
				addChecklistCustomLoading: false,
				addChecklistCustomError: null,
				checklistsCustom: action.payload,
			}

		/* UPDATE_CHECKLIST_CUSTOM */
		case pending(checklistsTypes.UPDATE_CHECKLIST_CUSTOM):
			return {
				...state,
				updateChecklistCustomLoading: true,
			}
		case rejected(checklistsTypes.UPDATE_CHECKLIST_CUSTOM):
			return {
				...state,
				updateChecklistCustomLoading: false,
				updateChecklistCustomError: action.payload,
			}
		case fulfilled(checklistsTypes.UPDATE_CHECKLIST_CUSTOM):
			return {
				...state,
				updateChecklistCustomLoading: false,
				updateChecklistCustomError: null,
				checklistsCustom: action.payload,
			}

		/* DELETE_CHECKLIST_CUSTOM */
		case pending(checklistsTypes.DELETE_CHECKLIST_CUSTOM):
			return {
				...state,
				deleteChecklistCustomLoading: true,
			}
		case rejected(checklistsTypes.DELETE_CHECKLIST_CUSTOM):
			return {
				...state,
				deleteChecklistCustomLoading: false,
				deleteChecklistCustomError: action.payload,
			}
		case fulfilled(checklistsTypes.DELETE_CHECKLIST_CUSTOM):
			return {
				...state,
				deleteChecklistCustomLoading: false,
				deleteChecklistCustomError: null,
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
