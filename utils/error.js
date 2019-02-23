export const formatError = (err) => {
	console.error('formatError() err: ', err)
	console.log("typeof err: ", typeof err);

	if (!err) return {status: 400, message: 'Something went wrong'}
	if (typeof err === 'string') return {status: 400, message: err}
	if (err instanceof ReferenceError) return {status: 400, message: err.message}

	try {
		err = JSON.parse(JSON.stringify(err))

		if (!err.response) return {status: 400, message: 'Something went wrong'}

		let error = {status: err.response.status || 400}

		if (err.response.statusText) {
			error.message = err.response.statusText
		} else if (!!err.response.data && !!err.response.data.length) {
			error.message = err.response.data
		} else {
			error.message = 'Something went wrong'
		}

		return error
	} catch (e) {
		console.error('formatError() exception: ', e)
		return {status: 400, message: 'Something went wrong.'}
	}
}