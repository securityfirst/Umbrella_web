import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { withRouter } from 'next/router';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Appbar from './Appbar';
import Menu from './Menu';

const styles = theme => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
		backgroundColor: '#ececec',
	},
	main: {
		flexGrow: 1,
		marginTop: 48,
		[theme.breakpoints.down('sm')]: {
			minWidth: 'calc(100vw - 73px)',
		},
	},
});

class Layout extends React.Component {
	state = {
		drawerToggled: false,
	};

	render() {
		const { router, classes, theme } = this.props;

		return (
		
			<div className={classes.root}>
				<Head>
					<title>{this.props.title}</title>
					<meta charSet='utf-8' />
					<meta name='viewport' content='initial-scale=1.0, width=device-width' />
					<meta name='description' content={this.props.description} />
					<link href="/static/styles/global.css" rel="stylesheet" />
				</Head>

				<CssBaseline />

				<Appbar />

				<Menu />

				<main className={classes.main}>
					{this.props.children}
				</main>
			</div>
		);
	}
}

Layout.propTypes = {
	router: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(Layout));