import merge from 'lodash.merge'

import { accountTypes, feedsTypes, formsTypes, checklistsTypes, dbTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import ClientDB from '../../db'

export const syncDb = () => {
	return async (dispatch, getState) => {
		await dispatch(pending(dbTypes.SYNC_DB))

		try {
			const state = await getState()
			const clientDB = new ClientDB()

			const db = await clientDB.init()

			const enabled = await db.getItem('enabled')

			if (!enabled) return await dispatch(fulfilled(dbTypes.SYNC_DB))

			await db.getItem('account')
				.then(data => {
					dispatch({
						type: accountTypes.SYNC_ACCOUNT, 
						payload: merge(state.account, data)
					})
				})

			await db.getItem('feeds')
				.then(data => {
					dispatch({
						type: feedsTypes.SYNC_FEEDS, 
						payload: merge(state.feeds, data)
					})
				})

			await db.getItem('forms')
				.then(data => {
					dispatch({
						type: formsTypes.SYNC_FORMS, 
						payload: merge(state.forms, data)
					})
				})

			await db.getItem('checklists')
				.then(data => {
					dispatch({
						type: checklistsTypes.SYNC_CHECKLISTS, 
						payload: merge(state.checklists, data)
					})
				})

			await dispatch(fulfilled(dbTypes.SYNC_DB))
		} catch (e) {
			dispatch(rejected(dbTypes.SYNC_DB, e))
		}
	}
}
