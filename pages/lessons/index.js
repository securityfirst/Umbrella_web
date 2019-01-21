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
import Fab from '@material-ui/core/Fab';

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

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';
import LessonLevel from '../../components/lessons/LessonLevel';
import LessonsContent from '../../components/lessons/LessonsContent';
import LessonCard from '../../components/lessons/LessonCard';

import yellow from '@material-ui/core/colors/yellow';

import { contentStyles } from '../../utils/view';

import { getLessons } from '../../store/actions/lessons';
import { setLessonsContentType, setLessonsContentPath } from '../../store/actions/view';

const menuWidth = 300;

const styles = theme => ({
	...contentStyles(theme, {
		width: '100%',
	}),
	wrapper: {
		position: 'relative',
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
	level: {
		color: 'white',
		cursor: 'initial',
		[theme.breakpoints.up('sm')]: {
			marginLeft: '.5rem',
			marginBottom: '1rem',
		},
		[theme.breakpoints.up('md')]: {
			position: 'absolute',
			top: '2rem',
			left: '2rem',
		},
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&.hover': {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	advanced: {
		backgroundColor: yellow[700],
		'&.hover': {
			backgroundColor: yellow[700],
		},
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&.hover': {
			backgroundColor: theme.palette.primary.main,
		},
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
		return isServer;
	}

	state = {
		categorySelected: null,
		subcategorySelected: null,
		lessonSelected: null,
	};

	handleCategorySelect = category => e => {
		if (category == this.state.categorySelected) this.setState({categorySelected: null});
		else this.setState({categorySelected: category});
	}

	handleSubcategorySelect = subcategory => e => {
		const { dispatch, lessons } = this.props;
		const { categorySelected } = this.state;

		this.setState(
			{subcategorySelected: subcategory}, 
			() => {
				dispatch(setLessonsContentType('levels'));
				dispatch(setLessonsContentPath(`${categorySelected}.${subcategory}`));
			}
		);
	}

	renderLevel = () => {
		const { classes, currentLesson } = this.props;

		return (
			<Fab 
				className={classNames(classes.level, classes[currentLesson.level])} 
				component="div"
				variant="extended"
				disableFocusRipple
				disableRipple
			>{currentLesson.level}</Fab>
		);
	}

	renderMenuCategory = (category, i) => {
		const { classes, lessons, locale } = this.props;
		const { categorySelected } = this.state;

		if (category == "content" || category == "forms") return null;

		const isSelected = categorySelected == category;
		const subcategories = Object.keys(lessons[locale][category]).filter(subcategory => subcategory != "content");

		return (
			<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
				<ListItem button onClick={this.handleCategorySelect(category)}>
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
						{subcategories.map((subcategory, i) => (
							<ListItem button className={classes.menuListSubItem} key={i} onClick={this.handleSubcategorySelect(subcategory)}>
								<ListItemText className={classes.menuListItemText} inset primary={subcategory.replace(/-/g, ' ')} />
							</ListItem>
						))}
					</List>
				</Collapse>}
			</div>
		);
	}

	renderMenuList = () => {
		const { classes, lessonsMenuOpened, getLessonsLoading, getLessonsError, lessons, currentLesson, locale } = this.props;

		if (getLessonsLoading) return <Loading />;
		else if (getLessonsError) return <ErrorMessage error={getLessonsError} />;
		else if (currentLesson) return null;

		return (
			<List
				component="nav"
				className={classes.menuList}
				className={classNames(classes.menuList, {
					[classes.menuListOpened]: lessonsMenuOpened,
				})}
			>
				{Object.keys(lessons[locale]).map(this.renderMenuCategory)}
			</List>
		);
	}

	renderContent = () => {
		const { currentLesson, lessonFileView } = this.props;

		if (lessonFileView) return <LessonCard />;
		else if (currentLesson) return <LessonLevel />;
		else return <LessonsContent />;
	}

	render() {
		const { classes, lessonsContentType, currentLesson } = this.props;

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					{!currentLesson && this.renderMenuList()}

					<div className={classes.content}>
						{!!currentLesson && this.renderLevel()}

						{this.renderContent()}
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