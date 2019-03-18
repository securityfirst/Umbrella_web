import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import ShareIcon from '@material-ui/icons/Share'

import { getLessonFile } from '../../store/actions/lessons'
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
	cardActionIcon: {
		color: theme.palette.grey[600],
	},
})

class LessonCardTile extends React.Component {
	onClick = () => {
		const { dispatch, file } = this.props

		dispatch(toggleLessonFileView(true))
		dispatch(getLessonFile(file.sha))
	}

	onFavorite = () => {

	}

	onShare = () => {

	}

	render() {
		const { classes, index, file } = this.props

		const title = file.name.slice(2).replace(/\.md/, '').replace(/-/g, ' ')

		let optionalProps = {}
		if (!isNaN(index)) optionalProps.key = index

		return (
			<Card className={classes.card} {...optionalProps}>
				<CardActionArea onClick={this.onClick}>
					<CardContent className={classes.cardHead}>
						{!isNaN(index) && <Typography className={classes.cardTitle}>{index+1}</Typography>}
						<Typography className={classes.cardTitle}>{title}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions classes={{root: classes.cardActions}}>
					<Button size="small" className={classes.cardActionIcon} onClick={this.onFavorite}><BookmarkIcon /></Button>
					<Button size="small" className={classes.cardActionIcon} onClick={this.onShare}><ShareIcon /></Button>
				</CardActions>
			</Card>
		)
	}
}

export default connect()(withStyles(styles)(LessonCardTile))