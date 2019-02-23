import 'isomorphic-unfetch'
import CryptoJS from 'crypto-js'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'
import { syncDb } from './db'

export const login = password => {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGIN))

		const ClientDB = require('../../db')

		ClientDB.default.store
			.getItem('h')
			.then(hash => {
				if (!hash) return dispatch(rejected(accountTypes.LOGIN, 'Password does not exist'))

				fetch(`${process.env.ROOT}/api/auth/key`)
					.then(res => {
						if (!res.ok) return dispatch(rejected(accountTypes.LOGIN, err))
						return res.text()
					})
					.then(key => {
						const decrypted = CryptoJS.AES.decrypt(hash, key).toString(CryptoJS.enc.Utf8)

						if (password !== decrypted) {
							return dispatch(rejected(accountTypes.LOGIN, 'Password is incorrect'))
						}

						dispatch(fulfilled(accountTypes.LOGIN, password))
						dispatch(syncDb())
					})
					.catch(err => {
						return dispatch(rejected(accountTypes.LOGIN, err))
					})
			})
	}
}

export const logout = () => {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.LOGOUT))

		const ClientDB = require('../../db')

		ClientDB.default.store
			.setItem('h', false)
			.then(() => dispatch(fulfilled(accountTypes.LOGOUT)))
			.catch(err => dispatch(rejected(accountTypes.LOGOUT, err)))
	}
}

export const savePassword = password => {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.SAVE_PASSWORD))

		const ClientDB = require('../../db')

		fetch(`${process.env.ROOT}/api/auth/key`)
			.then(res => {
				if (!res.ok) return dispatch(rejected(accountTypes.SAVE_PASSWORD, res))
				return res.text()
			})
			.then(key => {
				const hash = CryptoJS.AES.encrypt(password, key).toString()

				ClientDB.default.store
					.setItem('h', hash)
					.then(() => dispatch(fulfilled(accountTypes.SAVE_PASSWORD)))
					.catch(err => dispatch(rejected(accountTypes.SAVE_PASSWORD, err)))
			})
			.catch(err => {
				return dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
			})
	}
}