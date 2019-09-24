import 'isomorphic-unfetch'

import { lessonsTypes, viewTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

import { openAlert } from './view'

export const getLessonFile = sha => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_FILE))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			dispatch(fulfilled(lessonsTypes.GET_LESSON_FILE, content))
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(lessonsTypes.GET_LESSON_FILE, err))
		})
}

export const getLessonCardsFavorites = () => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_CARDS_FAVORITES))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	if (state.account.isProtected && !state.account.password) {
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
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				await dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, err))
			})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		await dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, e))
	}
}

export const addLessonCardFavorite = (file, category, level) => (dispatch, getState) => {
	dispatch(pending(lessonsTypes.ADD_LESSON_CARD_FAVORITE))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	if (state.account.isProtected && !state.account.password) {
		const message = systemLocaleMap[locale].login_your_password
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	if (!file) {
		const message = systemLocaleMap[locale].general_error
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	if (state.lessons.lessonCardsFavorites.find(item => item.name === file.name)) {
		const message = systemLocaleMap[locale].lesson_favorite_exists
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, message))
	}

	const favorites = state.lessons.lessonCardsFavorites.concat([{...file, category, level}])

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('le_f', favorites, state.account.password)
			.then(() => {
				dispatch(openAlert('success', systemLocaleMap[locale].lesson_favorite_added))
				return dispatch(fulfilled(lessonsTypes.ADD_LESSON_CARD_FAVORITE, favorites))
			})
			.catch(err => {
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(lessonsTypes.ADD_LESSON_CARD_FAVORITE, e))
	}
}

export const removeLessonCardFavorite = file => (dispatch, getState) => {
	dispatch(pending(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	if (state.account.isProtected && !state.account.password) {
		const message = systemLocaleMap[locale].login_your_password
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	if (!file) {
		const message = systemLocaleMap[locale].general_error
		dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	if (!state.lessons.lessonCardsFavorites.find(item => item.name === file.name)) {
		const message = systemLocaleMap[locale].lesson_favorite_not_exist
		dispatch(openAlert('error', message))
		return dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, message))
	}

	const favorites = state.lessons.lessonCardsFavorites.filter(item => item.name !== file.name)

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.set('le_f', favorites, state.account.password)
			.then(() => {
				dispatch(openAlert('success', systemLocaleMap[locale].lesson_favorite_removed))
				return dispatch(fulfilled(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, favorites))
			})
			.catch(err => {
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
				dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, err))
			})
	} catch (e) {
		dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		dispatch(rejected(lessonsTypes.REMOVE_LESSON_CARD_FAVORITE, e))
	}
}

export const getLessonChecklist = sha => async (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_CHECKLIST))

	const state = getState()
	const { locale, systemLocaleMap } = state.view

	await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			dispatch(fulfilled(lessonsTypes.GET_LESSON_CHECKLIST, content))
		})
		.catch(err => {
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			dispatch(rejected(lessonsTypes.GET_LESSON_CHECKLIST, err))
		})
}

export const unsetLessonChecklist = () => ({type: lessonsTypes.UNSET_LESSON_CHECKLIST})

export const clearLessons = () => ({type: lessonsTypes.CLEAR_LESSONS})