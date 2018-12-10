export const formatError = (err) => {
	if (err instanceof ReferenceError) {
		console.error("formatError() ReferenceError: ", err);
		return {status: 400, message: err.message};
	}

	try {
		err = !!err ? JSON.parse(JSON.stringify(err)) : {response: {}};
		console.error("formatError() err: ", err);

		let error = {status: err.response.status || 400};

		if (!!err.response.data && !!err.response.data.length) {
			error.message = err.response.data;
		} else if (err.response.statusText) {
			error.message = err.response.statusText;
		} else {
			error.message = "Something went wrong";
		}

		return error;
	} catch (e) {
		console.error("formatError() exception: ", e);
		return {status: 400, message: "Something went wrong."};
	}
}