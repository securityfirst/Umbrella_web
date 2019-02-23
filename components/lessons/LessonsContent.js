import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import get from 'lodash.get'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import yellow from '@material-ui/core/colors/yellow'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { setLesson } from '../../store/actions/lessons'
import { setAppbarTitle } from '../../store/actions/view'

const styles = theme => ({
	intro: {
		...paperStyles(theme),
	},
	introTitle: {
		display: 'block',
		margin: '1rem 0',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
		[theme.breakpoints.up('sm')]: {
			fontSize: '1.5rem',
		},
	},
	breadcrumb: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
		textTransform: 'capitalize',
	},
	panel: {
		width: '100%',
		margin: '.75rem 0',
		borderRadius: 2,
		cursor: 'pointer',
		...paperStyles(theme),
		'&:hover': {
			opacity: .8,
		}
	},
	panelTitle: {
		justifyContent: 'flex-start',
		color: theme.palette.common.white,
		fontSize: '1.5rem',
		fontWeight: 400,
		textTransform: 'capitalize',
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&:hover': {
			backgroundColor: theme.palette.secondary.main,
		}
	},
	advanced: {
		backgroundColor: yellow[700],
		'&:hover': {
			backgroundColor: yellow[700],
		}
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.main,
		}
	},
})

const levelsOrder = ['beginner', 'advanced', 'expert']

class LessonsContent extends React.Component {
	setLesson = (level) => () => {
		const { dispatch, lessonsContentPath } = this.props

		dispatch(setLesson(lessonsContentPath.split('.').concat([level])))
		dispatch(setAppbarTitle('Lessons > ' + lessonsContentPath.replace(/-/g, " ").replace(/\./g, " > ")))
	}

	renderLevels = levels => {
		const { classes, lessonsContentPath } = this.props

		levels = Object.keys(levels)

		levels.sort(function(x, y) {
			if (levelsOrder.indexOf(x) < levelsOrder.indexOf(y)) return -1
			if (levelsOrder.indexOf(x) > levelsOrder.indexOf(y)) return 1
			return 0
		})

		return (
			<div>
				<Typography className={classes.breadcrumb} variant="subtitle1">{lessonsContentPath.split(".").join(" > ").replace(/-/g, ' ')}</Typography>

				{levels.map((level, i) => {
					if (level === "content") return null

					return (
						<Button
							key={i}
							className={classNames(classes.panel, classes[level])}
							classes={{label: classes.panelTitle}}
							variant="contained"
							onClick={this.setLesson(level)}
						>
							{level}
						</Button>
					)
				})}
			</div>
		)
	}

	renderDefault = () => {
		const { classes } = this.props

		return (
			<Paper className={classes.intro}>
				<Typography className={classes.introTitle} variant="h2">Lessons</Typography>
				<Typography paragraph>Use the menu panel on the left to navigate lesson categories.</Typography>
			</Paper>
		)
	}

	render() {
		const { classes, content, lessonsContentPath, locale } = this.props

		let levels = get(content, `${locale}.${lessonsContentPath}`)

		if (!levels) return this.renderDefault()
		else return this.renderLevels(levels)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(LessonsContent))