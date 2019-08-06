import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'

import Alert from '../common/Alert'
import Appbar from './Appbar'
import Menu from './Menu'
import PathwayModal from '../pathways/PathwayModal'

const styles = theme => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
		backgroundColor: '#ececec',
	},
	rootHidden: {
		overflow: 'hidden',
		height: '100vh',
	},
	main: {
		flexGrow: 1,
		marginTop: 48,
		[theme.breakpoints.down('sm')]: {
			minWidth: 'calc(100vw - 73px)',
		},
	},
})

class Layout extends React.Component {
	render() {
		const { router, content, locale, classes, theme, lessonsMenuOpened } = this.props

		return (
			<div className={classNames(classes.root, {
				[classes.rootHidden]: lessonsMenuOpened
			})}>
				<Head>
					<title>{this.props.title}</title>
					<meta charSet='utf-8' />
					<meta name='viewport' content='initial-scale=1.0, width=device-width' />
					<meta name='description' content={this.props.description} />
					<link rel="shortcut icon" href="/static/favicon.png" />
				</Head>

				<Appbar />

				<Menu />

				<main className={classes.main}>
					{this.props.children}
				</main>

				<Alert />

				{(!!content && !!content[locale].pathways) && <PathwayModal />}
			</div>
		)
	}
}

Layout.propTypes = {
	router: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	...state.content,
	...state.view,
})

export default connect(mapStateToProps)(withRouter(withStyles(styles, { withTheme: true })(Layout)))