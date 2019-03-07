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

		/* POST_FORM */
		case pending(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: true,
			}
		case rejected(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: false,
				postFormError: action.payload,
			}
		case fulfilled(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: false,
				postFormError: null,
				postFormSuccess: true,
			}

		/* RESET_POST_FORM */
		case formsTypes.RESET_POST_FORM:
			return {
				...state,
				postFormLoading: false,
				postFormError: null,
				postFormSuccess: false,
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
