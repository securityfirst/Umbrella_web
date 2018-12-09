import React from 'react';
import App, { Container } from 'next/app';
import NProgress from 'next-nprogress/component';
import { Provider } from 'react-redux';
import withReduxStore from '../lib/redux.js';

class MyApp extends App {
	static async getInitialProps({Component, router, ctx}) {
		let pageProps = {};

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return {pageProps};
	}

	render () {
		const {Component, pageProps, reduxStore} = this.props;

		return (
			<Container>
				<NProgress color="#000" spinner={false} />

				<Provider store={reduxStore}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		);
	}
}

export default withReduxStore(MyApp);