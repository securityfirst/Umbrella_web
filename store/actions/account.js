import axios from 'axios';;

import { accountTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formatError } from '../utils/error.js';

export function login(credentials) {
	const {LOGIN} = accountTypes;

	return (dispatch, getState) => {
		dispatch(pending(LOGIN));

		axios.post('/auth/account', credentials)
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