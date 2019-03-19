import 'isomorphic-unfetch'

import { checklistsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import Crypto from '../../utils/crypto'

import { checklistsSystem, checklistsCustom } from '../../mock/checklists'

export const getChecklistsSystem = checkPassword => async (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_SYSTEM))

	const state = getState()

	if (!state.account.password) {
		if (checkPassword) alert('Login or set a password to create a custom checklist.')
		return dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, {}))
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.get('ch_s', state.account.password, true)
			.then(checklists => {
				dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, checklists || {}))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM, e))
	}
}

export const updateChecklistsSystem = checklists => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM))

	const state = getState()

	if (!state.account.password) {
		return alert('Login or set a password to update lesson checklists.')
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_s', checklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, checklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, e))
	}
}

export const getChecklistsCustom = () => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_CUSTOM))

	const state = getState()

	if (!state.account.password) {
		return alert('Login or set a password to create a custom checklist.')
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.get('ch_c', state.account.password, true)
			.then(checklists => {
				dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_CUSTOM, checklists || []))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, e))
	}
}

export const addChecklistCustom = (name, successCb) => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.ADD_CHECKLIST_CUSTOM))

	const state = getState()

	if (!state.account.password) {
		return alert('Login or set a password to create a custom checklist.')
	}

	if (!name) {
		return alert('A name is required to make a new checklist.')
	}

	try {
		const checklist = {name, items: []}
		const checklists = state.checklists.checklistsCustom.concat([checklist])

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_c', checklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.ADD_CHECKLIST_CUSTOM, checklists))
				!!successCb && successCb()
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, e))
	}
}

export const updateChecklistCustom = (checklist, i) => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.UPDATE_CHECKLIST_CUSTOM))

	const state = getState()

	if (!state.account.password) {
		alert('You must be logged in to update your custom checklist')
		return window.reload()
	}

	try {
		let checklists = [...state.checklists.checklistsCustom]
		checklists[i] = checklist

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_c', checklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, checklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, e))
	}
}

export const deleteChecklistCustom = i => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.DELETE_CHECKLIST_CUSTOM))

	const state = getState()

	if (!state.account.password) {
		alert('You must be logged in to update your custom checklist')
		return window.reload()
	}

	try {
		let checklists = [...state.checklists.checklistsCustom]
		checklists.splice(i, 1)

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_c', checklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.DELETE_CHECKLIST_CUSTOM, checklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_CUSTOM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_CUSTOM, e))
	}
}

export const clearChecklists = () => ({type: checklistsTypes.CLEAR_CHECKLISTS})