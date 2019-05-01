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

		/* GET_FORM_SAVED */
		case pending(formsTypes.GET_FORM_SAVED):
			return {
				...state,
				getFormSavedLoading: true,
			}
		case rejected(formsTypes.GET_FORM_SAVED):
			return {
				...state,
				getFormSavedLoading: false,
				getFormSavedError: action.payload,
			}
		case fulfilled(formsTypes.GET_FORM_SAVED):
			return {
				...state,
				getFormSavedLoading: false,
				getFormSavedError: null,
				formSaved: action.payload,
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

		/* DELETE_FORM */
		case pending(formsTypes.DELETE_FORM):
			return {
				...state,
				deleteFormLoading: true,
				deleteFormError: null,
			}
		case rejected(formsTypes.DELETE_FORM):
			return {
				...state,
				deleteFormLoading: false,
				deleteFormError: action.payload,
			}
		case fulfilled(formsTypes.DELETE_FORM):
			return {
				...state,
				deleteFormLoading: false,
				deleteFormError: null,
				deleteFormSuccess: true,
				formsSaved: action.payload,
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
