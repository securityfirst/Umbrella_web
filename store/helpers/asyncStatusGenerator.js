export const pending = function(status) {
	return status.concat("_PENDING")
}

export const rejected = function(status) {
	return status.concat("_REJECTED")
}

export const fulfilled = function(status) {
	return status.concat("_FULFILLED")
}