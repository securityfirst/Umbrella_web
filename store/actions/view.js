import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export function setAppbarTitle(title) {
	return {type: viewTypes.SET_APPBAR_TITLE, payload: title};
}