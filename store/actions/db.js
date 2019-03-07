import merge from 'lodash.merge'
import Crypto from '../../utils/crypto'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { clearPassword } from './account'
import { clearFeeds } from './feeds'
import { clearForms } from './forms'
import { clearChecklists } from './checklists'

export const syncDb = password => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.SYNC_DB))

	try {
		const state = getState()

		const ClientDB = require('../../db')

		const enabled = await ClientDB.default.get('enabled')
		const hash = await ClientDB.default.get('h')

		if (!enabled || !hash || !password) return await dispatch(fulfilled(dbTypes.SYNC_DB))

		try {
			let feedLocation = await ClientDB.default.get('fe_l')
			let feedSources = await ClientDB.default.get('fe_s')
			let rssSources = await ClientDB.default.get('rs_s')
			let formsSubmitted = await ClientDB.default.get('fo_s')
			let formsActive = await ClientDB.default.get('fo_a')
			let checklistsSystem = await ClientDB.default.get('ch_s')
			let checklistsCustom = await ClientDB.default.get('ch_c')

			const crypto = new Crypto(password)

			let feedsMerge = {}
			let formsMerge = {}
			let checklistsMerge = {}

			if (feedLocation) feedsMerge.feedLocation = crypto.decrypt(feedLocation, password)
			if (feedSources) feedsMerge.feedSources = crypto.decrypt(feedSources, password)
			if (rssSources) feedsMerge.rssSources = crypto.decrypt(rssSources, password)
			if (formsSubmitted) formsMerge.formsSubmitted = crypto.decrypt(formsSubmitted, password)
			if (formsActive) formsMerge.formsActive = crypto.decrypt(formsActive, password)
			if (checklistsSystem) checklistsMerge.checklistsSystem = crypto.decrypt(checklistsSystem, password)
			if (checklistsCustom) checklistsMerge.checklistsCustom = crypto.decrypt(checklistsCustom, password)

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
					payload: merge(state.forms, checklistsMerge)
				})
			}

			return await dispatch(fulfilled(dbTypes.SYNC_DB))
		} catch (e) {
			return await dispatch(rejected(dbTypes.SYNC_DB, e))
		}
	} catch (e) {
		return await dispatch(rejected(dbTypes.SYNC_DB, e))
	}
}

export const clearDb = () => async (dispatch, getState) => {
	await dispatch(pending(dbTypes.CLEAR_DB))

	try {
		const ClientDB = require('../../db')

		await ClientDB.default.clear()

		alert('Database has been cleared.')

		await dispatch(clearPassword())
		await dispatch(clearFeeds())
		await dispatch(clearForms())
		await dispatch(clearChecklists())
		await dispatch(fulfilled(dbTypes.CLEAR_DB))
	} catch (e) {
		await dispatch(rejected(dbTypes.CLEAR_DB, e))
	}
}