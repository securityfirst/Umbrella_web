import atob from 'atob'
import replace from 'batch-replace'

export const decodeBlob = content => {
	// b64DecodeUnicode
    // Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(content).split('').map(c => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}

export const formatContentUrls = ({ blob = '', locale = 'en' }) => {
	const domainString = process.env.ROOT + '/'
	const decodedContent = decodeBlob(blob)

	const replacedContent = replace(/umbrella?:\/\//g)
		.with(domainString)
		.in(decodedContent)

	const urlRegex =/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	const formattedContent = replacedContent.replace(urlRegex, url => {
		const index = url.indexOf(domainString)
		
		if (index < 0) return url;

		const startIndex = domainString.length
		const path = url.substring(startIndex, url.length)
		const firstSlashIndex = path.indexOf('/')
		const replacedPath = path.replace(/\//, '.')

		return domainString + 'lessons/' + locale + '/' + replacedPath
	});

	return formattedContent
}

export const getNameFromFilenameYml = filename => {
	return !!filename ? filename.slice(2).replace(/\.yml/, '').replace(/-/g, ' ') : ''
}