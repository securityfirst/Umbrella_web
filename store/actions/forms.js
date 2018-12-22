import 'isomorphic-unfetch';

import { formsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../../utils/error.js';

import { formTypes, forms } from '../../mock/forms';

export function getFormTypes() {
	return (dispatch, getState) => {
		dispatch(pending(formsTypes.GET_FORM_TYPES));

		/* TODO: Replace with API */
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => {
				dispatch(fulfilled(formsTypes.GET_FORM_TYPES, formTypes));
			})
			.catch(err => {
				dispatch(rejected(formsTypes.GET_FORM_TYPES, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}

export function getForms() {
	return (dispatch, getState) => {
		dispatch(pending(formsTypes.GET_FORMS));

		/* TODO: Replace with API */
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => {
				dispatch(fulfilled(formsTypes.GET_FORMS, forms));
			})
			.catch(err => {
				dispatch(rejected(formsTypes.GET_FORMS, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}