import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'

import BookmarkIcon from '@material-ui/icons/Bookmark'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle } from '../../store/actions/view'
import { getLessonCardsFavorites } from '../../store/actions/lessons'

const menuWidth = 300

const glossaryIndex = ['A-D', 'E-H', 'I-L', 'M-P', 'Q-T', 'U-Z']

const styles = theme => ({
	...contentStyles(theme),
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
	menuListItemMUIIcon: {
		fill: '#000',
		opacity: '.825',
	},
	menuListItemText: {
		textTransform: 'capitalize',
	},
	menuListSubItem: {
		paddingLeft: theme.spacing.unit * 3,
	},
})

class LessonsMenu extends React.Component {
	state = {
		categorySelected: !!this.props.router.query && !!this.props.router.query.category 
			? this.props.router.query.category.split('.')[0] 
			: !!this.props.router.pathname && !!this.props.router.pathname.indexOf('/glossary') > -1
				? 'glossary'
				: null,
		lessonSelected: null,
	}

	handleCategorySelect = category => e => {
		const { dispatch, content, locale } = this.props
		const keys = Object.keys(content[locale][category])

		if (category !== 'glossary' && keys.length === 1 && keys[0] === 'content') {
			const file = content[locale][category].content.find(file => file.filename.indexOf('.md') > -1)

			dispatch(toggleLessonFileView(true))
			dispatch(getLessonFile(file.sha))
		} else {
			if (category == this.state.categorySelected) this.setState({categorySelected: null})
			else this.setState({categorySelected: category})
		}
	}

	renderMenuGlossary = isSelected => {
		const { classes } = this.props

		return (
			<Collapse in={isSelected} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{glossaryIndex.map((index, i) => (
						<Link key={i} href={`/lessons/glossary/${index}`}>
							<ListItem button className={classes.menuListSubItem}>
								<ListItemText 
									className={classes.menuListItemText} 
									primary={index}
									inset 
								/>
							</ListItem>
						</Link>
					))}
				</List>
			</Collapse>
		)
	}

	renderMenuSubcategories = (subcategories, isSelected) => {
		const { classes } = this.props
		const { categorySelected } = this.state

		return (
			<Collapse in={isSelected} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{subcategories.map((subcategory, i) => (
						<Link key={i} href={`/lessons/${categorySelected}.${subcategory}`}>
							<ListItem button className={classes.menuListSubItem}>
								<ListItemText 
									className={classes.menuListItemText} 
									primary={subcategory.replace(/-/g, ' ')}
									inset 
								/>
							</ListItem>
						</Link>
					))}
				</List>
			</Collapse>
		)
	}

	renderMenuCategory = (category, i) => {
		const { classes, content, locale } = this.props
		const { categorySelected } = this.state

		console.log("categorySelected: ", categorySelected);
		console.log("category: ", category);

		if (category == 'content' || category == 'forms') return null

		const isSelected = categorySelected == category
		const isGlossary = category === 'glossary'
		const subcategories = Object.keys(content[locale][category]).filter(subcategory => subcategory != 'content')

		return (
			<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
				<ListItem button onClick={this.handleCategorySelect(category)}>
					<ListItemIcon className={classes.menuListItemIcon}>
						<img 
							className={classes.menuListItemIconImg} 
							src={`/static/assets/content/${locale}/${category}/${category}.png`} 
						/>
					</ListItemIcon>
					<ListItemText className={classes.menuListItemText} inset primary={category.replace(/-/g, ' ')} />

					{(isGlossary || !!subcategories.length)
						? isSelected ? <ExpandLess /> : <ExpandMore />
						: null
					}
				</ListItem>

				{isGlossary 
					? this.renderMenuGlossary(isSelected)
					: !!subcategories.length
						? this.renderMenuSubcategories(subcategories, isSelected)
						: null
				}
			</div>
		)
	}

	render() {
		const { classes, locale, content, getContentLoading, getContentError, lessonsMenuOpened, currentLesson } = this.props
		const { categorySelected } = this.state

		if (getContentLoading) return <Loading />
		else if (getContentError) return <ErrorMessage error={getContentError} />
		else if (currentLesson) return null

		return (
			<List
				component="nav"
				className={classes.menuList}
				className={classNames(classes.menuList, {
					[classes.menuListOpened]: lessonsMenuOpened,
				})}
			>
				{/* Favorites menu item */}
				<div className={categorySelected == "favorites" ? classes.menuListItemSelected : ''}>
					<Link href="/lessons/favorites">
						<ListItem button>
							<ListItemIcon className={classes.menuListItemIcon}>
								<BookmarkIcon className={classes.menuListItemMUIIcon} />
							</ListItemIcon>
							<ListItemText className={classes.menuListItemText} inset primary="Favorites" />
						</ListItem>
					</Link>
				</div>

				{Object.keys(content[locale]).map(this.renderMenuCategory)}
			</List>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(LessonsMenu)))