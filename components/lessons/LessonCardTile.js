import React from 'react'
import Link from 'next/link'
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

import { getNameFromFilenameMd } from '../../utils/github'

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
	color0: {
		backgroundColor: theme.palette.secondary.main,
	},
	color1: {
		backgroundColor: yellow[700],
	},
	color2: {
		backgroundColor: theme.palette.primary.main,
	},
})

class LessonCardTile extends React.Component {
	onFavoriteToggle = () => {
		this.props.dispatch(addLessonCardFavorite(this.props.file, this.props.category, this.props.level))
	}

	/* TODO: Remove this and change add to toggle */
	onFavoriteRemove = () => {
		this.props.dispatch(removeLessonCardFavorite(this.props.file))
	}

	render() {
		const { classes, lessonCardsFavorites, index, file, locale, category, level, isFavorited } = this.props

		const title = getNameFromFilenameMd(file.name)
		const isFavoriteAdded = !!lessonCardsFavorites.find(item => item.name === file.name)
		const href = category === 'glossary'
			? `/lessons/${locale}/glossary/-/${file.sha}`
			: `/lessons/${locale}/${category}/${level}/${file.sha}`

		return (
			<Card key={index} className={classes.card}>
				<Link href={href}>
					<CardActionArea>
						{/* Alternate color in threes */}
						<CardContent className={classNames(classes.cardHead, classes['color' + (index % 3).toString()])}>
							{!isNaN(index) && <Typography className={classes.cardTitle}>{index+1}</Typography>}
							<Typography className={classes.cardTitle}>{title}</Typography>
						</CardContent>
					</CardActionArea>
				</Link>
				<CardActions classes={{root: classes.cardActions}}>
					<FavoriteShareIcons
						onFavoriteRemove={this.onFavoriteRemove}
						name={title.replace(/ /g, '')}
						sha={file.sha}
						url={`${process.env.ROOT}${href}`}
						onFavoriteToggle={this.onFavoriteToggle}
						isFavorited={isFavorited}
						isFavoriteAdded={isFavoriteAdded}
					/>
				</CardActions>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles)(LessonCardTile))