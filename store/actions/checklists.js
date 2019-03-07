import 'isomorphic-unfetch'

import { checklistsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { checklistsSystem, checklistsCustom } from '../../mock/checklists'

export const getChecklistsSystem = () => async (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_SYSTEM))

	/* TODO: Replace with API */
	await fetch('https://jsonplaceholder.typicode.com/users')
		.then(res => {
			if (!res.ok) throw res
			return res.json()
		})
		.then(data => {
			dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, checklistsSystem))
		})
		.catch(err => {
			dispatch(rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM, err))
		})
}

export const getChecklistsCustom = () => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_CUSTOM))

	/* TODO: Replace with API */
	fetch('https://jsonplaceholder.typicode.com/users')
		.then(res => {
			if (!res.ok) throw res
			return res.json()
		})
		.then(data => {
			dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_CUSTOM, checklistsCustom))
		})
		.catch(err => {
			dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, err))
		})
}

export const clearChecklists = () => ({type: checklistsTypes.CLEAR_CHECKLISTS})