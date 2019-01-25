import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import state from './initialState.js';
import reducer from './reducers';

const middlewares = [thunk];

if (
	process.env.NODE_ENV !== 'production' && // is not production
	typeof window !== 'undefined' // is not server
) {
    const logger = createLogger();
    middlewares.push(logger);
}

export function initializeStore (initialState = state) {
	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)))
}