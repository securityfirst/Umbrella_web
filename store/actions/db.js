import merge from 'lodash.merge'
import Crypto from '../../utils/crypto'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, lessonsTypes, viewTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { clearPassword } from './account'
import { clearFeeds } from './feeds'
import { clearForms } from './forms'
import { clearChecklists } from './checklists'
import { clearLessons } from './lessons'
import { clearView, openAlert } from './view'

export const syncDb = () => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.SYNC_DB))

	try {
		const state = getState()

		const ClientDB = require('../../db')
		const Account = require('../../account')

		const isProtected = await ClientDB.default.get('protected')
		const hash = await ClientDB.default.get('h')
		const password = await Account.default.password()

		if (isProtected && (!hash || !password)) {
			return await dispatch(rejected(dbTypes.SYNC_DB, 'DB sync failed to authenticate'))
		}
		
		let feedLocation = await ClientDB.default.get('fe_l', password, true)
		let feedSources = await ClientDB.default.get('fe_s', password, true)
		let rssSources = await ClientDB.default.get('rs_s', password, true)
		let formsSaved = await ClientDB.default.get('fo_s', password, true)
		let checklistsSystem = await ClientDB.default.get('ch_s', password, true)
		let checklistsCustom = await ClientDB.default.get('ch_c', password, true)
		let lessonCardsFavorites = await ClientDB.default.get('le_f', password, true)

		let feedsMerge = {}
		let formsMerge = {}
		let checklistsMerge = {}
		let lessonsMerge = {}

		if (feedLocation) feedsMerge.feedLocation = feedLocation
		if (feedSources) feedsMerge.feedSources = feedSources
		if (rssSources) feedsMerge.rssSources = rssSources

		if (formsSaved) formsMerge.formsSaved = formsSaved

		if (checklistsSystem) checklistsMerge.checklistsSystem = checklistsSystem
		if (checklistsCustom) checklistsMerge.checklistsCustom = checklistsCustom

		if (lessonCardsFavorites) lessonsMerge.lessonCardsFavorites = lessonCardsFavorites

		if (Object.keys(feedsMerge).length) {
			await dispatch({
				type: feedsTypes.SYNC_FEEDS, 
				payload: merge(state.feeds, feedsMerge)
			})
		}

		if (Object.keys(formsMerge).length) {
			await dispatch({
				type: formsTypes.SYNC_FORMS, 
				payload: merge(state.forms, formsMerge)
			})
		}

		if (Object.keys(checklistsMerge).length) {
			await dispatch({
				type: checklistsTypes.SYNC_CHECKLISTS, 
				payload: merge(state.checklists, checklistsMerge)
			})
		}

		if (Object.keys(lessonsMerge).length) {
			await dispatch({
				type: lessonsTypes.SYNC_LESSONS, 
				payload: merge(state.lessons, lessonsMerge)
			})
		}

		return await dispatch(fulfilled(dbTypes.SYNC_DB))
	} catch (e) {
		return await dispatch(rejected(dbTypes.SYNC_DB, e))
	}
}

export const encryptDb = (key, password) => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.ENCRYPT_DB))

	try {
		const state = getState()

		const ClientDB = require('../../db')

		const currentPassword = await ClientDB.default.get('h', key)

		if (currentPassword) {
			return await dispatch(rejected(dbTypes.ENCRYPT_DB, 'DB is already encrypted'))
		}

		let feedLocation = await ClientDB.default.get('fe_l', null, true)
		let feedSources = await ClientDB.default.get('fe_s', null, true)
		let rssSources = await ClientDB.default.get('rs_s', null, true)
		let formsSaved = await ClientDB.default.get('fo_s', null, true)
		let checklistsSystem = await ClientDB.default.get('ch_s', null, true)
		let checklistsCustom = await ClientDB.default.get('ch_c', null, true)
		let lessonCardsFavorites = await ClientDB.default.get('le_f', null, true)

		if (feedLocation) await ClientDB.default.set('fe_l', feedLocation, password)
		if (feedSources) await ClientDB.default.set('fe_s', feedSources, password)
		if (rssSources) await ClientDB.default.set('rs_s', rssSources, password)
		if (formsSaved) await ClientDB.default.set('fo_s', formsSaved, password)
		if (checklistsSystem) await ClientDB.default.set('ch_s', checklistsSystem, password)
		if (checklistsCustom) await ClientDB.default.set('ch_c', checklistsCustom, password)
		if (lessonCardsFavorites) await ClientDB.default.set('le_f', lessonCardsFavorites, password)

		return await dispatch(fulfilled(dbTypes.ENCRYPT_DB))
	} catch (e) {
		return await dispatch(rejected(dbTypes.ENCRYPT_DB, e))
	}
}

export const resetDbEncryption = (key, newPassword) => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.RESET_DB_ENCRYPTION))

	try {
		const state = getState()

		const ClientDB = require('../../db')

		const password = await ClientDB.default.get('h', key)

		if (!password) return await dispatch(rejected(dbTypes.RESET_DB_ENCRYPTION, 'DB failed to reset'))

		let feedLocation = await ClientDB.default.get('fe_l', password, true)
		let feedSources = await ClientDB.default.get('fe_s', password, true)
		let rssSources = await ClientDB.default.get('rs_s', password, true)
		let formsSaved = await ClientDB.default.get('fo_s', password, true)
		let checklistsSystem = await ClientDB.default.get('ch_s', password, true)
		let checklistsCustom = await ClientDB.default.get('ch_c', password, true)
		let lessonCardsFavorites = await ClientDB.default.get('le_f', password, true)

		if (feedLocation) await ClientDB.default.set('fe_l', feedLocation, newPassword)
		if (feedSources) await ClientDB.default.set('fe_s', feedSources, newPassword)
		if (rssSources) await ClientDB.default.set('rs_s', rssSources, newPassword)
		if (formsSaved) await ClientDB.default.set('fo_s', formsSaved, newPassword)
		if (checklistsSystem) await ClientDB.default.set('ch_s', checklistsSystem, newPassword)
		if (checklistsCustom) await ClientDB.default.set('ch_c', checklistsCustom, newPassword)
		if (lessonCardsFavorites) await ClientDB.default.set('le_f', lessonCardsFavorites, newPassword)

		return await dispatch(fulfilled(dbTypes.RESET_DB_ENCRYPTION))
	} catch (e) {
		return await dispatch(rejected(dbTypes.RESET_DB_ENCRYPTION, e))
	}
}

export const clearDb = () => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.CLEAR_DB))

	try {
		const ClientDB = require('../../db')

		await ClientDB.default.clear()

		await dispatch(openAlert('success', 'Database has been cleared'))

		await dispatch(clearPassword())
		await dispatch(clearFeeds())
		await dispatch(clearForms())
		await dispatch(clearChecklists())
		await dispatch(clearLessons())
		await dispatch(clearView())
		
		await dispatch(fulfilled(dbTypes.CLEAR_DB))

		window.location.reload()
	} catch (e) {
		await dispatch(rejected(dbTypes.CLEAR_DB, e))
	}
}
