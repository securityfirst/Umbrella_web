import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import CloseIcon from '@material-ui/icons/Close'

import Layout from '../layout'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import LessonCardTile from './LessonCardTile'

import { contentStyles, paperStyles } from '../../utils/view'

import { toggleLessonsFavoritesView, setAppbarTitle } from '../../store/actions/view'

const styles = theme => ({
	lessonClose: {
		position: 'absolute',
		top: '.5rem',
		right: '.5rem',
		minWidth: '45px',
	},
	label: {
		margin: '1rem 0',
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
	paper: {
		position: 'relative',
		...paperStyles(theme),
	},
	cardsWrapper: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
	},
})

class LessonsFavorites extends React.Component {
	closeFavorites = () => {
		this.props.dispatch(toggleLessonsFavoritesView(false))
		this.props.dispatch(setAppbarTitle('Lessons'))
	}

	render() {
		const { classes, getLessonCardsFavoritesLoading, getLessonCardsFavoritesError, lessonCardsFavorites } = this.props

		if (getLessonCardsFavoritesLoading) return <Loading />
		else if (getLessonCardsFavoritesError) return <ErrorMessage error={getLessonCardsFavoritesError} />

		return (
			<React.Fragment>
				<Button className={classes.lessonClose} size="small" onClick={this.closeFavorites}>
					<CloseIcon className={classes.lessonCloseIcon} />
				</Button>

				<Typography className={classes.label} variant="subtitle1">Lesson Favorites</Typography>

				{!lessonCardsFavorites.length
					? <Paper className={classes.paper}>
						<Typography>You do not have any favourite lessons saved.</Typography>
					</Paper>
					: <div className={classes.cardsWrapper}>
						{lessonCardsFavorites.map((file, i) => <LessonCardTile index={i} file={file} />)}
					</div>
				}
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsFavorites))