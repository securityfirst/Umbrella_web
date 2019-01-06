import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

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
			.then(res => dispatch(fulfilled(accountTypes.LOGIN, true)))
			.catch(err => dispatch(rejected(accountTypes.LOGIN, err)));
	}
}

export function logout() {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGOUT));

		fetch('/auth/logout', {
			method: "POST",
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		})
			.then(res => dispatch(fulfilled(accountTypes.LOGOUT, true)))
			.catch(err => dispatch(rejected(accountTypes.LOGOUT, err)));
	}
}