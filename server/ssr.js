const LRUCache = require('lru-cache')

const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 60 // 1hour
})

function getCacheKey (req) {
	// can be modified to create unique keys for cache objs
	return `${req.url}`
}

async function render(app, req, res, pagePath, queryParams) {
	try {
		const html = await app.renderToHTML(req, res, pagePath, queryParams)
		res.send(html)
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams)
	}
}

async function renderAndCache(app, req, res, pagePath, queryParams) {
	const key = getCacheKey(req)

	if (process.env.LRU_CACHE_ENABLED !== 'true') {
		return render(app, req, res, pagePath, queryParams)
	}

	// If we have a page in the cache, let's serve it
	if (ssrCache.has(key)) {
		console.log('cache hit')
		res.setHeader('x-cache', 'HIT')
		return res.send(ssrCache.get(key))
	}

	try {
		console.log('non-cached')
		// If not let's render the page into HTML
		const html = await app.renderToHTML(req, res, pagePath, queryParams)

		// Something is wrong with the request, let's skip the cache
		if (res.statusCode !== 200) {
			return res.send(html)
		}

		// Let's cache this page
		ssrCache.set(key, html)

		res.setHeader('x-cache', 'MISS')
		res.send(html)
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams)
	}
}

exports.renderAndCache = renderAndCache
exports.render = render