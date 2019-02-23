import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'
import { syncDb } from './db'
import Crypto from '../../utils/crypto'

export const login = (password, router) => {
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
					.then(async key => {
						const crypto = new Crypto(key)
						const decrypted = crypto.decrypt(hash)

						if (password !== decrypted) {
							return dispatch(rejected(accountTypes.LOGIN, 'Password is incorrect'))
						}

						await dispatch(fulfilled(accountTypes.LOGIN, password))

						alert("You are now logged in!")
						await dispatch(syncDb(password))
						!!router && router.back()
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

export const savePassword = (password, router) => {
	return (dispatch, getState) => {
		dispatch(pending(accountTypes.SAVE_PASSWORD))

		const ClientDB = require('../../db')

		fetch(`${process.env.ROOT}/api/auth/key`)
			.then(res => {
				if (!res.ok) return dispatch(rejected(accountTypes.SAVE_PASSWORD, res))
				return res.text()
			})
			.then(key => {
				const crypto = new Crypto(key)
				const hash = crypto.encrypt(password)

				ClientDB.default.store.setItem('enabled', true)

				ClientDB.default.store
					.setItem('h', hash)
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
}