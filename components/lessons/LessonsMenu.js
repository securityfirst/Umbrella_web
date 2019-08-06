import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import YAML from 'yaml'

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

import { setAppbarTitle, toggleLessonsMenu } from '../../store/actions/view'
import { getLessonCardsFavorites } from '../../store/actions/lessons'

import { decodeBlob } from '../../utils/github'

const menuWidth = 300

const styles = theme => ({
	...contentStyles(theme),
	menuWrapper: {
		width: menuWidth,
		maxHeight: 'calc(100vh - 48px)',
		overflow: 'hidden',
		transition: theme.transitions.create(['height'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen * 1.5,
		}),
		[theme.breakpoints.down('sm')]: {
			position: 'absolute',
			width: '100%',
			height: '35px',
			zIndex: 1,
			boxShadow: theme.shadows[1],
		},
	},
	menuWrapperOpened: {
		height: '100%',
		overflow: 'scroll',
		transition: theme.transitions.create(['height'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen * 1.5,
		}),
	},
	menuToggleMobile: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '35px',
		backgroundColor: theme.palette.background.paper,
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	menuList: {
		height: '100%',
		flexShrink: 0,
		whiteSpace: 'nowrap',
		backgroundColor: theme.palette.background.paper,
		overflow: 'scroll',
		'-webkit-overflow-scrolling': 'touch',
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
			: this.props.router.pathname,
		lessonSelected: null,
	}

	toggleMenuMobile = e => {
		e.preventDefault()
		this.props.dispatch(toggleLessonsMenu(!this.props.lessonsMenuOpened)) 
	}

	handleCategorySelect = category => e => {
		const { router, dispatch, content, locale } = this.props
		const keys = Object.keys(content[locale][category])

		if (keys.length === 1 && keys[0] === 'content') {
			const file = content[locale][category].content.find(file => file.filename.indexOf('.md') > -1)

			Router.push(`/lessons/${locale}/-/-/${file.sha}`)
		} else {
			if (category == this.state.categorySelected) this.setState({categorySelected: null})
			else this.setState({categorySelected: category})
		}
	}

	renderMenuSubcategories = (subcategories, isSelected) => {
		const { classes, locale, localeMap } = this.props
		const { categorySelected } = this.state

		return (
			<Collapse in={isSelected} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{subcategories.map((subcategory, i) => (
						<Link key={i} href={`/lessons/${locale}/${categorySelected}.${subcategory}`}>
							<ListItem button className={classes.menuListSubItem}>
								<ListItemText 
									className={classes.menuListItemText} 
									primary={localeMap[locale][subcategory]}
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
		const { classes, content, locale, localeMap } = this.props
		const { categorySelected } = this.state

		const isSelected = categorySelected == category
		const subcategories = Object.keys(content[locale][category]).filter(subcategory => subcategory != 'content')

		return (
			<div key={i} className={isSelected ? classes.menuListItemSelected : ''}>
				<ListItem button onClick={this.handleCategorySelect(category)}>
					<ListItemIcon className={classes.menuListItemIcon}>
						<img 
							className={classes.menuListItemIconImg} 
							src={`/static/assets/content/en/${category}/${category}.png`} 
						/>
					</ListItemIcon>
					<ListItemText className={classes.menuListItemText} inset primary={localeMap[locale][category]} />

					{!!subcategories.length
						? isSelected ? <ExpandLess /> : <ExpandMore />
						: null
					}
				</ListItem>

				{!!subcategories.length && this.renderMenuSubcategories(subcategories, isSelected)}
			</div>
		)
	}

	render() {
		const { 
			classes, 
			locale, 
			getLocaleMapLoading, 
			getLocaleMapError, 
			localeMap,
			content, 
			getContentLoading, 
			getContentError, 
			lessonsMenuOpened 
		} = this.props
		const { categorySelected } = this.state

		if (getContentLoading || getLocaleMapLoading) return <Loading />
		else if (getContentError || getLocaleMapError) return <ErrorMessage error={getContentError || getLocaleMapError} />

		return (
			<div className={classNames(classes.menuWrapper, {[classes.menuWrapperOpened]: lessonsMenuOpened})}>
				<div className={classes.menuToggleMobile} onClick={this.toggleMenuMobile}>
					<Typography>Lessons Menu</Typography>
					{lessonsMenuOpened ? <ExpandLess /> : <ExpandMore />}
				</div>
				<List component="nav" className={classes.menuList}>
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

					{Object
						.keys(content[locale])
						.filter(category => !['content', 'glossary', 'pathways', 'forms'].includes(category))
						.map(this.renderMenuCategory)
					}

					{/* Glossary menu item */}
					<div className={categorySelected == "glossary" ? classes.menuListItemSelected : ''}>
						<Link href={`/lessons/${locale}/glossary`}>
							<ListItem button>
								<ListItemIcon className={classes.menuListItemIcon}>
									<img 
										className={classes.menuListItemIconImg} 
										src={`/static/assets/content/en/glossary/glossary.png`} 
									/>
								</ListItemIcon>
								<ListItemText className={classes.menuListItemText} inset primary="Glossary" />
							</ListItem>
						</Link>
					</div>
				</List>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(LessonsMenu)))