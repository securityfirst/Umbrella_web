import { formsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncStatusGenerator.js';
import initialState from '../initialState.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		/* GET_FORM_TYPES */
		case pending(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				loading: true,
			};
		case rejected(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case fulfilled(formsTypes.GET_FORM_TYPES):
			return {
				...state,
				loading: false,
				error: null,
				formTypes: action.payload,
			};

		/* GET_FORMS */
		case pending(formsTypes.GET_FORMS):
			return {
				...state,
				loading: true,
			};
		case rejected(formsTypes.GET_FORMS):
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case fulfilled(formsTypes.GET_FORMS):
			return {
				...state,
				loading: false,
				error: null,
				forms: action.payload,
			};
	}

	return state;
}
