const { renderAndCache } = require('../ssr')

exports.index = (app) => (req, res) => {
	const actualPage = '/checklists'
	return renderAndCache(app, req, res, actualPage)
}