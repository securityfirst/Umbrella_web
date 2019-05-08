import React from 'react'
import atob from 'atob'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import MoreIcon from '@material-ui/icons/MoreVert'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import DoneAllIcon from '@material-ui/icons/DoneAll'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import Marked from '../../components/common/Marked'
import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle } from '../../store/actions/view'
import { getLessonFile } from '../../store/actions/lessons'

import { getNameFromFilename } from '../../utils/github'

const styles = theme => ({
	...contentStyles(theme, {
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			maxHeight: 'calc(100vh - 48px)',
			overflow: 'scroll',
		}
	}),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	menuItem: {
		textTransform: 'capitalize',
	},
	grow: {
		flexGrow: 1,
	},
	buttonRightIcon: {
		marginLeft: theme.spacing.unit,
	},
	paper: {
		...paperStyles(theme),
		paddingTop: '.5rem',
		paddingRight: '2rem !important',
		paddingBottom: '2rem',
		paddingLeft: '2rem !important',
	},
})

class LessonCard extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getLessonFile(query.sha))
		await reduxStore.dispatch(setAppbarTitle(`Lesson Card`))
	}

	static async getInitialProps({reduxStore, query}) {
	}

	state = {
		anchorEl: null,
	}

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget })
	}

	handleClose = () => {
		this.setState({ anchorEl: null })
	}

	renderNavigation = () => {
		const { classes, content, locale, router } = this.props
		const { category, level, sha } = router.query
		const { anchorEl } = this.state

		const cats = category.split('.')
		const cat = cats[0]
		const subcat = cats[1]

		const open = Boolean(anchorEl)

		const lessons = content[locale][cat][subcat][level].content.filter(l => l.filename.indexOf('s_') === 0)
		const lessonIndex = lessons.findIndex(l => l.sha === sha)
		const isLast = lessonIndex === lessons.length - 1

		return (
			<AppBar position="static">
				<Toolbar>
					<div>
						<IconButton
							aria-owns={open ? 'menu-appbar' : undefined}
							aria-haspopup="true"
							onClick={this.handleMenu}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={open}
							onClose={this.handleClose}
						>
							{lessons.map((lesson, i) => (
								<Link key={i} href={`/lessons/${category}/${level}/${lesson.sha}`}>
									<MenuItem 
										className={classes.menuItem}
										onClick={this.handleClose}
									>
										{getNameFromFilename(lesson.filename)}
									</MenuItem>
								</Link>
							))}
						</Menu>
					</div>

					<div className={classes.grow}>
						{isLast
							? <Link href={`/lessons/${category}/${level}`}>
								<Button color="inherit">
									Finish
									<DoneOutlineIcon className={classes.buttonRightIcon} />
								</Button>
							</Link>
							: <Link href={`/lessons/${category}/${level}/${lessons[lessonIndex + 1].sha}`}>
								<Button color="inherit">
									Next
									<ChevronRightIcon className={classes.buttonRightIcon} />
								</Button>
							</Link>
						}
					</div>

					<Link href={`/lessons/${category}/${level}`}>
						<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
							<DoneAllIcon />
						</IconButton>
					</Link>
				</Toolbar>
			</AppBar>
		)
	}

	renderContent = () => {
		const { currentLessonFile, getLessonFileLoading, getLessonFileError } = this.props

		if (getLessonFileLoading) return <Loading />
		else if (getLessonFileError) return <ErrorMessage error={getLessonFileError} />
		return <Marked content={atob(currentLessonFile)} />
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Lesson Card" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classes.content}>
						{this.renderNavigation()}

						<Paper className={'lessons-card ' + classes.paper} square>
							{this.renderContent()}
						</Paper>
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.content,
	...state.view,
	...state.lessons,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonCard)))