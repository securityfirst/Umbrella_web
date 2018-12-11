const LRUCache = require('lru-cache');
const { renderAndCache } = require('../cache');

const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 60 // 1hour
});

exports.index = (app) => (req, res) => {
	const actualPage = '/checklists';
	return renderAndCache(app, ssrCache, req, res, actualPage);
}