import { viewTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

export function selectChecklistMenu(tabSelected) {
	return {type: viewTypes.TOGGLE_CHECKLISTS_MENU, payload: tabSelected};
}