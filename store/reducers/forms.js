import { formsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_FORM_TYPES */
		case pending(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				getFormTypesLoading: true,
			};
		case rejected(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				getFormTypesLoading: false,
				getFormTypesError: action.payload,
			};
		case fulfilled(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				getFormTypesLoading: false,
				getFormTypesError: null,
				formTypes: action.payload,
			};

		/* GET_FORMS */
		case pending(formsTypes.GET_FORMS):
			return {
				...state,
				getFormsLoading: true,
			};
		case rejected(formsTypes.GET_FORMS):
			return {
				...state,
				getFormsLoading: false,
				getFormsError: action.payload,
			};
		case fulfilled(formsTypes.GET_FORMS):
			return {
				...state,
				getFormsLoading: false,
				getFormsError: null,
				forms: action.payload,
			};

		/* POST_FORM */
		case pending(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: true,
			};
		case rejected(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: false,
				postFormError: action.payload,
			};
		case fulfilled(formsTypes.POST_FORM):
			return {
				...state,
				postFormLoading: false,
				postFormError: null,
				postFormSuccess: true,
			};

		/* RESET_POST_FORM */
		case formsTypes.RESET_POST_FORM:
			return {
				...state,
				postFormLoading: false,
				postFormError: null,
				postFormSuccess: false,
			};
	}

	return state;
}
