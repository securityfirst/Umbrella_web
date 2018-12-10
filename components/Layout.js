import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { withRouter } from 'next/router';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import AppBarContent from './AppBarContent';
import DrawerContent from './DrawerContent';

const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
		backgroundColor: '#ececec',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
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
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		backgroundColor: '#fdfdfd',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing.unit * 7 + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9 + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		backgroundColor: '#fdfdfd',
		...theme.mixins.toolbar,
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

	handleDrawerOpen = () => {
		this.setState({ drawerToggled: true });
	};

	handleDrawerClose = () => {
		this.setState({ drawerToggled: false });
	};

	handleDrawerToggle = () => {
		this.setState({ drawerToggled: !this.state.drawerToggled });
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

				<AppBar 
					position='fixed'
					className={classNames(classes.appBar, {
						[classes.appBarShift]: this.state.drawerToggled,
					})}
				>
					<Toolbar disableGutters={true}>
						<IconButton 
							color="inherit" 
							aria-label="Open drawer"
							onClick={this.handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
						
						<AppBarContent />
					</Toolbar>
				</AppBar>

				<ClickAwayListener onClickAway={this.handleDrawerClose}>
					<Drawer
						variant="permanent"
						className={classNames(classes.drawer, {
							[classes.drawerOpen]: this.state.drawerToggled,
							[classes.drawerClose]: !this.state.drawerToggled,
						})}
						classes={{
							paper: classNames({
								[classes.drawerOpen]: this.state.drawerToggled,
								[classes.drawerClose]: !this.state.drawerToggled,
							}),
						}}
						open={this.state.drawerToggled}
					>
						<div className={classes.toolbar}>
							<IconButton onClick={this.handleDrawerClose}>
								{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
							</IconButton>
						</div>

						<Divider />

						<DrawerContent />
					</Drawer>
				</ClickAwayListener>

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