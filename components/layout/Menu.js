import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import MapIcon from '@material-ui/icons/Map';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import { setAppbarTitle } from '../../store/actions/view';
import { toggleMainMenu, toggleLessonsMenu } from '../../store/actions/view';

import { viewConstants } from '../../utils/view';

const links = [
	{name: 'Feeds', path: '/feeds', icon: (color) => <CalendarViewDayIcon color={color} />},
	{name: 'Forms', path: '/forms', icon: (color) => <MapIcon color={color} />},
	{name: 'Checklists', path: '/checklists', icon: (color) => <DoneAllIcon color={color} />},
	{name: 'Lessons', path: '/lessons', icon: (color) => <LocalLibraryIcon color={color} />},
	{name: 'Account', path: '/account', icon: (color) => <AccountBoxIcon color={color} />},
];

const styles = theme => ({
	drawer: {
		width: viewConstants.drawerIconWidth(theme),
		[theme.breakpoints.up('sm')]: {
			width: viewConstants.drawerWidth,
		},
		flexShrink: 0,
		whiteSpace: 'nowrap',
		backgroundColor: theme.palette.background.paper,
	},
	drawerOpen: {
		width: viewConstants.drawerIconWidth(theme),
		[theme.breakpoints.up('sm')]: {
			width: viewConstants.drawerWidth,
		},
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
		width: 0,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9 + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		backgroundColor: theme.palette.background.paper,
		...theme.mixins.toolbar,
	},
});

class Menu extends React.Component {
	handleDrawerClose = () => this.props.dispatch(toggleMainMenu(false))

	renderContent = () => (
		<List>
			{links.map((link, i) => (
				<Link href={link.path} key={i}>
					<ListItem button onClick={() => {
						this.props.dispatch(setAppbarTitle(link.name));

						switch (link.name) {
							case 'Lessons': this.props.dispatch(toggleLessonsMenu(true)); break;
						}
					}}>
						<ListItemIcon>{link.icon(this.props.router.pathname == link.path ? "secondary" : "inherit")}</ListItemIcon>
						<ListItemText primary={link.name} />
					</ListItem>
				</Link>
			))}
		</List>
	)

	render() {
		const { classes, theme, mainMenuOpened } = this.props;

		return (
			<Drawer
				variant="permanent"
				className={classNames(classes.drawer, {
					[classes.drawerOpen]: mainMenuOpened,
					[classes.drawerClose]: !mainMenuOpened,
				})}
				classes={{
					paper: classNames({
						[classes.drawerOpen]: mainMenuOpened,
						[classes.drawerClose]: !mainMenuOpened,
					}),
				}}
				open={mainMenuOpened}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={this.handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>

				<Divider />

				{this.renderContent()}
			</Drawer>
		);
	}
}

const mapStateToProps = state => ({...state.view});

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Menu)));