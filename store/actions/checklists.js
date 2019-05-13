import 'isomorphic-unfetch'

import { checklistsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { openAlert } from './view'

import Crypto from '../../utils/crypto'

export const getChecklistsSystem = () => async (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_SYSTEM))

	const state = getState()

	if (!state.account.password) {
		return dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, {}))
	}

	try {
		const ClientDB = require('../../db')

		await ClientDB.default
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

export const updateChecklistsSystem = (itemName, category, level) => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM))

	const state = getState()

	if (!state.account.password) {
		return dispatch(openAlert('warning', 'Login or set a password to update lesson checklists.'))
	}

	try {
		const listKey = `${category} > ${level}`
		const savedChecklist = state.checklists.checklistsSystem[listKey]

		let newChecklists = {...state.checklists.checklistsSystem}

		if (!savedChecklist) newChecklists[listKey] = {isFavorited: false, items: [itemName]}
		else {
			if (newChecklists[listKey].items.includes(itemName)) {
				newChecklists[listKey].items = newChecklists[listKey].items.filter(item => item !== itemName)
			} else {
				newChecklists[listKey].items.push(itemName)
			}
		}

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_s', newChecklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, newChecklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, e))
	}
}

export const deleteChecklistSystem = listKey => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.DELETE_CHECKLIST_SYSTEM))

	const state = getState()

	if (!state.account.password) {
		return dispatch(openAlert('warning', 'Login or set a password to delete lesson checklists.'))
	}

	try {
		let newChecklists = {...state.checklists.checklistsSystem}
		delete newChecklists[listKey]

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_s', newChecklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.DELETE_CHECKLIST_SYSTEM, newChecklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_SYSTEM, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_SYSTEM, e))
	}
}

export const getChecklistsCustom = () => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.GET_CHECKLISTS_CUSTOM))

	const state = getState()

	if (!state.account.password) {
		return dispatch(openAlert('warning', 'Login or set a password to create a custom checklist.'))
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
		return dispatch(openAlert('warning', 'Login or set a password to create a custom checklist.'))
	}

	if (!name) {
		return dispatch(openAlert('warning', 'A name is required to make a new checklist.'))
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
		dispatch(openAlert('warning', 'You must be logged in to update your custom checklist'))
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
		dispatch(openAlert('warning', 'You must be logged in to update your custom checklist'))
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

export const toggleChecklistFavorite = (category, level) => (dispatch, getState) => {
	dispatch(pending(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE))

	const state = getState()

	if (!state.account.password) {
		return dispatch(openAlert('warning', 'You must be logged in to save your favorite checklists'))
	}

	try {
		const listKey = `${category} > ${level}`
		const savedChecklist = state.checklists.checklistsSystem[listKey]

		let newChecklists = {...state.checklists.checklistsSystem}

		if (!savedChecklist) newChecklists[listKey] = {isFavorited: true, items: []}
		else newChecklists[listKey].isFavorited = !newChecklists[listKey].isFavorited

		const ClientDB = require('../../db')

		ClientDB.default
			.set('ch_s', newChecklists, state.account.password)
			.then(() => {
				dispatch(fulfilled(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, newChecklists))
			})
			.catch(err => {
				dispatch(rejected(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, err))
			})
	} catch (e) {
		dispatch(rejected(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, e))
	}
}

export const clearChecklists = () => ({type: checklistsTypes.CLEAR_CHECKLISTS})