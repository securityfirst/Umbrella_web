import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { syncDb, clearDb, resetDbEncryption } from './db'
import { openAlert, setLocale } from './view'

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
					await dispatch(checkPassword())
					await dispatch(syncDb())

					!!cb && cb()
				})
			})
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			return dispatch(rejected(accountTypes.LOGIN, err))
		})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(accountTypes.LOGIN, e))
	}
}

export const checkProtected = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.CHECK_PROTECTED))

	try {
		const ClientDB = require('../../db')

		ClientDB.default
		.get('protected')
		.then(isProtected => {
			dispatch(fulfilled(accountTypes.CHECK_PROTECTED, !!isProtected))
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			dispatch(rejected(accountTypes.CHECK_PROTECTED, err))
		})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(accountTypes.CHECK_PROTECTED, e))
	}
}

export const checkPassword = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.CHECK_PASSWORD))

	try {
		const ClientDB = require('../../db')

		ClientDB.default
		.get('h')
		.then(hash => {
			dispatch(fulfilled(accountTypes.CHECK_PASSWORD, !!hash))
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			dispatch(rejected(accountTypes.CHECK_PASSWORD, err))
		})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
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
		ClientDB.default.set('protected', true)

		ClientDB.default
		.set('h', password, key)
		.then(() => {
			dispatch(openAlert('success', 'Password saved'))

			Account.default.login(password)

			dispatch(fulfilled(accountTypes.SAVE_PASSWORD, password))
			
			!!cb && cb()
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
		})
	})
	.catch(err => {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
	})
}

export const resetPassword = (newPassword, oldPassword, cb) => async (dispatch, getState) => {
	dispatch(pending(accountTypes.RESET_PASSWORD))

	if (!oldPassword) {
		if (!confirm('Are you sure you want to reset your password? All saved data will be lost.')) return

		try {
			const state = getState()
			const { locale } = state.view

			await dispatch(clearDb())
			await dispatch(setLocale(locale))
			await dispatch(savePassword(newPassword))
			await dispatch(checkPassword())
			return dispatch(fulfilled(accountTypes.RESET_PASSWORD, newPassword))
		} catch (e) {
			return dispatch(rejected(accountTypes.RESET_PASSWORD, e))
		}
	} else {
		try {
			const ClientDB = require('../../db')
			const Account  = require('../../account')

			fetch(`${process.env.ROOT}/api/auth/key`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(async key => {
				const password = await ClientDB.default.get('h', key)

				if (password !== oldPassword) {
					const message = 'Old password is incorrect - please try again'
					dispatch(openAlert('error', message))
					return dispatch(rejected(accountTypes.RESET_PASSWORD, message))
				}

				// reset db
				await dispatch(resetDbEncryption(key, newPassword))

				// reset password
				ClientDB.default
				.set('h', newPassword, key)
				.then(async () => {
					// logout
					await Account.default.logout()

					// login with new password
					await Account.default.login(newPassword)

					dispatch(openAlert('sucess', 'Password reset'))

					dispatch(fulfilled(accountTypes.RESET_PASSWORD, newPassword))
					
					!!cb && cb()
				})
				.catch(err => {
					dispatch(openAlert('error', 'Something went wrong'))
					dispatch(rejected(accountTypes.RESET_PASSWORD, err))
				})
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(accountTypes.RESET_PASSWORD, err))
			})
		} catch (e) {
			dispatch(rejected(accountTypes.RESET_PASSWORD))
		}
	}
}

export const clearPassword = () => ({type: accountTypes.CLEAR_PASSWORD})