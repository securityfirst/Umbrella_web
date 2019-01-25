const { renderAndCache } = require('../ssr');

exports.index = (app) => (req, res) => {
	const actualPage = '/lessons';
	return renderAndCache(app, req, res, actualPage);
}