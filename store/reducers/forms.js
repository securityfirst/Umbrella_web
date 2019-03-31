import { formsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js'
import initialState from '../initialState.js'

export default function reducer(state = initialState, action) {
	switch (action.type) {

		/* GET_FORM */
		case pending(formsTypes.GET_FORM):
			return {
				...state,
				getFormLoading: true,
			}
		case rejected(formsTypes.GET_FORM):
			return {
				...state,
				getFormLoading: false,
				getFormError: action.payload,
			}
		case fulfilled(formsTypes.GET_FORM):
			return {
				...state,
				getFormLoading: false,
				getFormError: null,
				form: action.payload,
			}

		/* SAVE_FORM */
		case pending(formsTypes.SAVE_FORM):
			return {
				...state,
				saveFormLoading: true,
			}
		case rejected(formsTypes.SAVE_FORM):
			return {
				...state,
				saveFormLoading: false,
				saveFormError: action.payload,
			}
		case fulfilled(formsTypes.SAVE_FORM):
			return {
				...state,
				saveFormLoading: false,
				saveFormError: null,
				saveFormSuccess: true,
				formsSaved: action.payload,
			}

		/* UPDATE_FORM */
		case pending(formsTypes.UPDATE_FORM):
			return {
				...state,
				updateFormLoading: true,
			}
		case rejected(formsTypes.UPDATE_FORM):
			return {
				...state,
				updateFormLoading: false,
				updateFormError: action.payload,
			}
		case fulfilled(formsTypes.UPDATE_FORM):
			return {
				...state,
				updateFormLoading: false,
				updateFormError: null,
				updateFormSuccess: true,
				formsSaved: action.payload,
			}

		/* RESET_SAVE_FORM */
		case formsTypes.RESET_SAVE_FORM:
			return {
				...state,
				saveFormLoading: false,
				saveFormError: null,
				saveFormSuccess: false,
			}

		/* SYNC_FORMS */
		case formsTypes.SYNC_FORMS: return action.payload

		/* CLEAR_FORMS */
		case formsTypes.CLEAR_FORMS:
			return {
				...state,
				...initialState.forms,
			}
	}

	return state
}
