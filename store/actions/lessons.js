import 'isomorphic-unfetch'

import { lessonsTypes, viewTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { openAlert } from './view'

export const getLessonChecklist = sha => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_CHECKLIST))

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			dispatch(fulfilled(lessonsTypes.GET_LESSON_CHECKLIST, content))
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			dispatch(rejected(lessonsTypes.GET_LESSON_CHECKLIST, err))
		})
}

export const unsetLessonChecklist = () => ({type: lessonsTypes.UNSET_LESSON_CHECKLIST})

export const getLessonFile = sha => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_FILE))

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			dispatch(fulfilled(lessonsTypes.GET_LESSON_FILE, content))
		})
		.catch(err => {
			dispatch(openAlert('error', 'Something went wrong'))
			dispatch(rejected(lessonsTypes.GET_LESSON_FILE, err))
		})
}

export const getLessonCardsFavorites = () => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_CARDS_FAVORITES))

	const state = getState()

	if (!state.account.password) {
		return dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS_FAVORITES, []))
	}

	try {
		const ClientDB = require('../../db')

		await ClientDB.default
			.get('le_f', state.account.password, true)
			.then(async lessons => {
				await dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS_FAVORITES, lessons || []))
			})
			.catch(async err => {
				dispatch(openAlert('error', 'Something went wrong'))
				await dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		await dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, e))
	}
}

export const addLessonCardFavorite = (file, level) => (dispatch, getState) => {
	dispatch(pending(lessonsTypes.ADD_LESSON_CARD_FAVORITE))

	const state = getState()

	if (!state.account.password) {
		const message = 'You need to login to save favorite lessons'
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	if (!file) {
		const message = 'Something went wrong'
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	if (state.lessons.lessonCardsFavorites.find(item => item.name === file.name)) {
		const message = 'This lesson already exists in your Favorites list'
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	const favorites = state.lessons.lessonCardsFavorites.concat([{...file, level}])

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('le_f', favorites, state.account.password)
			.then(() => {
				dispatch(openAlert('success', 'Lesson added to favorites'))
				return dispatch(fulfilled(lessonsTypes.ADD_LESSON_CARD_FAVORITE, favorites))
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, e))
	}
}

export const removeLessonCardFavorite = file => (dispatch, getState) => {
	dispatch(pending(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE))

	const state = getState()

	if (!state.account.password) {
		const message = 'Please login to save favorite lessons'
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	if (!file) {
		const message = 'Something went wrong.'
		dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	if (!state.lessons.lessonCardsFavorites.find(item => item.name === file.name)) {
		const message = 'This lesson does not exist in your favorites list'
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	const favorites = state.lessons.lessonCardsFavorites.filter(item => item.name !== file.name)

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('le_f', favorites, state.account.password)
			.then(() => {
				dispatch(openAlert('success', 'Lesson removed from favorites'))
				return dispatch(fulfilled(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, favorites))
			})
			.catch(err => {
				dispatch(openAlert('error', 'Something went wrong'))
				dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', 'Something went wrong'))
		dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, e))
	}
}

export const clearLessons = () => ({type: lessonsTypes.CLEAR_LESSONS})