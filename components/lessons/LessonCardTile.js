import React from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
// import Button from '@material-ui/core/Button'
// import BookmarkIcon from '@material-ui/icons/Bookmark'
// import DeleteIcon from '@material-ui/icons/Delete'
// import ShareIcon from '@material-ui/icons/Share'

import yellow from '@material-ui/core/colors/yellow'
// import teal from '@material-ui/core/colors/teal'

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
		backgroundColor: theme.palette.primary.main, // TODO: Add level color background
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
	// cardActionIcon: {
	// 	color: theme.palette.grey[600],
	// },
	// cardActionIconActive: {
	// 	color: teal[500],
	// },
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

	onFavoriteAdd = () => {
		this.props.dispatch(addLessonCardFavorite(this.props.file, this.props.level))
	}

	onFavoriteRemove = () => {
		this.props.dispatch(removeLessonCardFavorite(this.props.file))
	}

	/* TODO */
	onShare = () => {

	}

	render() {
		const { classes, lessonCardsFavorites, index, file, level, isFavorited } = this.props

		const title = file.name.slice(2).replace(/\.md/, '').replace(/-/g, ' ')
		const isFavoriteAdded = !!lessonCardsFavorites.find(item => item.name === file.name)

		return (
			<Card className={classes.card}>
				<CardActionArea onClick={this.onClick}>
					<CardContent className={classNames(classes.cardHead, classes[level])}>
						{!isNaN(index) && <Typography className={classes.cardTitle}>{index+1}</Typography>}
						<Typography className={classes.cardTitle}>{title}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions classes={{root: classes.cardActions}}>
					<FavoriteShareIcons
						onFavoriteRemove={this.onFavoriteRemove}
						onFavoriteAdd={this.onFavoriteAdd}
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

export default connect(mapStateToProps)(withStyles(styles)(LessonCardTile))