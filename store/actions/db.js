import merge from 'lodash.merge'
import CryptoJS from 'crypto-js'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

export const initDb = () => {
	const clientDB = require('../../db')
	console.log("clientDb: ", clientDb);
	clientDb.init()
}

export const syncDb = () => {
	return async (dispatch, getState) => {
		await dispatch(pending(dbTypes.SYNC_DB))

		try {
			const state = await getState()

			const clientDB = require('../../db')

			const enabled = await clientDB.getItem('enabled')
			const hash = await clientDB.getItem('h')
			const password = state.account.password

			if (!enabled || !hash || !password) return await dispatch(fulfilled(dbTypes.SYNC_DB))

			await clientDB.getItem('feeds')
				.then(data => {
					dispatch({
						type: feedsTypes.SYNC_FEEDS, 
						payload: merge(state.feeds, CryptoJS.AES.decrypt(data, password))
					})
				})

			await clientDB.getItem('forms')
				.then(data => {
					dispatch({
						type: formsTypes.SYNC_FORMS, 
						payload: merge(state.forms, CryptoJS.AES.decrypt(data, password))
					})
				})

			await clientDB.getItem('checklists')
				.then(data => {
					dispatch({
						type: checklistsTypes.SYNC_CHECKLISTS, 
						payload: merge(state.checklists, CryptoJS.AES.decrypt(data, password))
					})
				})

			await dispatch(fulfilled(dbTypes.SYNC_DB))
		} catch (e) {
			dispatch(rejected(dbTypes.SYNC_DB, e))
		}
	}
}
