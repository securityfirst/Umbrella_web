import atob from 'atob'

export const decodeBlob = content => {
	// b64DecodeUnicode
    // Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(content).split('').map(c => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}

export const getNameFromFilenameMd = filename => {
	return !!filename ? filename.slice(2).replace(/\.md/, '').replace(/-/g, ' ') : ''
}

export const getNameFromFilenameYml = filename => {
	return !!filename ? filename.slice(2).replace(/\.yml/, '').replace(/-/g, ' ') : ''
}