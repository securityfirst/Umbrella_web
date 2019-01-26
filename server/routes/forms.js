const { renderAndCache } = require('../ssr')

exports.index = (app) => (req, res) => {
	const actualPage = '/forms'
	return renderAndCache(app, req, res, actualPage)
}

exports.new = (app) => (req, res) => {
	const actualPage = '/forms/new'
	return renderAndCache(app, req, res, actualPage)
}