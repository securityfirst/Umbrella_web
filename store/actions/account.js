import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'
import { syncDb } from './db'
import Crypto from '../../utils/crypto'

export const login = (password, router) => (dispatch, getState) => {
	dispatch(pending(accountTypes.LOGIN))

	const ClientDB = require('../../db')

	ClientDB.default
		.get('h')
		.then(hash => {
			if (!hash) return dispatch(rejected(accountTypes.LOGIN, 'Password does not exist'))

			fetch(`${process.env.ROOT}/api/auth/key`)
				.then(res => {
					if (!res.ok) throw res
					return res.text()
				})
				.then(async key => {
					const crypto = new Crypto(key)
					const decrypted = crypto.decrypt(hash)

					if (password !== decrypted) {
						return dispatch(rejected(accountTypes.LOGIN, 'Password is incorrect'))
					}

					await dispatch(fulfilled(accountTypes.LOGIN, password))

					alert('You are now logged in!')
					await dispatch(syncDb(password))
					!!router && router.back()
				})
				.catch(err => {
					return dispatch(rejected(accountTypes.LOGIN, err))
				})
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
			const crypto = new Crypto(key)
			const hash = crypto.encrypt(password)

			ClientDB.default.set('enabled', true)

			ClientDB.default
				.set('h', hash)
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