import {pending as pendingType, fulfilled as fulfilledType, rejected as rejectedType} from './asyncStatusGenerator';

export function pending(type) {
	return {
		type: pendingType(type)
	}
}

export function fulfilled(type, res) {
	return {
		type: fulfilledType(type),
		payload: res
	}
}

export function rejected(type, err) {
	return {
		type: rejectedType(type),
		payload: err
	}
}