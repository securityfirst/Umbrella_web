import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import MapIcon from '@material-ui/icons/Map';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
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
		marginLeft: 12,
		marginRight: 24,
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
	content: {
		flexGrow: 1,
		minWidth: 'calc(100vw - 73px)',
		padding: theme.spacing.unit * 3,
	},
});

const links = [
	{name: 'Feeds', path: '/feeds', icon: <CalendarViewDayIcon />},
	{name: 'Forms', path: '/forms', icon: <MapIcon />},
	{name: 'Checklists', path: '/checklists', icon: <DoneAllIcon />},
	{name: 'Lessons', path: '/lessons', icon: <LocalLibraryIcon />},
	{name: 'Account', path: '/account', icon: <AccountBoxIcon />},
];

class Layout extends React.Component {
	state = {
		menuToggled: false,
	};

	handleDrawerOpen = () => {
		this.setState({ menuToggled: true });
	};

	handleDrawerClose = () => {
		this.setState({ menuToggled: false });
	};

	render() {
		const { classes, theme } = this.props;

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
						[classes.appBarShift]: this.state.menuToggled,
					})}
				>
					<Toolbar disableGutters={true}>
						<IconButton 
							color="inherit" 
							aria-label="Open drawer"
							onClick={this.handleDrawerOpen}
							className={classNames(classes.menuButton, {
								[classes.hide]: this.state.open,
							})}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit" noWrap>
							Umbrella
						</Typography>
					</Toolbar>
				</AppBar>

				<Drawer
					variant="permanent"
					className={classNames(classes.drawer, {
						[classes.drawerOpen]: this.state.menuToggled,
						[classes.drawerClose]: !this.state.menuToggled,
					})}
					classes={{
						paper: classNames({
							[classes.drawerOpen]: this.state.menuToggled,
							[classes.drawerClose]: !this.state.menuToggled,
						}),
					}}
					open={this.state.menuToggled}
				>
					<div className={classes.toolbar}>
						<IconButton onClick={this.handleDrawerClose}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</div>

					<Divider />

					<List>
						{links.map((link, i) => (
							<Link href={link.path} key={i}>
								<ListItem button>
									<ListItemIcon>{link.icon}</ListItemIcon>
									<ListItemText primary={link.name} />
								</ListItem>
							</Link>
						))}
					</List>
				</Drawer>

				<main className={classes.content}>
					<div className={classes.toolbar} />
					
					{this.props.children}
				</main>
			</div>
		);
	}
}

Layout.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Layout);