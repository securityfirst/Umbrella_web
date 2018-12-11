import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../utils/error.js';

export function login(credentials) {
	const {LOGIN} = accountTypes;

	return (dispatch, getState) => {
		dispatch(pending(LOGIN));

		fetch('/auth/account', {
			method: "POST",
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(credentials), // body data type must match "Content-Type" header
		})
			.then(res => {
				dispatch(fulfilled(LOGIN, true));
			})
			.catch(err => {
				dispatch(rejected(LOGIN, formatError(err)));
				if (err.response.status === 401) dispatch(logout());
			});
	}
}

export function logout() {
	const {LOGOUT} = accountTypes;

	return (dispatch, getState) => {
		dispatch(pending(LOGOUT));

		axios.post('/auth/logout')
			.then(res => {

			})
			.catch(err => {
				dispatch(rejected(LOGOUT, formatError(err)));
			})
	}
}