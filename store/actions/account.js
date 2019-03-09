import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'
import { syncDb } from './db'

export const login = (password, router) => (dispatch, getState) => {
	dispatch(pending(accountTypes.LOGIN))

	const ClientDB = require('../../db')

	fetch(`${process.env.ROOT}/api/auth/key`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(key => {
			ClientDB.default
				.get('h', key)
				.then(async data => {
					if (!data) {
						return dispatch(rejected(accountTypes.LOGIN, 'Password does not exist'))
					}

					if (password !== data) {
						return dispatch(rejected(accountTypes.LOGIN, 'Password is incorrect'))
					}

					await dispatch(fulfilled(accountTypes.LOGIN, password))
					await dispatch(syncDb(password))

					alert('You are now logged in!')
					!!router && router.back()
				})
		})
		.catch(err => {
			return dispatch(rejected(accountTypes.LOGIN, err))
		})
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

export const savePassword = (password, router) => (dispatch, getState) => {
	dispatch(pending(accountTypes.SAVE_PASSWORD))

	const ClientDB = require('../../db')

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
					dispatch(fulfilled(accountTypes.SAVE_PASSWORD, password))
					!!router && router.back()
				})
				.catch(err => dispatch(rejected(accountTypes.SAVE_PASSWORD, err)))
		})
		.catch(err => {
			return dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
		})
}

export const clearPassword = () => ({type: accountTypes.CLEAR_PASSWORD})