import { pending as pendingType, fulfilled as fulfilledType, rejected as rejectedType } from './asyncStatusGenerator'
import { formatError } from '../../utils/error.js'

export const pending = (type) => {
	return {
		type: pendingType(type)
	}
}

export const fulfilled = (type, res) => {
	return {
		type: fulfilledType(type),
		payload: res
	}
}

export const rejected = (type, err) => {
	return {
		type: rejectedType(type),
		payload: formatError(err)
	}
}