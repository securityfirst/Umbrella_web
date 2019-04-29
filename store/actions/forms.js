import 'isomorphic-unfetch'
import YAML from 'yaml'
import atob from 'atob'

import { formsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { setAppbarTitle } from './view'

export const getForm = sha => async (dispatch, getState) => {
	dispatch(pending(formsTypes.GET_FORM))

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			const form = YAML.parse(atob(content))
			dispatch(fulfilled(formsTypes.GET_FORM, form))
			dispatch(setAppbarTitle(form.title))
		})
		.catch(err => {
			dispatch(rejected(formsTypes.GET_FORM, err))
		})
}

export const getFormSaved = (id, successCb) => async (dispatch, getState) => {
	dispatch(pending(formsTypes.GET_FORM_SAVED))

	const state = getState()

	// if (!state.account.password) {
	// 	console.log("state.account.password: ", state.account.password);
	// 	return dispatch(rejected(formsTypes.GET_FORM_SAVED, 'Please login to edit your saved form'))
	// }

	try {
		const ClientDB = require('../../db')

		await ClientDB.default
			// .get('fo_s', state.account.password, true)
			.get('fo_s', 'Pass1234', true)
			.then(formsSaved => {
				const form = formsSaved.find(f => f.id === id)
				dispatch(fulfilled(formsTypes.GET_FORM_SAVED, form))
				!!successCb && successCb(form)
			})
			.catch(err => {
				dispatch(rejected(formsTypes.GET_FORM_SAVED, err))
			})
	} catch (e) {
		dispatch(rejected(formsTypes.GET_FORM_SAVED, e))
	}
}

export const saveForm = (form, successCb) => (dispatch, getState) => {
	dispatch(pending(formsTypes.SAVE_FORM))

	const state = getState()

	if (!state.account.password) {
		alert('Please login to save your form')
		return dispatch(rejected(formsTypes.SAVE_FORM, 'Please login to save your form'))
	}

	try {
		const forms = state.forms.formsSaved.concat([form])

		const ClientDB = require('../../db')

		ClientDB.default
			.set('fo_s', forms, state.account.password)
			.then(() => {
				dispatch(fulfilled(formsTypes.SAVE_FORM, forms))
				!!successCb && successCb()
			})
			.catch(err => {
				dispatch(rejected(formsTypes.SAVE_FORM, err))
			})
	} catch (e) {
		console.error('[ACTION] saveForm exception: ', e)
		dispatch(rejected(formsTypes.SAVE_FORM, e))
	}
}

export const updateForm = form => (dispatch, getState) => {
	dispatch(pending(formsTypes.UPDATE_FORM))

	const state = getState()

	if (!state.account.password) {
		alert('Please login to save your form')
		return dispatch(rejected(formsTypes.UPDATE_FORM, 'Please login to save your form'))
	}

	if (!form.dateCreated) {
		alert('Something went wrong. Please refresh the page and try again.')
		return dispatch(rejected(formsTypes.UPDATE_FORM, null))
	}

	try {
		const date = new Date()
		form.dateUpdated = date.valueOf()
		
		const forms = [...state.forms.formsSaved]
		const index = forms.findIndex(item => item.dateCreated === form.dateCreated)
		forms[index] = form

		const ClientDB = require('../../db')

		ClientDB.default
			.set('fo_s', forms)
			.then(hash => dispatch(fulfilled(formsTypes.UPDATE_FORM, forms)))
			.catch(err => dispatch(rejected(formsTypes.UPDATE_FORM, err)))
	} catch (e) {
		console.error('[ACTION] saveForm exception: ', e)
		dispatch(rejected(formsTypes.UPDATE_FORM, e))
	}
}

export const resetSaveForm = () => ({type: formsTypes.RESET_SAVE_FORM})

export const clearForms = () => ({type: formsTypes.CLEAR_FORMS})