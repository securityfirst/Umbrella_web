const LRUCache = require('lru-cache');
const { renderAndCache } = require('../cache');

const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 60 // 1hour
});

exports.index = (app) => (req, res) => {
	const actualPage = '/lessons';
	return renderAndCache(app, ssrCache, req, res, actualPage);
}

exports.get = (app) => (req, res) => {
	const actualPage = '/lessons/get';
	const queryParams = { level: req.params.level, id: req.params.id } ;
	return app.render(req, res, actualPage, queryParams);
}