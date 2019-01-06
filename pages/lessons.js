import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'isomorphic-unfetch';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import SecurityIcon from '@material-ui/icons/Security';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import SettingsPhoneIcon from '@material-ui/icons/SettingsPhone';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import PeopleIcon from '@material-ui/icons/People';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import BusinessIcon from '@material-ui/icons/Business';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LanguageIcon from '@material-ui/icons/Language';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Layout from '../components/layout';
import Loading from '../components/reusables/Loading';

import { contentStyles } from '../utils/view';

import { getLessons, getLessonCards } from '../store/actions/lessons';

const menuWidth = 300;

const styles = theme => ({
	...contentStyles(theme),
	wrapper: {
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	menuList: {
		width: menuWidth,
		flexShrink: 0,
		height: '100%',
		whiteSpace: 'nowrap',
		backgroundColor: theme.palette.background.paper,
		overflow: 'hidden',
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen * 5,
		}),
	},
	menuListOpened: {
		width: menuWidth,
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen * 5,
		}),
	},
	menuListItemSelected: {
		borderTop: '1px solid ' + theme.palette.grey[300],
		borderBottom: '1px solid ' + theme.palette.grey[300],
	},
	menuListItemIcon: {
		display: 'block',
	},
	menuListItemIconImg: {
		width: '1.5rem',
		opacity: '.825',
	},
	menuListItemText: {
		textTransform: 'capitalize',
	},
	menuListSubItem: {
		paddingLeft: theme.spacing.unit * 3,
	},
});

const menuSet = {
	'My Security': { icon: (color) => <SecurityIcon color={color} /> },
	'Information': { icon: (color) => <DevicesOtherIcon color={color} /> },
	'Communications': { icon: (color) => <SettingsPhoneIcon color={color} /> },
	'Travel': { icon: (color) => <BusinessCenterIcon color={color} /> },
	'Operations': { icon: (color) => <PeopleIcon color={color} /> },
	'Personal': { icon: (color) => <AccessibilityIcon color={color} /> },
	'Emergency Support': { icon: (color) => <BusinessIcon color={color} /> },
	'Tools': { icon: (color) => <LocalHospitalIcon color={color} /> },
	'Index / Glossary': { icon: (color) => <LanguageIcon color={color} /> },
	'About': { icon: (color) => <InfoIcon color={color} /> },
};

class Lessons extends React.Component {
	static async getInitialProps({isServer, reduxStore}) {
		await reduxStore.dispatch(getLessons());
		// await reduxStore.dispatch(getLessonCards());
		return isServer;
	}

	state = {
		menuItemSelected: null,
		lessonSelected: null,
	};

	handleMenuItemSelect = menuItemIndex => {
		if (menuItemIndex == this.state.menuItemSelected) this.setState({menuItemSelected: null});
		else this.setState({menuItemSelected: menuItemIndex});
	}

	renderMenuList = () => {
		const { classes, lessonsMenuOpened, getLessonsLoading, getLessonsError, lessons, locale } = this.props;
		const { menuItemSelected } = this.state;

		if (getLessonsLoading) return <Loading />;
		else if (getLessonsError) return <Typography variant="error">{JSON.stringify(getLessonsError)}</Typography>;

		return (
			<List
				component="nav"
				className={classes.menuList}
				className={classNames(classes.menuList, {
					[classes.menuListOpened]: lessonsMenuOpened,
				})}
			>
				{Object.keys(lessons[locale]).map((category, i) => {
					if (category == "content" || category == "forms") return null;

					const isSelected = menuItemSelected == i;

					const subcategories = Object.keys(lessons[locale][category]).filter(subcategory => subcategory != "content");

					return (
						<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
							<ListItem button onClick={() => this.handleMenuItemSelect(i)}>
								<ListItemIcon className={classes.menuListItemIcon}>
									<img className={classes.menuListItemIconImg} src={`/static/assets/content/${locale}/${category}/${category}.png`} />
								</ListItemIcon>
								<ListItemText className={classes.menuListItemText} inset primary={category.replace(/-/g, ' ')} />
								{!!subcategories.length
									? isSelected ? <ExpandLess /> : <ExpandMore />
									: null
								}
							</ListItem>
							{!!subcategories.length && <Collapse in={isSelected} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{subcategories.map((subcategory, i) => {
										return (
											<ListItem button className={classes.menuListSubItem} key={i}>
												<ListItemText className={classes.menuListItemText} inset primary={subcategory.replace(/-/g, ' ')} />
											</ListItem>
										);
									})}
								</List>
							</Collapse>}
						</div>
					);
				})}
			</List>
		);
	}

	render() {
		const { classes } = this.props;

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					{this.renderMenuList()}

					<div className={classes.content}>

						<Typography paragraph>
							<strong>LESSON</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
							elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
							hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
							velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
							Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
							viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
							Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
							at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
							ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
						</Typography>
					</div>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Lessons));