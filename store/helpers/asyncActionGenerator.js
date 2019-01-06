import { pending as pendingType, fulfilled as fulfilledType, rejected as rejectedType } from './asyncStatusGenerator';
import { formatError } from '../../utils/error.js';

export function pending(type) {
	return {
		type: pendingType(type)
	};
}

export function fulfilled(type, res) {
	return {
		type: fulfilledType(type),
		payload: res
	};
}

export function rejected(type, err) {
	return {
		type: rejectedType(type),
		payload: formatError(err)
	};
}