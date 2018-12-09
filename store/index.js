import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import initialState from './initialState.js';
import reducer from './reducers';

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    middlewares.push(logger);
}

export function initializeStore (initialState = initialState) {
	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)))
}