import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export const login = (credentials) => {
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
			.then(res => res.json())
			.then(data => dispatch(fulfilled(accountTypes.LOGIN, data)))
			.catch(err => dispatch(rejected(accountTypes.LOGIN, err)));
	}
}

export const logout = () => {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGOUT));

		fetch('/auth/logout', {
			method: "POST",
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		})
			.then(res => res.json())
			.then(data => dispatch(fulfilled(accountTypes.LOGOUT, data)))
			.catch(err => dispatch(rejected(accountTypes.LOGOUT, err)));
	}
}