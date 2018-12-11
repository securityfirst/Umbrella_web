import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../../utils/error.js';

export function login(credentials) {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGIN));

		fetch('/auth/account', {
			method: "POST",
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(credentials), // body data type must match "Content-Type" header
		})
			.then(res => {
				dispatch(fulfilled(accountTypes.LOGIN, true));
			})
			.catch(err => {
				dispatch(rejected(accountTypes.LOGIN, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}

export function logout() {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGOUT));

		axios.post('/auth/logout')
			.then(res => {

			})
			.catch(err => {
				dispatch(rejected(accountTypes.LOGOUT, formatError(err)));
			})
	}
}