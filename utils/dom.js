export const copy = val => {
	if (!val) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	if (!document.queryCommandSupported('copy')) {
		alert('This is not supported by your browser.')
		return false
	}

	const el = document.createElement('textarea')
	el.value = val
	document.body.appendChild(el)
	el.select()
	const success = document.execCommand('copy')
	document.body.removeChild(el)

	return success
}