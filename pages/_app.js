import React from 'react';
import App, { Container } from 'next/app';
import NProgress from 'next-nprogress/component';
import { Provider } from 'react-redux';
import withReduxStore from '../lib/redux.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#ee6883',
			main: '#b83657',
			dark: '#83002e',
		},
		secondary: {
			light: '#baf066',
			main: '#87bd34',
			dark: '#558d00',
		},
		background: {
			paper: '#fdfdfd',
		},
	},
	typography: {
		useNextVariants: true,
	},
	mixins: {
		toolbar: {
			minHeight: 48,
		},
	},
});

class MyApp extends App {
	static getInitialProps({Component, router, ctx}) {
		let pageProps = {};

		if (Component.getInitialProps) {
			pageProps = Component.getInitialProps(ctx, router);
		}

		return pageProps;
	}

	render () {
		const {Component, pageProps, reduxStore} = this.props;

		return (
			<MuiThemeProvider theme={theme}>
				<Container>
					<NProgress color="#fff" spinner={false} />

					<Provider store={reduxStore}>
						<Component {...pageProps} />
					</Provider>
				</Container>
			</MuiThemeProvider>
		);
	}
}

export default withReduxStore(MyApp);