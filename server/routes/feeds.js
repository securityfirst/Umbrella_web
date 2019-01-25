const { renderAndCache } = require('../ssr');

exports.index = (app) => (req, res) => {
	const actualPage = '/feeds';
	return renderAndCache(app, req, res, actualPage);
}