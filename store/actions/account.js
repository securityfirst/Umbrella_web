import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'
import { syncDb } from './db'

export const login = (password, cb) => (dispatch, getState) => {
	dispatch(pending(accountTypes.LOGIN))

	try {
		const ClientDB = require('../../db')
		const Account = require('../../account')

		// Get server key
		fetch(`${process.env.ROOT}/api/auth/key`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(key => {
				ClientDB.default
					// get encrypted password
					.get('h', key)
					.then(async data => {
						if (!data) {
							return dispatch(rejected(accountTypes.LOGIN, 'Password does not exist'))
						}

						// if given password doesn't match decrypted password
						if (password !== data) {
							return dispatch(rejected(accountTypes.LOGIN, 'Password is incorrect'))
						}

						// Success and sync database to store
						Account.default.login(password, async () => {
							await dispatch(fulfilled(accountTypes.LOGIN, password))
							await dispatch(syncDb())

							!!cb && cb()
						})
					})
			})
			.catch(err => {
				return dispatch(rejected(accountTypes.LOGIN, err))
			})
	} catch (e) {
		dispatch(rejected(accountTypes.LOGIN, e))
	}
}

export const checkPassword = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.CHECK_PASSWORD))

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.get('h')
			.then(hash => dispatch(fulfilled(accountTypes.CHECK_PASSWORD, !!hash)))
			.catch(err => dispatch(rejected(accountTypes.CHECK_PASSWORD, err)))
	} catch (e) {
		dispatch(rejected(accountTypes.CHECK_PASSWORD, e))
	}
}

export const savePassword = (password, cb) => (dispatch, getState) => {
	dispatch(pending(accountTypes.SAVE_PASSWORD))

	const ClientDB = require('../../db')
	const Account = require('../../account')

	fetch(`${process.env.ROOT}/api/auth/key`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(key => {
			ClientDB.default.set('enabled', true)

			ClientDB.default
				.set('h', password, key)
				.then(() => {
					Account.default.login(password)
					dispatch(fulfilled(accountTypes.SAVE_PASSWORD, password))
					!!cb && cb()
				})
				.catch(err => dispatch(rejected(accountTypes.SAVE_PASSWORD, err)))
		})
		.catch(err => {
			return dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
		})
}

export const clearPassword = () => ({type: accountTypes.CLEAR_PASSWORD})