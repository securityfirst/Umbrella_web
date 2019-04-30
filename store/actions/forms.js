import 'isomorphic-unfetch'
import YAML from 'yaml'
import atob from 'atob'

import { formsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { setAppbarTitle } from './view'

import { decodeBlob } from '../../utils/github'

export const getForm = sha => async (dispatch, getState) => {
	dispatch(pending(formsTypes.GET_FORM))

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			const form = YAML.parse(decodeBlob(content))
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

	if (!state.account.password) {
		return dispatch(rejected(formsTypes.GET_FORM_SAVED, 'Please login to edit your saved form'))
	}

	try {
		const ClientDB = require('../../db')

		await ClientDB.default
			.get('fo_s', state.account.password, true)
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
		let formIndex = state.forms.formsSaved.findIndex(f => f.id === form.id)
		let forms = [...state.forms.formsSaved]

		if (formIndex === -1) forms.push(form)
		else forms[formIndex] = form

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

export const resetSaveForm = () => ({type: formsTypes.RESET_SAVE_FORM})

export const clearForms = () => ({type: formsTypes.CLEAR_FORMS})