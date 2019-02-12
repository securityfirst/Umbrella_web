import qs from 'qs'

export function urlParams({url, params}) {
	try {
		if (!url) return ""
		if (!params) return url

		let parts = url.split("?")
		let newUrl = parts[0]
		let newParams = {...parts[1], ...params}

		return `${newUrl}?${qs.stringify(newParams)}`
	} catch (e) {
		console.error('[UTILS] fetch.urlParams exception: ', e)
		return ''
	}
}