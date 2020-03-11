import atob from 'atob'
import replace from 'batch-replace'

export const decodeBlob = content => {
	// b64DecodeUnicode
    // Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(content).split('').map(c => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}

export const formatContentUrls = ({ blob = '', locale = 'en', category = '', level = '', content = null }) => {
	const domainString = process.env.ROOT + '/'
	const decodedContent = decodeBlob(blob)

	const replacedContent = replace(/umbrella?:\/\//g)
		.with(domainString)
		.in(decodedContent)

	const urlRegex =/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	let formattedContent = replacedContent.replace(urlRegex, url => {
		const index = url.indexOf(domainString)
		
		if (index < 0) return url

		const startIndex = domainString.length
		const path = url.substring(startIndex, url.length)

		let newUrl = `${domainString}lessons/${locale}/`

		let subpaths = path.split('/')
		const category = subpaths[0]
		const subcategory = subpaths[1]

		if (path.indexOf('.md') == path.length - 3) {
			const filename = subpaths[subpaths.length - 1]

			if (path.indexOf('tools') === 0) {
				const lesson = content[locale]['tools'][subcategory].content.find(c => c.filename == filename)
				const sha = lesson ? lesson.sha : ''

				newUrl += `tools.${subcategory}/-/${sha}`

				return newUrl
			} else {
				const level = subpaths[2]
				const lesson = content[locale][category][subcategory][level].content.find(c => c.filename == filename)
				const sha = lesson ? lesson.sha : ''

				newUrl += `${category}.${subcategory}/${level}/${sha}`

				return newUrl
			}
		} else {
			newUrl = `/lessons/${locale}/${category}.${subcategory}`

			// If category is not Tools, check for level
			if (url[1].indexOf('umbrella://tools') < 0) {
				const level = subpaths[2]
				
				if (['beginner', 'advanced', 'expert'].includes(level)) {
					newUrl += `/${level}`
				}
			}

			return newUrl
		}
	});

	const imageUrlRegex = /\(([^\)]+)\)/ig

	formattedContent = formattedContent.replace(imageUrlRegex, url => {
		let strings = url.split('.')

		if (['jpg)', 'jpeg)', 'png)', 'svg)', 'gif)', 'bmp)'].includes(strings[1])) {
			let subpath = ''

			if (category == '-') subpath = 'about'
			else if (category.indexOf('tools') > -1) subpath = `${category.replace('.', '/')}`
			else subpath = `${category.replace('.', '/')}/${level}`

			return `(https://raw.githubusercontent.com/securityfirst/umbrella-content/master/${locale}/${subpath}/${url.replace('(', '').replace(')', '')})`
		}

		return url
	})

	formattedContent = formattedContent.replace(/index\: [0-9]/, '').replace('title', 'Title')

	return formattedContent
}

export const getNameFromFilenameYml = filename => {
	return !!filename ? filename.slice(2).replace(/\.yml/, '').replace(/-/g, ' ') : ''
}