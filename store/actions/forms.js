import 'isomorphic-unfetch';

import { formsTypes } from '../types.js';
import { pending, rejected, fulfilled } from '../helpers/asyncActionGenerator.js';

import { formTypes, forms } from '../../mock/forms';

export const getFormTypes = () => {
	return async (dispatch, getState) => {
		dispatch(pending(formsTypes.GET_FORM_TYPES));

		/* TODO: Replace with API */
		await fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => res.json())
			.then(data => dispatch(fulfilled(formsTypes.GET_FORM_TYPES, formTypes)))
			.catch(err => dispatch(rejected(formsTypes.GET_FORM_TYPES, err)));
	}
}

export const getForms = () => {
	return async (dispatch, getState) => {
		dispatch(pending(formsTypes.GET_FORMS));

		/* TODO: Replace with API */
		await fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => res.json())
			.then(data => dispatch(fulfilled(formsTypes.GET_FORMS, forms)))
			.catch(err => dispatch(rejected(formsTypes.GET_FORMS, err)));
	}
}

export const postForm = (data) => {
	return (dispatch, getState) => {
		dispatch(pending(formsTypes.POST_FORM));

		try {
			/* TODO: Replace with API */
			/* TODO: Fix extra webpack calls */
			fetch('https://jsonplaceholder.typicode.com/users', {
				method: 'post',
				body: JSON.stringify({test: 1}), 
				headers: {'Content-Type': 'application/json'},
			})
				.then(res => {
					console.log("res: ", res);
					if (res.ok) {
						dispatch(fulfilled(formsTypes.POST_FORM));
						return res;
					} else {
						console.error("res not ok");
					}
				})
				.catch(err => {
					console.error("action postForm error: ", err);
					dispatch(rejected(formsTypes.POST_FORM, err));
				});
		} catch (e) {
			console.error("exception: ", e);
		}
	}
}

export const resetPostForm = () => {
	return {type: formsTypes.RESET_POST_FORM};
}