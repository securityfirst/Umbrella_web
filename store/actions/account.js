import 'isomorphic-unfetch'
import Router from 'next/router'

import { accountTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { encryptDb, clearDb, resetDbEncryption } from './db'
import { openAlert, setLocale } from './view'

export const login = (password, cb) => (dispatch, getState) => {
	dispatch(pending(accountTypes.LOGIN))
	
	const state = getState()
	const { locale, systemLocaleMap } = state.view

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
					return dispatch(rejected(accountTypes.LOGIN, systemLocaleMap[locale].password_not_exist))
				}

				// if given password doesn't match decrypted password
				if (password !== data) {
					return dispatch(rejected(accountTypes.LOGIN, systemLocaleMap[locale].password_incorrect))
				}

				// Success and sync database to store
				Account.default.login(password, async () => {
					await dispatch(fulfilled(accountTypes.LOGIN, password))

					!!cb && cb()
				})
			})
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			return dispatch(rejected(accountTypes.LOGIN, err))
		})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(accountTypes.LOGIN, e))
	}
}

export const checkProtected = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.CHECK_PROTECTED))

	const state = getState()
	const { locale, systemLocaleMap } = state.view
	
	try {
		const ClientDB = require('../../db')

		ClientDB.default
		.get('protected')
		.then(isProtected => {
			dispatch(fulfilled(accountTypes.CHECK_PROTECTED, !!isProtected))
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(accountTypes.CHECK_PROTECTED, err))
		})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(accountTypes.CHECK_PROTECTED, e))
	}
}

export const checkPassword = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.CHECK_PASSWORD))
	
	const state = getState()
	const { locale, systemLocaleMap } = state.view

	try {
		const ClientDB = require('../../db')

		ClientDB.default
		.get('h')
		.then(hash => {
			dispatch(fulfilled(accountTypes.CHECK_PASSWORD, !!hash))
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(accountTypes.CHECK_PASSWORD, err))
		})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(accountTypes.CHECK_PASSWORD, e))
	}
}

export const savePassword = (password, cb) => (dispatch, getState) => {
	dispatch(pending(accountTypes.SAVE_PASSWORD))
	
	const state = getState()
	const { locale, systemLocaleMap } = state.view

	try {
		const ClientDB = require('../../db')
		const Account = require('../../account')

		fetch(`${process.env.ROOT}/api/auth/key`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(async key => {
			// First encrypt DB
			await dispatch(encryptDb(key, password))

			ClientDB.default.set('protected', true)

			ClientDB.default
			.set('h', password, key)
			.then(() => {
				dispatch(openAlert('success', systemLocaleMap[locale].password_success))

				Account.default.login(password)

				dispatch(fulfilled(accountTypes.SAVE_PASSWORD, password))
				
				!!cb && cb()
			})
			.catch(err => {
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
			})
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(accountTypes.SAVE_PASSWORD, err))
		})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(accountTypes.SAVE_PASSWORD, e))
	}
}

export const resetPassword = (newPassword, oldPassword, cb) => async (dispatch, getState) => {
	dispatch(pending(accountTypes.RESET_PASSWORD))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	if (!oldPassword) {
		if (!confirm(systemLocaleMap[locale].reset_password_text)) {
			return dispatch(rejected(accountTypes.RESET_PASSWORD, 'Action cancelled'))
		}

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
					const message = systemLocaleMap[locale].confirm_password_error_message
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

					dispatch(openAlert('success', systemLocaleMap[locale].password_changed))

					dispatch(fulfilled(accountTypes.RESET_PASSWORD, newPassword))
					
					!!cb && cb()
				})
				.catch(err => {
					dispatch(openAlert('error', systemLocaleMap[locale].general_error))
					dispatch(rejected(accountTypes.RESET_PASSWORD, err))
				})
			})
			.catch(err => {
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				dispatch(rejected(accountTypes.RESET_PASSWORD, err))
			})
		} catch (e) {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(accountTypes.RESET_PASSWORD))
		}
	}
}

export const unsetPassword = () => async (dispatch, getState) => {
	dispatch(pending(accountTypes.UNSET_PASSWORD))

	const state = getState()
	const { passwordExists, isProtected } = state.account
	const { locale, systemLocaleMap } = state.view

	try {
		const Account  = require('../../account')

		if (!isProtected) return dispatch(fulfilled(accountTypes.UNSET_PASSWORD))

		if (!confirm(systemLocaleMap[locale].reset_password_text)) {
			return dispatch(rejected(accountTypes.UNSET_PASSWORD, 'Action cancelled'))
		}

		await dispatch(clearDb())
		await dispatch(setLocale(locale))
		await dispatch(checkPassword())

		// logout
		await Account.default.logout()
		await dispatch(openAlert('success', systemLocaleMap[locale].password_unset_success))

		setTimeout(() => window.location.reload(), 1000)
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(accountTypes.UNSET_PASSWORD))
	}
}

export const clearPassword = () => ({type: accountTypes.CLEAR_PASSWORD})