import React from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import LessonCardTile from '../../components/lessons/LessonCardTile'

import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle, toggleLessonsMenu } from '../../store/actions/view'
import { getLessonCardsFavorites } from '../../store/actions/lessons'

const styles = theme => ({
	...contentStyles(theme),
	contentAdditional: {
		[theme.breakpoints.down('md')]: {
			paddingTop: '50px',
		},
	},
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
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
	componentDidMount() {
		const { dispatch, locale, systemLocaleMap } = this.props
		dispatch(getLessonCardsFavorites())
		dispatch(setAppbarTitle(systemLocaleMap[locale].lesson_title))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].lesson_title))
		}
	}

	componentWillUnmount() {
		this.props.dispatch(toggleLessonsMenu(false))
	}

	render() {
		const { 
			classes, 
			locale, 
			systemLocaleMap, 
			getLessonCardsFavoritesLoading, 
			getLessonCardsFavoritesError, 
			lessonCardsFavorites 
		} = this.props

		if (getLessonCardsFavoritesLoading) return <Loading />
		else if (getLessonCardsFavoritesError) return <ErrorMessage error={getLessonCardsFavoritesError} />

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].lesson_title}`} description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classNames(classes.content, classes.contentAdditional)}>
						<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].lesson_favorites_title}</Typography>

						{!lessonCardsFavorites.length
							? <Paper className={classes.paper}>
								<Typography>{systemLocaleMap[locale].lesson_empty_favorites_message}</Typography>
							</Paper>
							: <div className={classes.cardsWrapper}>
								{lessonCardsFavorites.map((file, i) => (
									<LessonCardTile 
										key={i} 
										index={i} 
										file={file} 
										category={file.category}
										level={file.level} 
										isFavorited 
									/>
								))}
							</div>
						}
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsFavorites))