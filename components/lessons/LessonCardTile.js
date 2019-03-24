import React from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import yellow from '@material-ui/core/colors/yellow'

import FavoriteShareIcons from '../common/FavoriteShareIcons'

import { getLessonFile, addLessonCardFavorite, removeLessonCardFavorite } from '../../store/actions/lessons'
import { toggleLessonFileView } from '../../store/actions/view'

const styles = theme => ({
	card: {
		margin: '1rem 0',
		[theme.breakpoints.up('sm')]: {
			width: '23%',
			margin: '1%',
		},
	},
	cardHead: {
		padding: '1rem',
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.up('sm')]: {
			minHeight: '8rem',
		},
	},
	cardTitle: {
		display: 'block',
		color: 'white',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
	},
	cardActions: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
	},
	advanced: {
		backgroundColor: yellow[700],
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
	},
})

class LessonCardTile extends React.Component {
	onClick = () => {
		const { dispatch, file } = this.props

		dispatch(toggleLessonFileView(true))
		dispatch(getLessonFile(file.sha))
	}

	onFavoriteToggle = () => {
		this.props.dispatch(addLessonCardFavorite(this.props.file, this.props.level))
	}

	/* TODO: Remove this and change add to toggle */
	onFavoriteRemove = () => {
		this.props.dispatch(removeLessonCardFavorite(this.props.file))
	}

	/* TODO */
	onShare = () => {

	}

	render() {
		const { router, classes, lessonCardsFavorites, index, file, level, isFavorited } = this.props

		const title = file.name.slice(2).replace(/\.md/, '').replace(/-/g, ' ')
		const isFavoriteAdded = !!lessonCardsFavorites.find(item => item.name === file.name)

		return (
			<Card className={classes.card}>
				<Link href={`/lessons/cards/${file.sha}`}>
					<CardActionArea>
						<CardContent className={classNames(classes.cardHead, classes[level] || 'advanced')}>
							{!isNaN(index) && <Typography className={classes.cardTitle}>{index+1}</Typography>}
							<Typography className={classes.cardTitle}>{title}</Typography>
						</CardContent>
					</CardActionArea>
				</Link>
				<CardActions classes={{root: classes.cardActions}}>
					<FavoriteShareIcons
						//onFavoriteRemove={this.onFavoriteRemove}
						onFavoriteToggle={this.onFavoriteToggle}
						onShare={this.onShare}
						isFavorited={isFavorited}
						isFavoriteAdded={isFavoriteAdded}
					/>
				</CardActions>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles)(LessonCardTile)))