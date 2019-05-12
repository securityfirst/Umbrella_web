const { renderAndCache } = require('../ssr')

exports.index = (app) => (req, res) => {
	const actualPage = '/lessons'
	return renderAndCache(app, req, res, actualPage)
}

exports.favorites = (app) => (req, res) => {
	const actualPage = '/lessons/favorites'
	return renderAndCache(app, req, res, actualPage)
}

exports.glossary = (app) => (req, res) => {
	const actualPage = '/lessons/glossary'
	return renderAndCache(app, req, res, actualPage, {
		locale: req.params.locale,
	})
}

exports.category = (app) => (req, res) => {
	const actualPage = '/lessons/category'
	return renderAndCache(app, req, res, actualPage, {
		locale: req.params.locale,
		category: req.params.category,
	})
}

exports.level = (app) => (req, res) => {
	const actualPage = '/lessons/level'
	return renderAndCache(app, req, res, actualPage, {
		locale: req.params.locale,
		category: req.params.category,
		level: req.params.level,
	})
}

exports.card = (app) => (req, res) => {
	const actualPage = '/lessons/card'
	return renderAndCache(app, req, res, actualPage, {
		locale: req.params.locale,
		category: req.params.category,
		level: req.params.level,
		sha: req.params.sha,
	})
}