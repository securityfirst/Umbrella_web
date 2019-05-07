import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
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

const styles = theme => ({
	...contentStyles(theme),
	menuList: {
		width: menuWidth,
		maxHeight: 'calc(100vh - 48px)',
		flexShrink: 0,
		whiteSpace: 'nowrap',
		backgroundColor: theme.palette.background.paper,
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen * 5,
		}),
		overflow: 'scroll',
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
			: this.props.router.pathname,
		lessonSelected: null,
	}

	handleCategorySelect = category => e => {
		const { router, dispatch, content, locale } = this.props
		const keys = Object.keys(content[locale][category])

		if (keys.length === 1 && keys[0] === 'content') {
			const file = content[locale][category].content.find(file => file.filename.indexOf('.md') > -1)

			Router.push(`/lessons/cards/${file.sha}`)
		} else {
			if (category == this.state.categorySelected) this.setState({categorySelected: null})
			else this.setState({categorySelected: category})
		}
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

		if (category == 'content' || category == 'forms') return null

		const isSelected = categorySelected == category
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
		const { classes, locale, content, getContentLoading, getContentError, lessonsMenuOpened } = this.props
		const { categorySelected } = this.state

		if (getContentLoading) return <Loading />
		else if (getContentError) return <ErrorMessage error={getContentError} />

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

				{Object.keys(content[locale]).filter(category => category !== 'glossary').map(this.renderMenuCategory)}

				{/* Glossary menu item */}
				<div className={categorySelected == "glossary" ? classes.menuListItemSelected : ''}>
					<Link href="/lessons/glossary">
						<ListItem button>
							<ListItemIcon className={classes.menuListItemIcon}>
								<img 
									className={classes.menuListItemIconImg} 
									src={`/static/assets/content/${locale}/glossary/glossary.png`} 
								/>
							</ListItemIcon>
							<ListItemText className={classes.menuListItemText} inset primary="Glossary" />
						</ListItem>
					</Link>
				</div>
			</List>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(LessonsMenu)))