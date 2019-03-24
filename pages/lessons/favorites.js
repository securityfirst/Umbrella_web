import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import LessonCardTile from '../../components/lessons/LessonCardTile'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle } from '../../store/actions/view'
import { getLessonCardsFavorites } from '../../store/actions/lessons'

const styles = theme => ({
	...contentStyles(theme),
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
	static async getInitialProps({reduxStore}) {
		await reduxStore.dispatch(getLessonCardsFavorites())
		await reduxStore.dispatch(setAppbarTitle('Lessons > Favorites'))
	}

	closeFavorites = () => {
		this.props.dispatch(toggleLessonsFavoritesView(false))
		this.props.dispatch(setAppbarTitle('Lessons'))
	}

	render() {
		const { classes, getLessonCardsFavoritesLoading, getLessonCardsFavoritesError, lessonCardsFavorites } = this.props

		if (getLessonCardsFavoritesLoading) return <Loading />
		else if (getLessonCardsFavoritesError) return <ErrorMessage error={getLessonCardsFavoritesError} />

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.content}>
					<Typography className={classes.label} variant="subtitle1">Lesson Favorites</Typography>

					{!lessonCardsFavorites.length
						? <Paper className={classes.paper}>
							<Typography>You do not have any favourite lessons saved.</Typography>
						</Paper>
						: <div className={classes.cardsWrapper}>
							{lessonCardsFavorites.map((file, i) => (
								<LessonCardTile 
									key={i} 
									index={i} 
									file={file} 
									level={file.level} 
									isFavorited 
								/>
							))}
						</div>
					}
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsFavorites))