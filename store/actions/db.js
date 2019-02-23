import merge from 'lodash.merge'
import CryptoJS from 'crypto-js'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

export const syncDb = () => {
	return async (dispatch, getState) => {
		await dispatch(pending(dbTypes.SYNC_DB))

		try {
			const state = getState()

			const ClientDB = require('../../db')

			const enabled = await ClientDB.default.store.getItem('enabled')
			const hash = await ClientDB.default.store.getItem('h')
			const password = state.account.password

			if (!enabled || !hash || !password) return await dispatch(fulfilled(dbTypes.SYNC_DB))

			await ClientDB.default.store.getItem('feeds')
				.then(data => {
					console.log("data: ", data);
					if (data) {
						const feeds = JSON.parse(
							CryptoJS.AES
								.decrypt(data, password)
								.toString(CryptoJS.enc.Utf8)
						)

						dispatch({
							type: feedsTypes.SYNC_FEEDS, 
							payload: merge(state.feeds, feeds)
						})
					}
				})

			await ClientDB.default.store.getItem('forms')
				.then(data => {
					console.log("data: ", data);
					if (data) {
						const forms = JSON.parse(
							CryptoJS.AES
								.decrypt(data, password)
								.toString(CryptoJS.enc.Utf8)
						)

						dispatch({
							type: formsTypes.SYNC_FORMS, 
							payload: merge(state.forms, forms)
						})
					}
				})

			await ClientDB.default.store.getItem('checklists')
				.then(data => {
					console.log("data: ", data);
					if (data) {
						const checklists = JSON.parse(
							CryptoJS.AES
								.decrypt(data, password)
								.toString(CryptoJS.enc.Utf8)
						)
						
						dispatch({
							type: checklistsTypes.SYNC_CHECKLISTS, 
							payload: merge(state.checklists, checklists)
						})
					}
				})

			await dispatch(fulfilled(dbTypes.SYNC_DB))
		} catch (e) {
			dispatch(rejected(dbTypes.SYNC_DB, e))
		}
	}
}
