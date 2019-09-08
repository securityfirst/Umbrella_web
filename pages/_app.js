import React from 'react'
import App, { Container } from 'next/app'
import NProgress from 'next-nprogress/component'
import { Provider } from 'react-redux'
import JssProvider from 'react-jss/lib/JssProvider'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'

import { withReduxStore } from '../lib/redux.js'
import { getPageContext } from '../lib/mui'

import { getContent } from '../store/actions/content'
import { checkProtected, checkPassword, login } from '../store/actions/account'
import { getContentLocaleMap, getSystemLocaleMap, syncView } from '../store/actions/view'
import { syncDb } from '../store/actions/db'

import './index.css'

class MyApp extends App {
	constructor(props) {
		super(props)
		this.pageContext = getPageContext()
	}

	static async getInitialProps({Component, router, ctx}) {
		// global data
		await ctx.reduxStore.dispatch(getContent())
		await ctx.reduxStore.dispatch(getContentLocaleMap())
		await ctx.reduxStore.dispatch(getSystemLocaleMap())

		let pageProps = {}

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return {pageProps}
	}

	async componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side')
		
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles)
		}

		if (typeof window !== 'undefined') {
			const { dispatch } = this.props.reduxStore

			dispatch(syncDb())

			const Account = require('../account')
			const ClientDB = require('../db')
			
			ClientDB.default.init()

			if (!!Account.default.isLoggedIn()) {
				const password = await Account.default.password()
				dispatch(login(password), () => {
					setTimeout(() => {
						window.location.reload()
					}, 1000)
				})
			}

			dispatch(checkProtected())
			dispatch(checkPassword())
			dispatch(syncView())
		}
	}

	render () {
		const {Component, pageProps, reduxStore} = this.props

		return (
			<JssProvider
				registry={this.pageContext.sheetsRegistry}
				generateClassName={this.pageContext.generateClassName}
			>
				{/* MuiThemeProvider makes the theme available down the React
				tree thanks to React context. */}
				<MuiThemeProvider 
					theme={this.pageContext.theme}
					sheetsManager={this.pageContext.sheetsManager}
				>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					
					{/*<NProgress color="#fff" spinner={false} />*/}

					<Provider store={reduxStore}>
						{/* Pass pageContext to the _document though the renderPage enhancer
						to render collected styles on server side. */}
						<Component {...pageProps} pageContext={this.pageContext} />
					</Provider>
				</MuiThemeProvider>
			</JssProvider>
		)
	}
}

export default withReduxStore(MyApp)