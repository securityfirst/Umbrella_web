import 'isomorphic-unfetch'

import { lessonsTypes, viewTypes } from '../types.js'
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js'

export const setCurrentLesson = (paths, name) => (dispatch, getState) => {
	const state = getState()
	const { content } = state.content
	const { locale } = state.view

	let index = 0
	let lesson = {...content}[locale]

	while (index < paths.length) {
		lesson = lesson[paths[index]]
		index++
	}

	lesson = [...lesson.content]
	lesson = {
		name: name,
		isGlossary: false,
		level: paths[paths.length - 1],
		path: `../../static/assets/content/${locale}/${paths.join('/')}`,
		files: lesson.reduce((list, c) => {
			if (c.filename.indexOf('s_') === 0) {
				list.push({
					name: c.filename,
					sha: c.sha,
				})
			}

			return list
		}, []),
		checklist: lesson.find(c => c.filename.indexOf('c_') > -1)
	}

	dispatch({type: lessonsTypes.SET_CURRENT_LESSON, payload: lesson})
}

export const setLessonsGlossaryIndex = index => (dispatch, getState) => {
	const state = getState()
	const { content } = state.content
	const { locale } = state.view
	const range = index.toLowerCase().split('-')

	let glossary = [...content[locale].glossary.content]

	glossary = {
		isGlossary: true,
		path: `../../static/assets/content/${locale}/glossary`,
		files: glossary.reduce((list, c) => {

			if (
				c.filename.indexOf('s_') === 0 && // if it's a file
				c.filename[2] >= range[0] && // if it's within glossary range
				c.filename[2] <= range[1] // if it's within glossary range
			) {
				list.push({
					name: c.filename,
					sha: c.sha,
				})
			}

			return list
		}, []),
		checklist: null
	}

	dispatch({type: lessonsTypes.SET_CURRENT_LESSON, payload: glossary})
}

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
			dispatch(rejected(lessonsTypes.GET_LESSON_FILE, err))
		})
}

export const closeLesson = () => ({type: lessonsTypes.CLOSE_LESSON})

export const closeLessonFile = () => ({type: lessonsTypes.CLOSE_LESSON_FILE})

export const resetLessons = () => (dispatch, getState) => {
	dispatch({type: lessonsTypes.RESET_LESSONS})
	dispatch({type: viewTypes.RESET_LESSONS})
}

export const getLessonCardsFavorites = () => (dispatch, getState) => {
	dispatch(pending(lessonsTypes.GET_LESSON_CARDS_FAVORITES))

	const state = getState()

	if (!state.account.password) {
		alert('Login or set a password to save your favorite lessons.')
		return dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS_FAVORITES, []))
	}

	try {
		const ClientDB = require('../../db')

		ClientDB.default
			.get('le_f', state.account.password, true)
			.then(lessons => {
				dispatch(fulfilled(lessonsTypes.GET_LESSON_CARDS_FAVORITES, lessons || []))
			})
			.catch(err => {
				dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, err))
			})
	} catch (e) {
		dispatch(rejected(lessonsTypes.GET_LESSON_CARDS_FAVORITES, e))
	}
}
