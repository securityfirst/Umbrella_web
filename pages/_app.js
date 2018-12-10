import React from 'react';
import App, { Container } from 'next/app';
import NProgress from 'next-nprogress/component';
import { Provider } from 'react-redux';
import withReduxStore from '../lib/redux.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			// light: ,
			main: '#b83657',
			dark: '#8b2a42',
		},
	},
	typography: {
		useNextVariants: true,
	},
});

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
			<MuiThemeProvider theme={theme}>
				<Container>
					<NProgress color="#8b2a42" spinner={false} />

					<Provider store={reduxStore}>
						<Component {...pageProps} />
					</Provider>
				</Container>
			</MuiThemeProvider>
		);
	}
}

export default withReduxStore(MyApp);