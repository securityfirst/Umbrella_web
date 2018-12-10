import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { toggleMainMenu } from '../../store/actions/view';

import { viewConstants } from '../../utils/view';

const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: viewConstants.drawerWidth,
		width: `calc(100% - ${viewConstants.drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 5,
		marginRight: 5,
		[theme.breakpoints.up('sm')]: {
			marginLeft: 12,
			marginRight: 24,
		}
	},
	title: {
		flexGrow: 1,
	},
});

class Appbar extends React.Component {
	renderRightContent() {
		if (!this.props.loggedIn) {
			return (
				<Link href="/login">
					<Button component="button" color="inherit">LOGIN</Button>
				</Link>
			);
		}

		return null;
	}

	renderLeftContent() {
		const { router, classes, appbarTitle } = this.props;

		const title = appbarTitle || (
			router.pathname == '/'
				? 'Umbrella'
				: router.pathname.charAt(1).toUpperCase() + router.pathname.slice(2, router.pathname.length) 
		);

		return <Typography className={classes.title} variant="h6" color="inherit" noWrap>{title}</Typography>;
	}

	render() {
		const { classes, mainMenuOpened } = this.props;

		return (
			<AppBar 
				position='fixed'
				className={classNames(classes.appBar, {
					[classes.appBarShift]: mainMenuOpened,
				})}
			>
				<Toolbar disableGutters={true}>
					<IconButton 
						color="inherit" 
						aria-label="Open drawer"
						onClick={() => this.props.dispatch(toggleMainMenu())}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					
					{this.renderLeftContent()}

					{this.renderRightContent()}
				</Toolbar>
			</AppBar>
		);
	}
}

Appbar.propTypes = {
	router: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	...state.view,
	...state.account,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Appbar)));