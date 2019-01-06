function getCacheKey (req) {
	// can be modified to create unique keys for cache objs
	return `${req.url}`;
}

exports.renderAndCache = async (app, ssrCache, req, res, pagePath, queryParams) => {
	const key = getCacheKey(req);

	// If we have a page in the cache, let's serve it
	if (ssrCache.has(key)) {
		console.log('cache hit');
		res.setHeader('x-cache', 'HIT');
		return res.send(ssrCache.get(key));
	}

	try {
		console.log('non-cached');
		// If not let's render the page into HTML
		const html = await app.renderToHTML(req, res, pagePath, queryParams)

		// Something is wrong with the request, let's skip the cache
		if (res.statusCode !== 200) {
			return res.send(html);
		}

		// Let's cache this page
		ssrCache.set(key, html);

		res.setHeader('x-cache', 'MISS');
		res.send(html);
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams);
	}
}