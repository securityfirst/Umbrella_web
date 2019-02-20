import 'isomorphic-unfetch'
import YAML from 'yaml'
import atob from 'atob'

import { formsTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { setAppbarTitle } from './view'

export const getForm = sha => {
	return async (dispatch, getState) => {
		dispatch(pending(formsTypes.GET_FORM))

		await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => res.text())
			.then(content => {
				const form = YAML.parse(atob(content))
				dispatch(fulfilled(formsTypes.GET_FORM, form))
				dispatch(setAppbarTitle(form.title))
			})
			.catch(err => dispatch(rejected(formsTypes.GET_FORM, err)))
	}
}

export const postForm = (data) => {
	return (dispatch, getState) => {
		dispatch(pending(formsTypes.POST_FORM))

		try {
			/* TODO: Replace with API */
			/* TODO: Fix extra webpack calls */
			fetch('https://jsonplaceholder.typicode.com/users', {
				method: 'post',
				body: JSON.stringify({test: 1}), 
				headers: {'Content-Type': 'application/json'},
			})
				.then(res => {
					if (!res.ok) {
						console.error('[ACTION] postForm error: ', res)
						return dispatch(rejected(formsTypes.POST_FORM, res))
					}
						
					return res.json()
				})
				.then(data => dispatch(fulfilled(formsTypes.POST_FORM)))
				.catch(err => {
					console.error('[ACTION] postForm error: ', err)
					dispatch(rejected(formsTypes.POST_FORM, err))
				})
		} catch (e) {
			console.error('[ACTION] postForm exception: ', e)
			dispatch(rejected(formsTypes.POST_FORM, e))
		}
	}
}

export const resetPostForm = () => {
	return {type: formsTypes.RESET_POST_FORM}
}