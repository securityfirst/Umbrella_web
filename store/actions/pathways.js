import 'isomorphic-unfetch'

import { pathwaysTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { openAlert } from './view'

export const getPathwaysSaved = () => async (dispatch, getState) => {
	dispatch(pending(pathwaysTypes.GET_PATHWAYS_SAVED))

	const state = getState()

	if (state.account.isProtected && !state.account.password) {
		return dispatch(fulfilled(pathwaysTypes.GET_PATHWAYS_SAVED, {}))
	}

	try {
		const ClientDB = require('../../db')

		await ClientDB.default
			.get('pa_s', state.account.password, true)
			.then(pathwaysSaved => {
				dispatch(fulfilled(pathwaysTypes.GET_PATHWAYS_SAVED, pathwaysSaved || {}))
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(pathwaysTypes.GET_PATHWAYS_SAVED, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(pathwaysTypes.GET_PATHWAYS_SAVED, e))
	}
}

export const updatePathwaysSaved = pathway => (dispatch, getState) => {
	dispatch(pending(pathwaysTypes.UPDATE_PATHWAYS_SAVED))

	const state = getState()

	if (state.account.isProtected && !state.account.password) {
		const message = 'Login to update your saved pathways'
		dispatch(openAlert('error', message))
		return dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, message))
	}

	try {
		const savedPathway = state.pathways.pathwaysSaved.find(p => p.name === pathway.name)

		let newPathwaysSaved = [...state.pathways.pathwaysSaved]

		if (!savedPathway) newPathwaysSaved.push(pathway)
		else newPathwaysSaved = newPathwaysSaved.filter(p => p.name !== pathway.name)

		const ClientDB = require('../../db')

		ClientDB.default
			.set('pa_s', newPathwaysSaved, state.account.password)
			.then(() => {
				dispatch(openAlert('success', 'Updated saved pathways'))
				dispatch(fulfilled(pathwaysTypes.UPDATE_PATHWAYS_SAVED, newPathwaysSaved))
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, e))
	}
}

export const clearPathways = () => ({type: pathwaysTypes.CLEAR_CHECKLISTS})