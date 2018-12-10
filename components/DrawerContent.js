import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import MapIcon from '@material-ui/icons/Map';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import { setAppbarTitle } from '../store/actions/view';
import { toggleLessonsMenu } from '../store/actions/view';

import { mapStateToProps } from '../utils/store';

const links = [
	{name: 'Feeds', path: '/feeds', icon: (color) => <CalendarViewDayIcon color={color} />},
	{name: 'Forms', path: '/forms', icon: (color) => <MapIcon color={color} />},
	{name: 'Checklists', path: '/checklists', icon: (color) => <DoneAllIcon color={color} />},
	{name: 'Lessons', path: '/lessons', icon: (color) => <LocalLibraryIcon color={color} />},
	{name: 'Account', path: '/account', icon: (color) => <AccountBoxIcon color={color} />},
];

class DrawerContent extends React.Component {
	render() {
		return (
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
		);
	}
}

export default connect(mapStateToProps)(withRouter(DrawerContent));